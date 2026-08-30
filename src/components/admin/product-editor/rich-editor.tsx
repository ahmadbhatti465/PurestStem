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
  Sparkles,
} from "lucide-react";
import LinkModal, { LinkData } from "../blog-editor/link-modal";
import ImageModal, { ImageData } from "../blog-editor/image-modal";
import TableModal from "../blog-editor/table-modal";
import { sanitizeHtml } from "@/lib/html-sanitizer";

interface ProductRichEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function ProductRichEditor({
  value,
  onChange,
  placeholder = "Write detailed product information, botanical benefits, usage guidelines, and customer FAQs...",
}: ProductRichEditorProps) {
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

  function insertProductTemplate() {
    if (sourceMode) return;
    const templateHtml = `
      <h2>Product Overview</h2>
      <p>Discover the pure botanical formulation designed to nourish, protect, and revitalize naturally.</p>
      
      <h2>Key Benefits</h2>
      <ul>
        <li>Deeply cleanses and conditions without stripping natural moisture</li>
        <li>Infused with genuine traditional herbal extracts</li>
        <li>Suitable for regular daily care routines</li>
      </ul>

      <h2>How It Works</h2>
      <p>Active botanicals work synergistically to restore balance and strengthen vitality from roots to ends.</p>

      <h2>Who It Is For</h2>
      <p>Ideal for anyone seeking a gentle, chemical-free herbal formula suitable for all hair and skin types in Pakistan.</p>
    `;
    if (editorRef.current) {
      editorRef.current.innerHTML = (editorRef.current.innerHTML || "") + templateHtml;
      handleEditorInput();
    }
  }

  function handleInsertLink(linkData: LinkData) {
    restoreSelection();
    editorRef.current?.focus();

    const targetAttr = linkData.targetBlank ? ' target="_blank" rel="noopener noreferrer"' : "";
    const relAttr = linkData.rel ? ` rel="${linkData.rel}"` : "";
    const linkHtml = `<a href="${linkData.url}" class="text-green-700 underline font-medium"${targetAttr}${relAttr}>${linkData.text || linkData.url}</a>`;

    document.execCommand("insertHTML", false, linkHtml);
    handleEditorInput();
    setIsLinkModalOpen(false);
  }

  function handleInsertImage(imgData: ImageData) {
    restoreSelection();
    editorRef.current?.focus();

    const figureHtml = `
      <figure class="my-6">
        <img src="${imgData.url}" alt="${imgData.alt || ""}" class="rounded-2xl max-w-full h-auto mx-auto shadow-sm" loading="lazy" />
        ${imgData.caption ? `<figcaption class="text-center text-xs text-gray-500 mt-2">${imgData.caption}</figcaption>` : ""}
      </figure>
    `;

    document.execCommand("insertHTML", false, figureHtml);
    handleEditorInput();
    setIsImageModalOpen(false);
  }

  function handleInsertTable(rows: number, cols: number, hasHeader: boolean) {
    restoreSelection();
    editorRef.current?.focus();

    let tableHtml = `<div class="overflow-x-auto my-6"><table class="w-full text-left border-collapse border border-gray-200 text-xs">`;
    if (hasHeader) {
      tableHtml += `<thead class="bg-gray-50"><tr>`;
      for (let c = 1; c <= cols; c++) {
        tableHtml += `<th class="border border-gray-200 px-3 py-2 font-semibold text-gray-900">Header ${c}</th>`;
      }
      tableHtml += `</tr></thead>`;
    }
    tableHtml += `<tbody>`;
    for (let r = 1; r <= rows; r++) {
      tableHtml += `<tr class="hover:bg-gray-50/50">`;
      for (let c = 1; c <= cols; c++) {
        tableHtml += `<td class="border border-gray-200 px-3 py-1.5 text-gray-700">Data ${r}-${c}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table></div><p><br></p>`;

    document.execCommand("insertHTML", false, tableHtml);
    handleEditorInput();
    setIsTableModalOpen(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="p-2 bg-gray-50/80 border-b border-gray-200 flex flex-wrap items-center gap-1">
        {/* Headings */}
        <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1.5 mr-1">
          <button
            type="button"
            onClick={() => formatBlock("p")}
            className="p-1.5 text-gray-600 hover:text-green-800 hover:bg-white rounded-lg transition-colors"
            title="Paragraph"
          >
            <Pilcrow className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatBlock("h2")}
            className="p-1.5 text-gray-600 hover:text-green-800 hover:bg-white rounded-lg transition-colors font-bold text-xs"
            title="Heading 2 (Main Section)"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatBlock("h3")}
            className="p-1.5 text-gray-600 hover:text-green-800 hover:bg-white rounded-lg transition-colors font-bold text-xs"
            title="Heading 3 (Subsection)"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatBlock("h4")}
            className="p-1.5 text-gray-600 hover:text-green-800 hover:bg-white rounded-lg transition-colors font-bold text-xs"
            title="Heading 4"
          >
            <Heading4 className="w-4 h-4" />
          </button>
        </div>

        {/* Inline Formatting */}
        <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1.5 mr-1">
          <button
            type="button"
            onClick={() => execCmd("bold")}
            className="p-1.5 text-gray-600 hover:text-green-800 hover:bg-white rounded-lg transition-colors"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("italic")}
            className="p-1.5 text-gray-600 hover:text-green-800 hover:bg-white rounded-lg transition-colors"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("underline")}
            className="p-1.5 text-gray-600 hover:text-green-800 hover:bg-white rounded-lg transition-colors"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("strikeThrough")}
            className="p-1.5 text-gray-600 hover:text-green-800 hover:bg-white rounded-lg transition-colors"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1.5 mr-1">
          <button
            type="button"
            onClick={() => execCmd("insertUnorderedList")}
            className="p-1.5 text-gray-600 hover:text-green-800 hover:bg-white rounded-lg transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("insertOrderedList")}
            className="p-1.5 text-gray-600 hover:text-green-800 hover:bg-white rounded-lg transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatBlock("blockquote")}
            className="p-1.5 text-gray-600 hover:text-green-800 hover:bg-white rounded-lg transition-colors"
            title="Quote Block"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("insertHorizontalRule")}
            className="p-1.5 text-gray-600 hover:text-green-800 hover:bg-white rounded-lg transition-colors"
            title="Horizontal Divider"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Media & Links */}
        <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1.5 mr-1">
          <button
            type="button"
            onClick={() => {
              saveSelection();
              setIsLinkModalOpen(true);
            }}
            className="p-1.5 text-gray-600 hover:text-green-800 hover:bg-white rounded-lg transition-colors"
            title="Insert Internal or External Link"
          >
            <Link2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              saveSelection();
              setIsImageModalOpen(true);
            }}
            className="p-1.5 text-gray-600 hover:text-green-800 hover:bg-white rounded-lg transition-colors"
            title="Insert Inline Image with Alt Text"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              saveSelection();
              setIsTableModalOpen(true);
            }}
            className="p-1.5 text-gray-600 hover:text-green-800 hover:bg-white rounded-lg transition-colors"
            title="Insert Structured Table"
          >
            <Table className="w-4 h-4" />
          </button>
        </div>

        {/* Templates & Tools */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            type="button"
            onClick={insertProductTemplate}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-lg text-xs font-semibold transition-colors"
            title="Insert Structured eCommerce Sections (Overview, Benefits, Usage, FAQ)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sections Outline</span>
          </button>

          <button
            type="button"
            onClick={() => execCmd("removeFormat")}
            className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg"
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("undo")}
            className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("redo")}
            className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setSourceMode(!sourceMode)}
            className={`p-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
              sourceMode
                ? "bg-gray-800 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-white"
            }`}
            title="Toggle HTML Source Mode"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="p-4 min-h-[300px]">
        {sourceMode ? (
          <textarea
            value={htmlContent}
            onChange={handleSourceChange}
            rows={14}
            className="w-full h-full font-mono text-xs p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-900 text-green-400"
            placeholder="Edit raw HTML..."
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            onBlur={handleEditorInput}
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            data-placeholder={placeholder}
            className="prose prose-sm sm:prose max-w-none focus:outline-none min-h-[260px] text-gray-800"
            style={{
              outline: "none",
            }}
          />
        )}
      </div>

      {/* Modals */}
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
