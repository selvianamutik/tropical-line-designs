import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f3ea] px-6 text-[#383532] sm:px-10">
      <div className="max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8a867f]">404</p>
        <h1 className="mt-4 text-4xl font-bold uppercase tracking-[-0.04em] text-black md:text-6xl">
          Page not found
        </h1>
        <p className="mt-6 text-sm leading-7 text-[#6f6b65] md:text-base">
          The page you requested does not exist or may have been moved. Return to the main
          navigation to continue browsing the site.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="rounded-sm bg-[#383532] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-85"
          >
            Back to home
          </Link>
          <Link
            href="/projects"
            className="rounded-sm border border-[#383532]/20 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#383532] transition-colors hover:border-[#383532] hover:text-black"
          >
            View projects
          </Link>
        </div>
      </div>
    </main>
  );
}
