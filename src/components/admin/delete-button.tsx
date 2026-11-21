"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  apiUrl: string;
  redirectPath: string;
  /** Shown in the confirmation prompt, e.g. the item's name. */
  label?: string;
}

export default function DeleteButton({ apiUrl, redirectPath, label }: DeleteButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const what = label ? `"${label}"` : "this item";
    if (!confirm(`Delete ${what}? This can't be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(apiUrl, { method: "DELETE" });
      if (res.ok) {
        router.push(redirectPath);
        router.refresh();
        return;
      }
      // The server explains why (e.g. a category that still has products).
      const body = await res.json().catch(() => ({}));
      alert(body.error || `Failed to delete (error ${res.status}).`);
    } catch {
      alert("An error occurred while deleting. Check your connection and try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      disabled={deleting}
      onClick={handleDelete}
      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
      title="Delete"
      aria-label={label ? `Delete ${label}` : "Delete"}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
