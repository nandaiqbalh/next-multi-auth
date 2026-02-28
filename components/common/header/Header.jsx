"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Header({ className = "" }) {
  const { data: session } = useSession();
  const accountHref = session ? "/account" : "/login";

  return (
    <header className={`fixed top-0 inset-x-0 z-50 bg-white shadow ${className}`}>
      <div className="max-w-screen-xl mx-auto flex items-center h-14 px-4">
        <Link href="/" className="text-lg font-bold">
          MultiAuth
        </Link>
        <div className="ml-auto">
          <Link href={accountHref} className="text-sm text-neutral-700 hover:text-neutral-900">
            {session ? "Account" : "Login"}
          </Link>
        </div>
      </div>
    </header>
  );
}

