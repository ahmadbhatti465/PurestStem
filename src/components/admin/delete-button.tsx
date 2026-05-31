"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  apiUrl: string;
  redirectPath: string;
}

export default function DeleteButton({ apiUrl, redirectPath }: DeleteButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this?")) return;
    setDeleting(true);
    try {
      const res = await fetch(apiUrl, { method: "DELETE" });
      if (res.ok) {
        router.push(redirectPath);
        router.refresh();
      } else {
        const body = await res.json().catch(() => ({}));
        alert(body.error || "Failed to delete.");
      }
    } catch {
      alert("An error occurred while deleting.");
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
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
