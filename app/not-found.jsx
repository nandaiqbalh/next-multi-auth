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
    <main className={`min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-6 text-center text-neutral-950 ${dmSans.className}`}>

      <p className="text-neutral-500 text-[11px] tracking-[0.3em] uppercase mb-4">
        404 — Page Not Found
      </p>

      <h1 className={`text-neutral-950 leading-none mb-6 ${bebasNeue.className}`} style={display404}>
        404
      </h1>

      <p className="text-neutral-600 font-light max-w-xs leading-relaxed mb-10" style={bodyText}>
        The page you're looking for was not found or is no longer available.
      </p>


      <div className="flex flex-col sm:flex-row gap-4">

        <BackButton />

        <Link
          href="/"
          className="inline-flex items-center justify-center h-10 gap-2.5 bg-neutral-950 text-white px-6 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-neutral-800 transition-colors duration-150"
        >
          Back to Home
        </Link>
      </div>

    </main>
  );
}