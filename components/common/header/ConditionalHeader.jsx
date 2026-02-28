// components/common/header/ConditionalHeader.jsx
"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader({ children }) {
  const pathname = usePathname();
  const hide = pathname && pathname.startsWith("/admin");
  if (hide) {
    return <>{children}</>;
  }
  return (
    <>
      <Header />
      {/* spacer matching header height */}
      <div className="pt-14">{children}</div>
    </>
  );
}
