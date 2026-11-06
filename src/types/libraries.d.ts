declare module 'pdfjs-dist/legacy/build/pdf.mjs' {
  export interface TextItem {
    str?: string;
    dir?: string;
    width?: number;
    height?: number;
    transform?: number[];
    fontName?: string;
    hasEOL?: boolean;
  }

  export interface TextContent {
    items: (TextItem | { str?: string })[];
    styles?: Record<string, unknown>;
  }

  export interface PDFPageProxy {
    pageNumber: number;
    getTextContent: () => Promise<TextContent>;
    getViewport: (options: { scale: number }) => { width: number; height: number };
    render: (options: {
      canvasContext: unknown;
      viewport: { width: number; height: number };
    }) => { promise: Promise<void> };
  }

  export interface PDFDocumentProxy {
    numPages: number;
    getPage: (pageNumber: number) => Promise<PDFPageProxy>;
  }

  export interface PDFDocumentLoadingTask {
    promise: Promise<PDFDocumentProxy>;
  }

  export function getDocument(src: {
    data: Uint8Array;
    useSystemFonts?: boolean;
    disableFontFace?: boolean;
  }): PDFDocumentLoadingTask;
}

declare module 'mammoth' {
  export interface MammothResult {
    value: string;
    messages: unknown[];
  }
  export function extractRawText(options: { buffer: Buffer }): Promise<MammothResult>;
}

declare module 'officeparser' {
  export interface OfficeParserConfig {
    fileType?: string;
    tempFilesDir?: string;
  }
  export function parseOffice(
    buffer: Buffer | string,
    config?: OfficeParserConfig
  ): Promise<string>;
}

