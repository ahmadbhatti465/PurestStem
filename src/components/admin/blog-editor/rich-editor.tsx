"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Link2,
  ImageIcon,
  Table,
  Minus,
  Code,
  Undo,
  Redo,
  RemoveFormatting,
  Code2,
  Info,
} from "lucide-react";
import LinkModal, { LinkData } from "./link-modal";
import ImageModal, { ImageData } from "./image-modal";
import TableModal from "./table-modal";
import { sanitizeHtml } from "@/lib/html-sanitizer";

interface RichEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichEditor({
  value,
  onChange,
  placeholder = "Write your engaging, informative, herbal wellness article here...",
}: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [sourceMode, setSourceMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState(value || "");
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const savedSelectionRef = useRef<Range | null>(null);

  // Sync internal state when external value changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      if (!sourceMode) {
        editorRef.current.innerHTML = value || "";
      }
    }
    setHtmlContent(value || "");
  }, [value, sourceMode]);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0);
    }
  }, []);

  const restoreSelection = useCallback(() => {
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }
  }, []);

  function handleEditorInput() {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setHtmlContent(html);
      onChange(sanitizeHtml(html));
    }
  }

  function handleSourceChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const raw = e.target.value;
    setHtmlContent(raw);
    onChange(sanitizeHtml(raw));
  }

  function execCmd(command: string, value: string | undefined = undefined) {
    if (sourceMode) return;
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleEditorInput();
  }

  function formatBlock(tag: string) {
    if (sourceMode) return;
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, `<${tag}>`);
    handleEditorInput();
  }

  function openLinkDialog() {
    saveSelection();
    setIsLinkModalOpen(true);
  }

  function handleInsertLink(data: LinkData) {
    restoreSelection();
    editorRef.current?.focus();

    const targetAttr = data.targetBlank ? ' target="_blank"' : "";
    const relAttr = data.rel ? ` rel="${data.rel}"` : "";
    const linkHtml = `<a href="${data.url}"${targetAttr}${relAttr} class="text-green-700 underline underline-offset-4 hover:text-green-800 font-medium">${data.text}</a>`;

    document.execCommand("insertHTML", false, linkHtml);
    handleEditorInput();
  }

  function openImageDialog() {
    saveSelection();
    setIsImageModalOpen(true);
  }

  function handleInsertImage(data: ImageData) {
    restoreSelection();
    editorRef.current?.focus();

    const altAttr = ` alt="${data.alt}"`;
    const titleAttr = data.title ? ` title="${data.title}"` : "";
    const widthAttr = data.width ? ` width="${data.width}"` : "";
    const heightAttr = data.height ? ` height="${data.height}"` : "";
    const creditAttr = data.credit ? ` data-credit="${data.credit}"` : "";

    let imageHtml = `<figure class="my-6 block">
      <img src="${data.url}"${altAttr}${titleAttr}${widthAttr}${heightAttr}${creditAttr} class="w-full h-auto rounded-xl shadow-sm border border-gray-100 object-cover" loading="lazy" />`;

    if (data.caption || data.credit) {
      imageHtml += `<figcaption class="text-xs text-gray-500 text-center mt-2 italic">${data.caption || ""}${
        data.credit ? ` (Photo: ${data.credit})` : ""
      }</figcaption>`;
    }

    imageHtml += `</figure><p><br></p>`;

    document.execCommand("insertHTML", false, imageHtml);
    handleEditorInput();
  }

  function openTableDialog() {
    saveSelection();
    setIsTableModalOpen(true);
  }

  function handleInsertTable(rows: number, cols: number, hasHeader: boolean) {
    restoreSelection();
    editorRef.current?.focus();

    let tableHtml = `<div class="overflow-x-auto my-6"><table class="w-full text-left border-collapse border border-gray-200 text-sm">`;
    if (hasHeader) {
      tableHtml += `<thead class="bg-gray-50"><tr>`;
      for (let c = 1; c <= cols; c++) {
        tableHtml += `<th class="border border-gray-200 px-4 py-2.5 font-semibold text-gray-900">Header ${c}</th>`;
      }
      tableHtml += `</tr></thead>`;
    }
    tableHtml += `<tbody>`;
    for (let r = 1; r <= rows; r++) {
      tableHtml += `<tr class="hover:bg-gray-50/50">`;
      for (let c = 1; c <= cols; c++) {
        tableHtml += `<td class="border border-gray-200 px-4 py-2 text-gray-700">Cell ${r}-${c}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table></div><p><br></p>`;

    document.execCommand("insertHTML", false, tableHtml);
    handleEditorInput();
  }

  function insertCodeBlock() {
    execCmd("insertHTML", `<pre class="bg-gray-900 text-gray-100 p-4 rounded-xl font-mono text-xs my-4 overflow-x-auto"><code>// Enter code or reference here...</code></pre><p><br></p>`);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col focus-within:ring-2 focus-within:ring-green-600/30 focus-within:border-green-600 transition-all">
      {/* Editor Toolbar */}
      <div className="border-b border-gray-100 bg-gray-50/80 p-2 flex flex-wrap items-center gap-1">
        {/* Undo / Redo */}
        <div className="flex items-center">
          <button
            type="button"
            title="Undo"
            onClick={() => execCmd("undo")}
            className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Redo"
            onClick={() => execCmd("redo")}
            className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        <div className="w-[1px] h-5 bg-gray-200 mx-1" />

        {/* Headings */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title="Paragraph Text"
            onClick={() => formatBlock("p")}
            className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Pilcrow className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Heading 2 (Main Section - Encouraged for SEO)"
            onClick={() => formatBlock("h2")}
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors flex items-center font-bold text-xs"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Heading 3 (Subsection)"
            onClick={() => formatBlock("h3")}
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors flex items-center font-bold text-xs"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Heading 4 (Minor section)"
            onClick={() => formatBlock("h4")}
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors flex items-center font-bold text-xs"
          >
            <Heading4 className="w-4 h-4" />
          </button>
        </div>

        <div className="w-[1px] h-5 bg-gray-200 mx-1" />

        {/* Inline formatting */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title="Bold (Ctrl+B)"
            onClick={() => execCmd("bold")}
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Italic (Ctrl+I)"
            onClick={() => execCmd("italic")}
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Underline (Ctrl+U)"
            onClick={() => execCmd("underline")}
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors underline"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Strikethrough"
            onClick={() => execCmd("strikeThrough")}
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        <div className="w-[1px] h-5 bg-gray-200 mx-1" />

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title="Bullet List"
            onClick={() => execCmd("insertUnorderedList")}
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Numbered List"
            onClick={() => execCmd("insertOrderedList")}
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Blockquote"
            onClick={() => formatBlock("blockquote")}
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        <div className="w-[1px] h-5 bg-gray-200 mx-1" />

        {/* Media & Structured Content */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title="Insert Link / Internal Search"
            onClick={openLinkDialog}
            className="p-1.5 text-green-700 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-1"
          >
            <Link2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Insert Image (with Alt Text & Dimensions)"
            onClick={openImageDialog}
            className="p-1.5 text-green-700 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-1"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Insert Table"
            onClick={openTableDialog}
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Table className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Horizontal Divider"
            onClick={() => execCmd("insertHorizontalRule")}
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Code Block"
            onClick={insertCodeBlock}
            className="p-1.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        <div className="w-[1px] h-5 bg-gray-200 mx-1" />

        {/* Clear & HTML Source Toggle */}
        <div className="flex items-center gap-0.5 ml-auto">
          <button
            type="button"
            title="Clear Formatting"
            onClick={() => execCmd("removeFormat")}
            className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
          <button
            type="button"
            title={sourceMode ? "Switch to Visual Editor" : "View HTML Source Code"}
            onClick={() => setSourceMode(!sourceMode)}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              sourceMode
                ? "bg-green-700 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span className="text-[11px]">{sourceMode ? "Visual" : "HTML"}</span>
          </button>
        </div>
      </div>

      {/* SEO Heading Guidance Tip */}
      <div className="px-4 py-1.5 bg-green-50/50 border-b border-gray-100 flex items-center justify-between text-[11px] text-green-900">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-green-700 flex-shrink-0" />
          <span>
            <strong>Heading Hierarchy:</strong> H1 is reserved for the article title. Use <strong>H2</strong> for main sections and <strong>H3</strong> for subsections.
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative min-h-[360px] p-6 flex-1">
        {sourceMode ? (
          <textarea
            value={htmlContent}
            onChange={handleSourceChange}
            placeholder="Edit raw HTML markup..."
            rows={16}
            className="w-full h-full min-h-[340px] font-mono text-xs text-gray-800 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            onBlur={handleEditorInput}
            data-placeholder={placeholder}
            className="prose prose-green max-w-none min-h-[340px] outline-none text-gray-800 leading-relaxed text-sm md:text-base before:empty:text-gray-300 before:empty:content-[attr(data-placeholder)]"
          />
        )}
      </div>

      {/* Link, Image, Table Modals */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onInsert={handleInsertLink}
      />
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsert={handleInsertImage}
      />
      <TableModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        onInsert={handleInsertTable}
      />
    </div>
  );
}
