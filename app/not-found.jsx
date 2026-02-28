import Link from "next/link";
import BackButton from "@/components/ui/BackButton";
import { bebasNeue, dmSans } from "@/lib/fonts";
import { display404, bodyText } from "@/lib/styles";

export const metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for was not found or is no longer available.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">

      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">Page not found</p>
      <p className="text-sm text-gray-500 mb-8 max-w-xs">
        The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go to Homepage
        </Link>
        <BackButton />
      </div>

    </main>
  );
}