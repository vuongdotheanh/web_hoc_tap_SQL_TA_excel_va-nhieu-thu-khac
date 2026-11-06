import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { parseOffice } from 'officeparser';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import Tesseract from 'tesseract.js';

interface PageStat {
  page: number;
  charCount: number;
}

interface PdfExtractionResult {
  text: string;
  pageCount: number;
  pageStats: PageStat[];
  method: string;
}

/**
 * Extracts selectable text from a PDF buffer using pdfjs-dist.
 * IMPORTANT: pdfjs-dist v4 requires data to be a Uint8Array, NOT a Node Buffer.
 */
async function extractPdfJs(uint8Data: Uint8Array): Promise<PdfExtractionResult> {
  const loadingTask = pdfjsLib.getDocument({
    data: uint8Data,
    useSystemFonts: true,
    disableFontFace: true,
  });
  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;
  const pageStats: PageStat[] = [];
  let fullText = '';

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = (textContent.items as Array<{ str?: string }>)
      .map((item) => (typeof item?.str === 'string' ? item.str : ''))
      .join(' ')
      .trim();

    pageStats.push({ page: i, charCount: pageText.length });
    if (pageText) {
      fullText += pageText + '\n';
    }
  }

  return {
    text: fullText.trim(),
    pageCount,
    pageStats,
    method: 'pdfjs-dist',
  };
}

/**
 * OCR Fallback for scanned/image-only PDFs.
 * Attempts to render pages to canvas and run Tesseract recognition.
 */
async function ocrPdf(uint8Data: Uint8Array): Promise<{ text: string; success: boolean; error?: string }> {
  try {
    let createCanvasFn: (width: number, height: number) => {
      getContext: (type: string) => unknown;
      toBuffer: (mime: string) => Buffer;
    };
    try {
      // Dynamic runtime import to prevent Turbopack from tracing native binary and creating symlinks/junctions on Windows
      const pkg = 'can' + 'vas';
      const canvasMod = eval('require')(pkg);
      createCanvasFn = canvasMod.createCanvas;
    } catch {
      return {
        text: '',
        success: false,
        error: 'Thư viện Canvas không khả dụng để OCR trên hệ thống này.',
      };
    }

    const loadingTask = pdfjsLib.getDocument({
      data: uint8Data,
      useSystemFonts: true,
      disableFontFace: true,
    });
    const pdf = await loadingTask.promise;
    const maxPages = Math.min(pdf.numPages, 3); // limit pages for server performance
    let fullText = '';

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = createCanvasFn(viewport.width, viewport.height);
      const context = canvas.getContext('2d');
      const renderContext = { canvasContext: context as unknown as CanvasRenderingContext2D, viewport };

      try {
        await (page as { render: (ctx: unknown) => { promise: Promise<void> } }).render(renderContext).promise;
        const pngBuffer = canvas.toBuffer('image/png');
        const { data } = await Tesseract.recognize(pngBuffer, 'eng+vie');
        if (data && data.text) {
          fullText += data.text + '\n';
        }
      } catch (pageErr: unknown) {
        const errObj = pageErr instanceof Error ? pageErr.message : String(pageErr);
        console.warn(`[OCR] Warning: could not render/OCR page ${pageNum}: ${errObj}`);
      }
    }

    return {
      text: fullText.trim(),
      success: fullText.trim().length > 0,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'OCR rendering failure';
    return {
      text: '',
      success: false,
      error: errorMsg,
    };
  }
}

const MAX_FILES = 5;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const MAX_TOTAL_SIZE = 40 * 1024 * 1024; // 40 MB

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.pptx', '.txt', '.md'];

function getExtension(filename: string): string {
  const idx = filename.lastIndexOf('.');
  return idx !== -1 ? filename.slice(idx).toLowerCase() : '';
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files: File[] = [];

    // Extract files sent under 'files' or 'file'
    for (const [key, value] of formData.entries()) {
      if ((key === 'files' || key === 'file') && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'NO_FILES',
          message: 'Không tìm thấy file nào được gửi lên.',
          diagnostics: { filesReceivedCount: 0 },
        },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        {
          success: false,
          error: 'MAX_FILES_EXCEEDED',
          message: `Chỉ được tải lên tối đa ${MAX_FILES} file cùng lúc.`,
          diagnostics: { filesReceivedCount: files.length, limit: MAX_FILES },
        },
        { status: 400 }
      );
    }

    let totalSize = 0;
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: 'FILE_TOO_LARGE',
            message: `File "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)}MB) vượt quá giới hạn 20MB.`,
            diagnostics: { filename: file.name, size: file.size, limit: MAX_FILE_SIZE },
          },
          { status: 400 }
        );
      }
      totalSize += file.size;
    }

    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'TOTAL_SIZE_EXCEEDED',
          message: `Tổng dung lượng các file (${(totalSize / (1024 * 1024)).toFixed(1)}MB) vượt quá giới hạn tối đa 40MB.`,
          diagnostics: { totalSize, limit: MAX_TOTAL_SIZE },
        },
        { status: 400 }
      );
    }

    const processedResults = [];

    for (const file of files) {
      const ext = getExtension(file.name);
      const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        processedResults.push({
          id: fileId,
          name: file.name,
          size: file.size,
          type: 'unknown',
          status: 'error',
          errorMessage: `Định dạng "${ext}" không được hỗ trợ. Vui lòng chỉ tải PDF, DOCX, PPTX, TXT hoặc Markdown.`,
          diagnostics: {
            isValidFile: true,
            mimeType: file.type,
            fileSize: file.size,
            category: 'unsupported_extension',
          },
        });
        continue;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uint8Data = new Uint8Array(arrayBuffer);

        let extractedText = '';
        let extractionMethod = '';
        let pageCount = 0;
        let pageStats: PageStat[] = [];
        let ocrAttempted = false;
        let ocrSuccess = false;
        let ocrError: string | undefined = undefined;

        if (ext === '.txt' || ext === '.md') {
          extractedText = buffer.toString('utf-8');
          extractionMethod = 'plain-text';
          pageCount = 1;
        } else if (ext === '.docx') {
          const mammothResult = await mammoth.extractRawText({ buffer });
          extractedText = mammothResult.value || '';
          extractionMethod = 'mammoth';
          pageCount = 1;
        } else if (ext === '.pptx') {
          const parsed = await parseOffice(buffer, { fileType: 'pptx' });
          extractedText = typeof parsed === 'string' ? parsed : String(parsed);
          extractionMethod = 'officeparser-pptx';
          pageCount = 1;
        } else if (ext === '.pdf') {
          // 1. Primary: Extract using pdfjs-dist with Uint8Array binary format
          try {
            const pdfResult = await extractPdfJs(uint8Data);
            pageCount = pdfResult.pageCount;
            pageStats = pdfResult.pageStats;

            if (pdfResult.text && pdfResult.text.length >= 25) {
              extractedText = pdfResult.text;
              extractionMethod = 'pdfjs-dist';
            }
          } catch (pdfJsErr: unknown) {
            const errStr = pdfJsErr instanceof Error ? pdfJsErr.message : String(pdfJsErr);
            console.warn('[PDF Extract] pdfjs-dist primary failed, trying fallbacks:', errStr);
          }

          // 2. Secondary fallback: officeparser
          if (!extractedText || extractedText.length < 25) {
            try {
              const parsed = await parseOffice(buffer, { fileType: 'pdf' });
              const officeText = typeof parsed === 'string' ? parsed : String(parsed || '');
              if (officeText.trim().length >= 25) {
                extractedText = officeText;
                extractionMethod = 'officeparser-pdf';
              }
            } catch {
              // Ignore fallback error
            }
          }

          // 3. Fallback for image-only/scanned PDFs: OCR
          if (!extractedText || extractedText.length < 25) {
            ocrAttempted = true;
            try {
              const ocrRes = await ocrPdf(uint8Data);
              ocrSuccess = ocrRes.success;
              ocrError = ocrRes.error;
              if (ocrRes.text && ocrRes.text.length >= 25) {
                extractedText = ocrRes.text;
                extractionMethod = 'ocr-tesseract';
              }
            } catch (ocrEx: unknown) {
              ocrSuccess = false;
              ocrError = ocrEx instanceof Error ? ocrEx.message : 'OCR exception';
            }
          }
        }

        const cleaned = extractedText.replace(/\r\n/g, '\n').trim();

        // Safe Diagnostics payload (NO document text or sensitive info)
        const diagnostics = {
          isValidFile: file.size > 0,
          filename: file.name,
          mimeType: file.type || 'application/octet-stream',
          fileSize: file.size,
          pageCount,
          extractionMethod: extractionMethod || 'none',
          ocrAttempted,
          ocrSuccess,
          ocrError,
          pageStatsSample: pageStats.slice(0, 10),
          totalCharsExtracted: cleaned.length,
          category: cleaned.length >= 25 ? 'success' : (ocrAttempted ? 'empty_or_scanned' : 'no_text_found'),
        };

        // Log safe diagnostics to server console (NO document text logged)
        console.log(
          `[DocExtract Diagnostic] File: "${file.name}", Size: ${file.size}B, Pages: ${pageCount}, Method: ${extractionMethod || 'none'}, Chars: ${cleaned.length}, OCR Attempted: ${ocrAttempted}, OCR Success: ${ocrSuccess}`
        );

        if (!cleaned || cleaned.length < 25) {
          let specificError = 'Không tìm thấy văn bản có thể trích xuất trong tài liệu.';
          if (ext === '.pdf') {
            if (pageCount > 0) {
              const ocrDetail = ocrError ? `, lỗi: ${ocrError}` : '';
              specificError = `Tài liệu PDF có ${pageCount} trang nhưng không chứa lớp văn bản có thể chọn. OCR fallback đã được thử (OCR thành công: ${ocrSuccess ? 'Có' : 'Không'}${ocrDetail}). File có thể là tài liệu scan hoặc hình ảnh.`;
            } else {
              specificError = 'Không thể phân tích cấu trúc file PDF. File có thể bị hỏng hoặc có mật khẩu bảo vệ.';
            }
          }

          processedResults.push({
            id: fileId,
            name: file.name,
            size: file.size,
            type: ext.replace('.', ''),
            status: 'empty_or_scanned',
            extractedText: '',
            previewText: '',
            characterCount: 0,
            errorMessage: specificError,
            diagnostics,
          });
        } else {
          processedResults.push({
            id: fileId,
            name: file.name,
            size: file.size,
            type: ext.replace('.', ''),
            status: 'extracted',
            extractedText: cleaned,
            previewText: cleaned.slice(0, 1000) + (cleaned.length > 1000 ? '...' : ''),
            characterCount: cleaned.length,
            diagnostics,
          });
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Lỗi xử lý file';
        console.error('[DocExtract Error]', errorMsg);
        processedResults.push({
          id: fileId,
          name: file.name,
          size: file.size,
          type: ext.replace('.', ''),
          status: 'error',
          errorMessage: `Không thể đọc nội dung file: ${errorMsg}. File có thể bị hỏng hoặc có mật khẩu bảo vệ.`,
          diagnostics: {
            isValidFile: file.size > 0,
            fileSize: file.size,
            category: 'processing_exception',
            error: errorMsg,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      files: processedResults,
    });
  } catch (error: unknown) {
    console.error('[DocExtract Server Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: 'Lỗi máy chủ trong quá trình xử lý file.',
        diagnostics: {
          category: 'server_fatal_exception',
        },
      },
      { status: 500 }
    );
  }
}
