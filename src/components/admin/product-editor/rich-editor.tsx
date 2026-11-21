"use client";

import RichEditor from "../shared/rich-editor";

/** Starter outline offered by the "Sections Outline" toolbar button. */
const PRODUCT_TEMPLATE = `
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

interface ProductRichEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

/** Product description editor: the shared rich editor plus a product template. */
export default function ProductRichEditor({
  value,
  onChange,
  placeholder = "Write detailed product information, botanical benefits, usage guidelines, and customer FAQs...",
}: ProductRichEditorProps) {
  return (
    <RichEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      templateHtml={PRODUCT_TEMPLATE}
      templateLabel="Sections Outline"
    />
  );
}
