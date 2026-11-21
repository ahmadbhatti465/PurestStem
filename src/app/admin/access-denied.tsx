import Link from "next/link";
import { ShieldOff } from "lucide-react";

/** Shown when a signed-in staff member opens a section their role can't use. */
export default function AccessDenied() {
  return (
    <div className="max-w-lg mx-auto mt-16 bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShieldOff className="w-7 h-7 text-red-500" />
      </div>
      <h1 className="text-xl font-bold text-gray-900">You don&apos;t have access to this section</h1>
      <p className="text-sm text-gray-500 mt-2">
        Your role doesn&apos;t include this part of the admin panel. Ask an Admin if you need access.
      </p>
      <Link
        href="/admin"
        className="inline-flex mt-6 px-5 py-2.5 rounded-xl bg-green-700 text-white text-sm font-medium hover:bg-green-800"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
