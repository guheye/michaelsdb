"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onConfirm: (password: string) => void;
  onCancel: () => void;
}

export function AggregatePasswordModal({ onConfirm, onCancel }: Props) {
  const [password, setPassword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative bg-white p-6 w-[320px] shadow-2xl">
        <h2 className="font-sans text-xs font-bold uppercase tracking-widest text-gray-800 mb-1">
          Aggregate Access
        </h2>
        <p className="font-sans text-xs text-gray-500 mb-4">
          Enter the password to run feed aggregation.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (password) onConfirm(password);
          }}
        >
          {/* Hidden username so iOS/macOS recognises this as a sign-in form and offers saved passwords / FaceID */}
          <input
            type="text"
            autoComplete="username"
            name="username"
            value="aggregate"
            readOnly
            aria-hidden="true"
            tabIndex={-1}
            className="absolute w-0 h-0 overflow-hidden opacity-0"
          />
          <input
            ref={inputRef}
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full border border-gray-300 px-3 py-2 text-sm font-sans mb-4 outline-none focus:border-gray-800 transition-colors"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!password}
              className="btn-subscribe flex-1 disabled:opacity-40"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-gray-300 px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
