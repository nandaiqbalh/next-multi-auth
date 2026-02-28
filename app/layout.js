import "./globals.css";
import ConditionalHeader from "../components/common/header/ConditionalHeader";
import { bebasNeue, dmSans } from "../lib/fonts";
import ClientLayout from "../components/common/ClientLayout";

export const metadata = {
  title: "Troy Company",
  description: "High quality clothing for everyone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body className={`${bebasNeue.variable} ${dmSans.variable} antialiased`}>
        <ClientLayout>
          {/* Header navigation menu (hidden on admin pages) */}
          <ConditionalHeader>
            {children}
          </ConditionalHeader>
        </ClientLayout>
      </body>
    </html>
  );
}
