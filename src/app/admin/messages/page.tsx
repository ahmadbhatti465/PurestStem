"use client";

import { useEffect, useState } from "react";
import { Mail, Check, Trash2, MailOpen, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  async function fetchMessages() {
    const res = await fetch("/api/admin/messages");
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    const t = setTimeout(() => fetchMessages(), 0);
    return () => clearTimeout(t);
  }, []);

  async function markRead(id: string, read: boolean) {
    const res = await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read }),
    });
    if (res.ok) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read } : m))
      );
      if (selected?.id === id) {
        setSelected((prev) => (prev ? { ...prev, read } : prev));
      }
    }
  }

  async function deleteMsg(id: string) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    const res = await fetch(`/api/admin/messages?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-500 mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`
              : "No unread messages"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white p-16 rounded-2xl border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500">No messages yet.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1 space-y-3 max-h-[75vh] overflow-y-auto pr-1">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => {
                  setSelected(msg);
                  if (!msg.read) markRead(msg.id, true);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selected?.id === msg.id
                    ? "bg-green-50 border-green-200 shadow-sm"
                    : "bg-white border-gray-100 hover:border-green-200 hover:shadow-sm"
                } ${!msg.read ? "ring-1 ring-green-100" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      msg.read
                        ? "bg-gray-100 text-gray-400"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {msg.read ? (
                      <MailOpen className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900 truncate">
                        {msg.name}
                      </span>
                      {!msg.read && (
                        <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {msg.subject || "No subject"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(msg.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-100">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {selected.subject || "No subject"}
                      </h2>
                      <p className="text-sm text-gray-500">
                        From: {selected.name} &lt;{selected.email}&gt;
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(selected.createdAt).toLocaleString("en-PK", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => markRead(selected.id, !selected.read)}
                        className="p-2.5 text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors"
                        title={selected.read ? "Mark unread" : "Mark read"}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMsg(selected.id)}
                        className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white p-16 rounded-2xl border border-gray-100 text-center h-full flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Mail className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400">Select a message to read</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
