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

  async function handleDelete(force = false) {
    if (!force && !confirm("Are you sure you want to delete this?")) return;
    setDeleting(true);
    try {
      const headers: Record<string, string> = {};
      if (force) headers["x-confirm-cascade"] = "true";

      const res = await fetch(apiUrl, { method: "DELETE", headers });
      if (res.ok) {
        router.push(redirectPath);
        router.refresh();
      } else {
        const body = await res.json().catch(() => ({}));
        if (body.requiresConfirmation && body.productCount > 0) {
          const confirmed = window.confirm(
            body.error ||
              `This item has ${body.productCount} linked product(s). Delete it anyway?`
          );
          if (confirmed) {
            await handleDelete(true);
            return;
          }
        } else {
          alert(body.error || "Failed to delete.");
        }
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
