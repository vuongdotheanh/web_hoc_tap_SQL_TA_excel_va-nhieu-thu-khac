'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  CheckCheck,
  Lightbulb,
  X,
  ChevronRight,
  ChevronLeft,
  Zap,
  Eye,
  Terminal,
  Table as TableIcon,
  Sparkles,
  BookOpen,
  HelpCircle,
  FileEdit,
} from 'lucide-react';
import type { Lesson, LessonStep } from '@/types';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';
import QuizSection from './QuizSection';
import OpenEndedSection from './OpenEndedSection';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface LessonViewProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete: () => void;
  lang: Lang;
}

// ---------------------------------------------------------------------------
// SQL Keywords & Syntax Highlighter
// ---------------------------------------------------------------------------

const SQL_KEYWORDS =
  /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|INSERT|UPDATE|DELETE|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|ON|AS|AND|OR|NOT|IN|BETWEEN|LIKE|IS|NULL|COUNT|SUM|AVG|MAX|MIN|DISTINCT|LIMIT|OFFSET|CREATE|TABLE|ALTER|DROP|INDEX|PRIMARY KEY|FOREIGN KEY|REFERENCES|MONTH|YEAR|DAY)\b/gi;

function highlightSQLCode(code: string): React.ReactNode[] {
  const parts = code.split(SQL_KEYWORDS);
  return parts.map((part, i) => {
    if (SQL_KEYWORDS.test(part)) {
      SQL_KEYWORDS.lastIndex = 0;
      return (
        <span key={i} className="text-[#D7FF64] font-bold">
          {part}
        </span>
      );
    }
    // Highlight inline comments
    if (part.includes('--')) {
      const segments = part.split(/(--.*)/g);
      return (
        <React.Fragment key={i}>
          {segments.map((seg, j) =>
            seg.startsWith('--') ? (
              <span key={j} className="text-[#868980] italic">
                {seg}
              </span>
            ) : (
              seg
            ),
          )}
        </React.Fragment>
      );
    }
    return part;
  });
}

// ---------------------------------------------------------------------------
// Parse SQL Example (splits query and sample result preview)
// ---------------------------------------------------------------------------

interface ParsedResultTable {
  headers: string[];
  rows: string[][];
}

interface ParsedSQLExample {
  query: string;
  resultTable: ParsedResultTable | null;
  rawResultText: string | null;
}

function parseSQLExample(raw: string): ParsedSQLExample {
  const resultMatch = raw.match(/(--\s*(?:kết quả|result|output)[\s\S]*)/i);
  if (!resultMatch || resultMatch.index === undefined) {
    return { query: raw.trim(), resultTable: null, rawResultText: null };
  }

  const query = raw.substring(0, resultMatch.index).trim();
  const rawResult = resultMatch[1].trim();

  // Parse lines starting with "--" into table rows
  const lines = rawResult
    .split('\n')
    .map((l) => l.replace(/^--\s*/, '').trim())
    .filter((l) => l.length > 0 && !l.match(/^(?:kết quả|result|output):?$/i));

  const tableRows = lines
    .filter((l) => l.includes('|'))
    .map((l) =>
      l
        .split('|')
        .map((c) => c.trim())
        .filter((c) => c.length > 0),
    );

  if (tableRows.length >= 2) {
    const headers = tableRows[0];
    const rows = tableRows.slice(1);
    return {
      query,
      resultTable: { headers, rows },
      rawResultText: null,
    };
  }

  return {
    query,
    resultTable: null,
    rawResultText: lines.join('\n'),
  };
}

// ---------------------------------------------------------------------------
// Markdown Parser & Renderer
// ---------------------------------------------------------------------------

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block ```
    if (line.trim().startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const code = codeLines.join('\n');
      elements.push(
        <div
          key={`code-${i}`}
          className="my-4 rounded-xl overflow-hidden border border-[#283830] bg-[#151C18] text-[#F7F6F0] shadow-sm font-mono text-sm leading-relaxed"
        >
          <div className="bg-[#1C2621] px-4 py-2 border-b border-white/10 flex items-center justify-between text-xs text-[#868980]">
            <span className="font-semibold text-[#D7FF64]">SQL CODE</span>
          </div>
          <pre className="p-4 overflow-x-auto">
            <code>{highlightSQLCode(code)}</code>
          </pre>
        </div>,
      );
      continue;
    }

    // Markdown Table
    if (line.trim().startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines
        .filter((l) => !l.match(/^\|[\s-|]+\|$/))
        .map((l) =>
          l
            .split('|')
            .filter(Boolean)
            .map((c) => c.trim()),
        );

      if (rows.length > 0) {
        const header = rows[0];
        const body = rows.slice(1);
        elements.push(
          <div
            key={`table-${i}`}
            className="my-4 overflow-hidden rounded-2xl border border-[#82CDE1]/20 bg-[#0A1E32] shadow-xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse text-left">
                <thead>
                  <tr className="bg-[#15354A] text-[#43D5ED] border-b border-[#82CDE1]/20">
                    {header.map((h, hi) => (
                      <th
                        key={hi}
                        className="px-4 py-3 font-extrabold text-xs uppercase tracking-wider text-[#43D5ED] border-r border-[#82CDE1]/15 last:border-r-0"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#82CDE1]/15 text-[#C3D2DF]">
                  {body.map((row, ri) => (
                    <tr
                      key={ri}
                      className={ri % 2 === 0 ? 'bg-[#102B40]' : 'bg-[#0A1E32]'}
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className="px-4 py-2.5 font-medium border-r border-[#82CDE1]/10 last:border-r-0"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>,
        );
      }
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line.trim())) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol
          key={`ol-${i}`}
          className="my-3 ml-6 list-decimal space-y-2 text-[#C3D2DF] whitespace-normal break-words"
        >
          {listItems.map((item, li) => (
            <li key={li} className="leading-relaxed text-[#C3D2DF] whitespace-normal break-words">
              {renderInline(item)}
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    // Unordered bullet list
    if (line.trim().startsWith('- ')) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        listItems.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul
          key={`ul-${i}`}
          className="my-3 ml-5 list-disc space-y-2 text-[#C3D2DF] whitespace-normal break-words"
        >
          {listItems.map((item, li) => (
            <li key={li} className="leading-relaxed text-[#C3D2DF] whitespace-normal break-words">
              {renderInline(item)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p
        key={`p-${i}`}
        className="my-3 text-base sm:text-[17px] leading-relaxed text-[#C3D2DF] font-normal whitespace-normal break-words overflow-wrap-anywhere"
        style={{ overflowWrap: 'anywhere' }}
      >
        {renderInline(line)}
      </p>,
    );
    i++;
  }
  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode {
  const pattern = /(\*\*(.+?)\*\*|`([^`]+)`)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(
        <strong key={match.index} className="font-bold text-[#F5FAFF]">
          {match[2]}
        </strong>,
      );
    } else if (match[3]) {
      parts.push(
        <code
          key={match.index}
          className="bg-[#061625] text-[#43D5ED] px-2 py-0.5 rounded text-[0.9em] font-mono font-bold border border-[#43D5ED]/30"
        >
          {match[3]}
        </code>,
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

// ---------------------------------------------------------------------------
// Helpers: Detect if an example string is actual code
// ---------------------------------------------------------------------------

function isActualCode(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();

  // If already wrapped in markdown code fence
  if (trimmed.startsWith('```')) return true;

  // SQL queries & commands
  const hasSql =
    /\b(SELECT\s+[\s\S]+?\s+FROM|INSERT\s+INTO|UPDATE\s+[\s\S]+?\s+SET|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE)\b/i.test(
      trimmed,
    );
  if (hasSql) return true;

  // Typical programming code constructs (JS, Python, Java, etc.)
  const hasProgramming =
    /\b(const|let|var|function|return|import|export|class|def|async|await|console\.log)\b/.test(
      trimmed,
    ) && /[{};()]/.test(trimmed);
  if (hasProgramming) return true;

  // Structured query result tables or SQL comment output
  if (/^\s*--\s*(?:SELECT|INSERT|UPDATE|DELETE|kết quả|output|result)/i.test(trimmed)) {
    return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// Dedicated SQL Code & Result Preview Component
// ---------------------------------------------------------------------------

function SQLCodePanel({ rawCode, lang }: { rawCode: string; lang: Lang }) {
  const [copied, setCopied] = useState(false);
  const parsed = useMemo(() => parseSQLExample(rawCode), [rawCode]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(parsed.query);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [parsed.query]);

  const codeLines = parsed.query.split('\n');

  return (
    <div className="my-6 space-y-4">
      {/* 1. SQL Query Block */}
      <div className="rounded-2xl overflow-hidden border-2 border-[#283830] bg-[#151C18] text-[#F7F6F0] shadow-md">
        {/* Editor Window Header */}
        <div className="bg-[#1C2621] px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Window dot accents */}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#D7FF64]">
              <Terminal size={14} />
              <span>SQL QUERY</span>
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#D7FF64] bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/10 transition-colors cursor-pointer"
            aria-label={lang === 'vi' ? 'Sao chép câu lệnh SQL' : 'Copy SQL query'}
          >
            {copied ? (
              <>
                <CheckCheck size={14} className="text-[#D7FF64]" />
                <span className="text-[#D7FF64]">{translations.lesson.copied[lang]}</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>{translations.lesson.copyCode[lang]}</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="p-4 sm:p-5 overflow-x-auto font-mono text-sm leading-relaxed">
          <table className="border-collapse w-full">
            <tbody>
              {codeLines.map((line, idx) => (
                <tr key={idx} className="hover:bg-white/[0.04]">
                  <td className="pr-4 select-none text-[#52635B] text-right text-xs font-mono w-8 align-top py-0.5">
                    {idx + 1}
                  </td>
                  <td className="text-[#F7F6F0] whitespace-pre py-0.5">
                    {highlightSQLCode(line)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Result Preview Section (Clearly separated) */}
      {parsed.resultTable && (
        <div className="rounded-2xl border border-[#82CDE1]/15 bg-[#102B40]/90 p-5 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#82CDE1]/15">
            <div className="w-6 h-6 rounded-md bg-[#0A1E32] border border-[#82CDE1]/20 flex items-center justify-center text-[#43D5ED]">
              <TableIcon size={14} />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#43D5ED]">
              {lang === 'vi' ? 'Kết quả mẫu trả về (Output Preview)' : 'Sample Query Output'}
            </span>
            <span className="ml-auto text-xs font-semibold text-[#93A8B8]">
              {parsed.resultTable.rows.length} {lang === 'vi' ? 'dòng kết quả' : 'rows'}
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#82CDE1]/15">
            <table className="w-full text-sm border-collapse text-left">
              <thead>
                <tr className="bg-[#0A1E32] border-b border-[#82CDE1]/15">
                  {parsed.resultTable.headers.map((h, hi) => (
                    <th
                      key={hi}
                      className="px-4 py-2.5 font-bold text-xs uppercase tracking-wider text-[#C3D2DF] border-r border-[#82CDE1]/15 last:border-r-0"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#82CDE1]/10 text-[#F5FAFF]">
                {parsed.resultTable.rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className={ri % 2 === 0 ? 'bg-[#102B40]' : 'bg-[#0A1E32]/70'}
                  >
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className="px-4 py-2 font-mono text-xs font-medium text-[#F5FAFF] border-r border-[#82CDE1]/10 last:border-r-0"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Raw Result fallback */}
      {!parsed.resultTable && parsed.rawResultText && (
        <div className="rounded-2xl border border-[#82CDE1]/15 bg-[#102B40]/90 p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#43D5ED] block mb-2">
            {lang === 'vi' ? 'Kết quả mẫu' : 'Sample Output'}
          </span>
          <pre className="font-mono text-xs text-[#43D5ED] bg-[#061625] p-3 rounded-lg border border-[#82CDE1]/15">
            {parsed.rawResultText}
          </pre>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Confetti Animation
// ---------------------------------------------------------------------------

const CONFETTI_COLORS = [
  '#D7FF64',
  '#163D32',
  '#DCD5FF',
  '#F17B61',
  '#FFD166',
  '#06D6A0',
  '#118AB2',
  '#D7FF64',
];
const CONFETTI_OFFSETS = [4, 1, 5, 2, 6, 2, 4, 1];
const CONFETTI_SIZES = [10, 14, 8, 12, 10, 14, 8, 12];

function ConfettiParticles() {
  const particles = useMemo(
    () =>
      CONFETTI_COLORS.map((color, i) => ({
        color,
        left: `${12 + i * 10 + CONFETTI_OFFSETS[i % CONFETTI_OFFSETS.length]}%`,
        delay: `${i * 0.08}s`,
        size: CONFETTI_SIZES[i % CONFETTI_SIZES.length],
      })),
    [],
  );

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-sm"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            border: '1.5px solid #163D32',
            left: p.left,
            top: '55%',
            animation: `confettiBurst 1s ease-out ${p.delay} both`,
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Content Step View (Steps 1 & 2)
// ---------------------------------------------------------------------------

function ContentStepView({
  step,
  onNext,
  onPrev,
  hasPrev,
  lang,
}: {
  step: LessonStep;
  onNext: () => void;
  onPrev?: () => void;
  hasPrev: boolean;
  lang: Lang;
}) {
  const t = translations.lesson;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Step Header */}
      <div className="border-b border-[#82CDE1]/15 pb-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#15354A] border border-[#43D5ED]/30 text-[#43D5ED] mb-2">
          {lang === 'vi' ? 'Nội dung kiến thức' : 'Core Concept'}
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F5FAFF] leading-tight">
          {step.title}
        </h2>
      </div>

      {/* Main Content Card — High-contrast dark elevated surface */}
      <div className="bg-[#102B40]/98 rounded-3xl border border-[#82CDE1]/25 p-6 sm:p-8 lg:p-10 shadow-2xl w-full space-y-6 text-[#F5FAFF]">
        <div className="prose-content">{renderMarkdown(step.content)}</div>

        {/* Example: Differentiate real code from explanatory/theory text */}
        {step.example &&
          (isActualCode(step.example) ? (
            <SQLCodePanel rawCode={step.example} lang={lang} />
          ) : (
            <div className="rounded-2xl border border-[#82CDE1]/20 bg-[#061625]/90 p-5 sm:p-6 shadow-inner text-[#F5FAFF]">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#82CDE1]/15 text-xs font-bold uppercase tracking-wider text-[#43D5ED]">
                <Sparkles size={15} />
                <span>{lang === 'vi' ? 'Ví dụ minh họa' : 'Illustrative Example'}</span>
              </div>
              <div className="prose-content text-[#C3D2DF] leading-relaxed">
                {renderMarkdown(step.example)}
              </div>
            </div>
          ))}
      </div>

      {/* Action Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#82CDE1]/15">
        {hasPrev && onPrev ? (
          <button
            onClick={onPrev}
            className="inline-flex items-center gap-2 bg-[#15354A] hover:bg-[#1E4661] text-[#F5FAFF] border border-[#82CDE1]/20 font-semibold px-5 py-3 rounded-xl transition-all cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
            <span>{lang === 'vi' ? 'Quay lại' : 'Previous'}</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-[#43D5ED] hover:bg-[#6BE0F5] text-[#061625] font-black text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-[0_0_15px_rgba(67,213,237,0.3)] transition-all duration-150 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43D5ED]"
        >
          <span>{t.continue[lang]}</span>
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exercise Step View (Step 3: Interactive SQL Challenge)
// ---------------------------------------------------------------------------

type AnswerStatus = 'idle' | 'correct' | 'incorrect';

function ExerciseStepView({
  step,
  onComplete,
  onPrev,
  lang,
}: {
  step: LessonStep;
  onComplete: () => void;
  onPrev: () => void;
  lang: Lang;
}) {
  const exercise = step.exercise!;
  const t = translations.lesson;

  const [userCode, setUserCode] = useState(exercise.initialCode ?? '');
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('idle');
  const [attempts, setAttempts] = useState(0);

  const handleCheck = useCallback(() => {
    const code = userCode.toLowerCase();
    const requiredKeywords = [
      'group by',
      'sum',
      'month',
      'order_date',
      'amount',
      'orders',
    ];
    const allPresent = requiredKeywords.every((kw) => code.includes(kw));
    setAnswerStatus(allPresent ? 'correct' : 'incorrect');
    setAttempts((a) => a + 1);
  }, [userCode]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Challenge Title */}
      <div className="border-b border-[#20231F]/10 pb-4">
        <span className="inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#D7FF64] text-[#163D32] mb-2">
          {lang === 'vi' ? 'Thực hành thử thách' : 'Hands-on Challenge'}
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#20231F] leading-tight">
          {step.title}
        </h2>
      </div>

      {/* Challenge Objective Card */}
      <div className="liquid-glass-card rounded-2xl border border-[#82CDE1]/15 bg-[#102B40]/90 p-6 sm:p-8 lg:p-10 shadow-sm space-y-5 w-full">
        <div className="prose-content">{renderMarkdown(step.content)}</div>

        {/* Prompt callout */}
        <div className="bg-[#0A1E32]/85 border-l-4 border-[#43D5ED] p-4 sm:p-5 rounded-r-xl">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#43D5ED] block mb-1">
            {lang === 'vi' ? 'Yêu cầu bài tập' : 'Assignment Task'}
          </span>
          <p className="text-base sm:text-lg font-bold text-[#F5FAFF] leading-relaxed whitespace-normal break-words">
            {exercise.prompt}
          </p>
        </div>

        {/* Code Editor Panel */}
        <div className="rounded-2xl overflow-hidden border border-[#82CDE1]/25 bg-[#061625] text-[#F5FAFF] shadow-md focus-within:border-[#43D5ED] transition-colors">
          {/* Header */}
          <div className="bg-[#0A1E32] px-4 py-3 border-b border-[#82CDE1]/15 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#43D5ED] font-bold">
              <Terminal size={14} />
              <span>SQL QUERY EDITOR</span>
            </div>
            <span className="text-[#93A8B8] font-mono tabular-nums">
              {userCode.length} chars
            </span>
          </div>

          {/* Textarea */}
          <textarea
            value={userCode}
            onChange={(e) => {
              setUserCode(e.target.value);
              if (answerStatus !== 'idle') setAnswerStatus('idle');
            }}
            spellCheck={false}
            rows={6}
            className="w-full bg-[#061625] text-[#F5FAFF] p-4 font-mono text-sm leading-relaxed resize-y focus:outline-none selection:bg-[#43D5ED] selection:text-[#061625]"
            placeholder="SELECT ..."
            aria-label="SQL Code editor"
          />
        </div>

        {/* Action Controls Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Hint Button */}
          <button
            onClick={() => setShowHint((h) => !h)}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
              showHint
                ? 'bg-[#43D5ED]/15 border-[#43D5ED] text-[#43D5ED]'
                : 'bg-[#0A1E32]/70 border-[#82CDE1]/20 text-[#C3D2DF] hover:border-[#82CDE1]/40 hover:bg-[#15354A] hover:text-[#F5FAFF]'
            }`}
          >
            <Lightbulb size={15} strokeWidth={2.5} />
            <span>{t.hint[lang]}</span>
          </button>

          {/* Show Solution Button (after attempt) */}
          {attempts > 0 && answerStatus !== 'correct' && (
            <button
              onClick={() => setShowSolution((s) => !s)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-[#FF7777]/20 border border-[#FF7777]/40 hover:bg-[#FF7777]/30 text-[#FF7777] shadow-sm transition-all cursor-pointer"
            >
              <Eye size={15} strokeWidth={2.5} />
              <span>{t.showSolution[lang]}</span>
            </button>
          )}

          {/* Check Button (Primary Check) */}
          <button
            onClick={handleCheck}
            className="btn-lime inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold px-6 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer active:scale-[0.98]"
          >
            <Zap size={16} strokeWidth={2.5} className="text-[#061625]" />
            <span>{t.check[lang]}</span>
          </button>

          {/* Continue / Finish Button */}
          <button
            onClick={onComplete}
            disabled={answerStatus !== 'correct'}
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold px-6 py-2.5 rounded-xl ml-auto transition-all ${
              answerStatus === 'correct'
                ? 'bg-[#D9F66F] hover:bg-[#CEF05B] text-[#163D32] shadow-sm cursor-pointer active:scale-[0.98]'
                : 'bg-[#F0F1EB] text-[#A6AEA1] border border-[#E1E5DE] cursor-not-allowed'
            }`}
          >
            <span>{t.continue[lang]}</span>
            <ChevronRight size={16} strokeWidth={3} />
          </button>
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="mt-4 p-4 rounded-xl border-2 border-[#DCD5FF] bg-[#DCD5FF]/20 text-[#163D32] animate-fade-in flex items-start gap-3">
            <Lightbulb
              size={18}
              className="text-[#163D32] mt-0.5 shrink-0"
              strokeWidth={2.5}
            />
            <div className="text-sm leading-relaxed font-medium">
              <strong className="block font-bold mb-0.5">
                {lang === 'vi' ? 'Gợi ý từ SkillBite:' : 'Helpful Hint:'}
              </strong>
              {exercise.hint}
            </div>
          </div>
        )}

        {/* Solution Box */}
        {showSolution && (
          <div className="mt-4 p-5 rounded-xl border-2 border-[#F17B61] bg-[#F17B61]/10 text-[#20231F] animate-fade-in">
            <div className="flex items-center gap-2 mb-2 text-[#F17B61] font-bold text-xs uppercase tracking-wider">
              <Eye size={15} />
              <span>{t.showSolution[lang]}</span>
            </div>
            <div className="prose-content">{renderMarkdown(exercise.explanation)}</div>
          </div>
        )}

        {/* Feedback: Correct */}
        {answerStatus === 'correct' && (
          <div className="mt-5 rounded-xl border border-[#48C8A4]/40 bg-[#48C8A4]/10 p-5 animate-fade-in">
            <div className="flex items-center gap-2 text-[#48C8A4] font-black text-base mb-3">
              <Check size={20} strokeWidth={3} />
              <span>{t.correct[lang]}</span>
            </div>
            <div className="text-[#F5FAFF] text-sm leading-relaxed font-medium bg-[#0A1E32]/90 p-4 rounded-lg border border-[#48C8A4]/25">
              {renderMarkdown(exercise.explanation)}
            </div>
          </div>
        )}

        {/* Feedback: Incorrect */}
        {answerStatus === 'incorrect' && (
          <div className="mt-5 rounded-xl border border-[#FF7777]/40 bg-[#FF7777]/10 p-4 animate-fade-in flex items-center gap-3">
            <X size={20} strokeWidth={3} className="text-[#FF7777] shrink-0" />
            <div>
              <span className="font-black text-[#FF7777] text-sm">
                {t.incorrect[lang]}
              </span>{' '}
              <span className="text-sm text-[#C3D2DF] font-medium">
                {t.tryAgain[lang]}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Back button row */}
      <div className="flex items-center justify-between pt-4 border-t border-[#82CDE1]/15">
        <button
          onClick={onPrev}
          className="inline-flex items-center gap-2 bg-[#0A1E32]/80 hover:bg-[#15354A] text-[#F5FAFF] border border-[#82CDE1]/25 font-bold px-5 py-3 rounded-xl transition-all cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
          <span>{lang === 'vi' ? 'Xem lại lý thuyết' : 'Review Concept'}</span>
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Completion Screen
// ---------------------------------------------------------------------------

function CompletionScreen({
  lesson,
  onComplete,
  lang,
}: {
  lesson: Lesson;
  onComplete: () => void;
  lang: Lang;
}) {
  const t = translations.lesson;

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 animate-fade-in-up">
      {/* Trophy & Confetti */}
      <div className="relative mb-6">
        <ConfettiParticles />
        <div className="w-24 h-24 rounded-2xl bg-[#0A1E32] border-2 border-[#43D5ED]/40 flex items-center justify-center shadow-lg shadow-[#43D5ED]/10 animate-celebrate">
          <span className="text-5xl select-none" role="img" aria-label="Celebration">
            🎉
          </span>
        </div>
      </div>

      <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5FAFF] mb-2 animate-celebrate">
        {t.completionTitle[lang]}
      </h2>
      <p className="text-[#C3D2DF] font-medium text-base sm:text-lg max-w-md mb-8">
        {t.completionDesc[lang]}{' '}
        <span className="font-bold text-[#43D5ED]">{lesson.title}</span>
      </p>

      {/* Summary Stat Badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
        <div className="bg-[#102B40]/90 rounded-xl border border-[#82CDE1]/20 px-6 py-4 shadow-sm text-center">
          <p className="text-2xl font-black text-[#43D5ED]">+{lesson.duration} min</p>
          <p className="text-xs font-bold uppercase tracking-wider text-[#93A8B8] mt-1">
            {t.studyTime[lang]}
          </p>
        </div>
        <div className="bg-[#102B40]/90 rounded-xl border border-[#82CDE1]/20 px-6 py-4 shadow-sm text-center">
          <p className="text-2xl font-black text-[#D9F66F]">13 🔥</p>
          <p className="text-xs font-bold uppercase tracking-wider text-[#93A8B8] mt-1">
            {t.streak[lang]}
          </p>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={onComplete}
          className="btn-lime inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-xl shadow-md text-base transition-all cursor-pointer active:scale-[0.98]"
        >
          <Sparkles size={18} className="text-[#061625]" />
          <span>{t.backToDashboard[lang]}</span>
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main LessonView Screen
// ---------------------------------------------------------------------------

export default function LessonView({
  lesson,
  onBack,
  onComplete,
  lang,
}: LessonViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<'theory' | 'quiz' | 'open_ended'>('theory');
  const t = translations.lesson;

  // Track exercise scores
  const [quizScoreInfo, setQuizScoreInfo] = useState<{ score: number; total: number } | null>(null);
  const [openEndedScoreInfo, setOpenEndedScoreInfo] = useState<{ score: number; max: number } | null>(null);

  const totalSteps = lesson.steps.length;
  const step = lesson.steps[currentStep];

  const hasQuizzes = (lesson.quizzes && lesson.quizzes.length > 0) || lesson.steps.some(s => s.type === 'quiz' && s.quizQuestion);
  const hasOpenEnded = (lesson.openEndedExercises && lesson.openEndedExercises.length > 0) || lesson.steps.some(s => s.type === 'open_ended' && s.openEndedExercise);

  const allQuizzes = useMemo(() => {
    if (lesson.quizzes && lesson.quizzes.length > 0) return lesson.quizzes;
    const extracted: NonNullable<typeof lesson.quizzes> = [];
    lesson.steps.forEach(s => {
      if (s.type === 'quiz' && s.quizQuestion) extracted.push(s.quizQuestion);
    });
    return extracted;
  }, [lesson]);

  const allOpenEnded = useMemo(() => {
    if (lesson.openEndedExercises && lesson.openEndedExercises.length > 0) return lesson.openEndedExercises;
    const extracted: NonNullable<typeof lesson.openEndedExercises> = [];
    lesson.steps.forEach(s => {
      if (s.type === 'open_ended' && s.openEndedExercise) extracted.push(s.openEndedExercise);
    });
    return extracted;
  }, [lesson]);

  const progressPercent = isComplete
    ? 100
    : Math.round(((currentStep + 1) / totalSteps) * 100);

  const goToNextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setIsComplete(true);
    }
  }, [currentStep, totalSteps]);

  const goToPrevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-[#061625] text-[#F5FAFF] flex flex-col font-sans">
      {/* ───────────────────────────────────────────────────────────
          1. High-Contrast Top Navigation Bar (Cosmic Navy Anchor)
          ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0A1E32]/95 backdrop-blur-xl border-b border-[#82CDE1]/18 shadow-xl">
        <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Action */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#F5FAFF] hover:text-[#43D5ED] bg-[#15354A] hover:bg-[#1E4661] px-3.5 py-2 rounded-xl border border-[#82CDE1]/20 transition-colors cursor-pointer"
              aria-label={t.back[lang]}
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline">{t.back[lang]}</span>
            </button>

            {/* Lesson Title & Metadata */}
            <div className="flex items-center gap-2.5 min-w-0 px-2">
              <span className="bg-[#43D5ED] text-[#061625] text-xs font-black px-2.5 py-0.5 rounded tracking-wide uppercase shrink-0">
                {lesson.skillId === 'custom-ai'
                  ? 'AI ARCHITECT'
                  : lesson.skillId?.toUpperCase() || 'LESSON'}
              </span>
              <h1 className="text-sm sm:text-base font-extrabold text-[#F5FAFF] truncate max-w-[200px] sm:max-w-sm md:max-w-md">
                {lesson.title}
              </h1>
            </div>

            {/* Step Counter Badge */}
            <div>
              {!isComplete ? (
                <div className="bg-[#15354A] border border-[#82CDE1]/20 px-3 py-1.5 rounded-full text-xs font-bold text-[#43D5ED] tabular-nums">
                  {t.step[lang]} {currentStep + 1}/{totalSteps}
                </div>
              ) : (
                <div className="bg-[#D9F66F] text-[#061625] px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1">
                  <Check size={14} strokeWidth={3} />
                  <span>{t.completed[lang]}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Crisp Progress Bar Track underneath header */}
        <div className="h-1.5 w-full bg-[#061625]" aria-hidden="true">
          <div
            className="h-full bg-[#43D5ED] shadow-[0_0_10px_#43D5ED] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────
          2. Main Lesson Canvas (Spacious, responsive container)
          ─────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-4xl lg:max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {!isComplete ? (
          <div className="space-y-6">
            {/* Top Learning Area Mode Switcher (Theory, Quiz, Open-ended) */}
            {(hasQuizzes || hasOpenEnded) && (
              <div className="flex items-center gap-2 p-1.5 bg-[#102B40] rounded-2xl border border-[#82CDE1]/20 shadow-md max-w-md">
                <button
                  type="button"
                  onClick={() => setActiveTab('theory')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'theory'
                      ? 'bg-[#43D5ED] text-[#061625] font-extrabold shadow-sm'
                      : 'text-[#C3D2DF] hover:text-[#F5FAFF] hover:bg-[#15354A]'
                  }`}
                >
                  <BookOpen size={14} />
                  <span>{t.tabTheory[lang]}</span>
                </button>

                {hasQuizzes && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('quiz')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'quiz'
                        ? 'bg-[#43D5ED] text-[#061625] font-extrabold shadow-sm'
                        : 'text-[#C3D2DF] hover:text-[#F5FAFF] hover:bg-[#15354A]'
                    }`}
                  >
                    <HelpCircle size={14} />
                    <span>{t.tabQuiz[lang]} ({allQuizzes.length})</span>
                    {quizScoreInfo && (
                      <span className="text-[10px] bg-[#D9F66F] text-[#061625] px-1.5 py-0.2 rounded font-black">
                        {quizScoreInfo.score}/{quizScoreInfo.total}
                      </span>
                    )}
                  </button>
                )}

                {hasOpenEnded && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('open_ended')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'open_ended'
                        ? 'bg-[#43D5ED] text-[#061625] font-extrabold shadow-sm'
                        : 'text-[#C3D2DF] hover:text-[#F5FAFF] hover:bg-[#15354A]'
                    }`}
                  >
                    <FileEdit size={14} />
                    <span>{t.tabOpenEnded[lang]} ({allOpenEnded.length})</span>
                    {openEndedScoreInfo && (
                      <span className="text-[10px] bg-[#D9F66F] text-[#061625] px-1.5 py-0.2 rounded font-black">
                        {openEndedScoreInfo.score}/{openEndedScoreInfo.max}
                      </span>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* TAB: Dedicated Multiple-Choice Quiz Section */}
            {activeTab === 'quiz' && hasQuizzes && (
              <QuizSection
                quizzes={allQuizzes}
                lang={lang}
                onAllCompleted={(score, total) => setQuizScoreInfo({ score, total })}
              />
            )}

            {/* TAB: Dedicated Open-Ended Analytical Practice Section */}
            {activeTab === 'open_ended' && hasOpenEnded && (
              <OpenEndedSection
                exercises={allOpenEnded}
                lang={lang}
                onAllCompleted={(score, max) => setOpenEndedScoreInfo({ score, max })}
              />
            )}

            {/* TAB: Step-by-Step Learning Flow (Theory & Guided steps) */}
            {activeTab === 'theory' && (
              <div className="space-y-6">
                {/* Step Tracker Chips (Clear learning journey hierarchy) */}
                <div className="flex items-center justify-between gap-2 mb-6 text-xs font-bold overflow-x-auto pb-1">
                  {lesson.steps.map((s, idx) => {
                    const isPassed = idx < currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <button
                        key={s.id}
                        onClick={() => setCurrentStep(idx)}
                        className={`flex-1 min-w-[120px] flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#43D5ED] text-[#061625] border-[#43D5ED] font-black shadow-md shadow-[#43D5ED]/20'
                            : isPassed
                            ? 'bg-[#102B40] text-[#48C8A4] border-[#48C8A4]/30 hover:bg-[#15354A]'
                            : 'bg-[#0A1E32]/60 text-[#93A8B8] border-[#82CDE1]/15 hover:bg-[#102B40] hover:text-[#F5FAFF]'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                            isCurrent
                              ? 'bg-[#061625] text-[#43D5ED]'
                              : isPassed
                              ? 'bg-[#48C8A4]/20 text-[#48C8A4]'
                              : 'bg-[#0A1E32] text-[#93A8B8]'
                          }`}
                        >
                          {isPassed ? <Check size={12} strokeWidth={3} /> : idx + 1}
                        </span>
                        <span className="truncate">{s.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Step Content */}
                {step.type === 'content' && (
                  <ContentStepView
                    key={step.id}
                    step={step}
                    onNext={goToNextStep}
                    onPrev={goToPrevStep}
                    hasPrev={currentStep > 0}
                    lang={lang}
                  />
                )}

                {step.type === 'exercise' && (
                  <ExerciseStepView
                    key={step.id}
                    step={step}
                    onComplete={goToNextStep}
                    onPrev={goToPrevStep}
                    lang={lang}
                  />
                )}

                {step.type === 'quiz' && step.quizQuestion && (
                  <QuizSection
                    key={step.id}
                    quizzes={[step.quizQuestion]}
                    lang={lang}
                    onAllCompleted={(score, total) => {
                      setQuizScoreInfo({ score, total });
                    }}
                  />
                )}

                {step.type === 'open_ended' && step.openEndedExercise && (
                  <OpenEndedSection
                    key={step.id}
                    exercises={[step.openEndedExercise]}
                    lang={lang}
                    onAllCompleted={(score, max) => {
                      setOpenEndedScoreInfo({ score, max });
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <CompletionScreen
            lesson={lesson}
            onComplete={onComplete}
            lang={lang}
          />
        )}
      </main>
    </div>
  );
}
