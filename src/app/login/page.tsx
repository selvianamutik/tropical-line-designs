import Link from "next/link";
import { redirect } from "next/navigation";
import { loginWithPassword, sendMagicLink } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createClient();
  const [{ data }, params] = await Promise.all([
    supabase.auth.getUser(),
    (searchParams ?? Promise.resolve({})) as Promise<Record<string, string | string[] | undefined>>,
  ]);
  const error = typeof params.error === "string" ? params.error : undefined;
  const message = typeof params.message === "string" ? params.message : undefined;
  const next = typeof params.next === "string" && params.next.startsWith("/") ? params.next : "/admin";

  if (data.user?.app_metadata?.is_admin) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[#f6f0e6] text-[#383532]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10 md:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col justify-between rounded-sm border border-[#e1d8cb] bg-[linear-gradient(135deg,#efe5d5_0%,#faf5eb_55%,#e8ddca_100%)] p-8 shadow-sm md:p-12">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8a867f]">
                Tropical Line Design
              </p>
              <h1 className="mt-6 max-w-[10ch] font-display text-[44px] font-bold leading-[0.92] tracking-[-0.05em] md:text-[64px]">
                Admin Access
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-[#6b6762]">
                Masuk ke dashboard untuk mengelola portfolio, team, collaborators, awards, dan pengaturan situs
                dengan sesi admin yang tervalidasi.
              </p>
            </div>
            <div className="grid gap-4 border-t border-[#d8cfbf] pt-8 text-[11px] uppercase tracking-[0.18em] text-[#8a867f] md:grid-cols-3">
              <span>Password Login</span>
              <span>Magic Link</span>
              <span>Protected Routes</span>
            </div>
          </section>

          <section className="rounded-sm border border-[#e9e6df] bg-white p-8 shadow-sm md:p-10">
            <div>
              <h2 className="text-xl font-bold">Login Admin</h2>
              <p className="mt-2 text-sm text-[#8a867f]">
                Gunakan email admin yang sudah diotorisasi. Magic link hanya bekerja untuk akun yang sudah ada.
              </p>
            </div>

            {error ? (
              <div className="mt-6 rounded-sm border border-[#e7b4ad] bg-[#fff0ee] px-4 py-3 text-sm text-[#9a3c2f]">
                {error}
              </div>
            ) : null}

            {message ? (
              <div className="mt-6 rounded-sm border border-[#cdd9c8] bg-[#f4faf2] px-4 py-3 text-sm text-[#416038]">
                {message}
              </div>
            ) : null}

            <form className="mt-8 space-y-6">
              <input type="hidden" name="next" value={next} />
              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a867f]">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="h-11 w-full rounded-sm border border-[#d9d4ca] px-3 text-sm outline-none transition-colors focus:border-[#d97706]"
                  placeholder="admin@company.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a867f]">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="h-11 w-full rounded-sm border border-[#d9d4ca] px-3 text-sm outline-none transition-colors focus:border-[#d97706]"
                  placeholder="Password admin"
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  formAction={loginWithPassword}
                  className="inline-flex h-11 items-center justify-center rounded-sm bg-[#383532] px-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#fdfbf7] transition-colors hover:bg-[#4a4642]"
                >
                  Login dengan Password
                </button>
                <button
                  formAction={sendMagicLink}
                  className="inline-flex h-11 items-center justify-center rounded-sm border border-[#d9d4ca] bg-transparent px-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#383532] transition-colors hover:bg-[#f4efe6]"
                >
                  Kirim Magic Link
                </button>
              </div>
            </form>

            <div className="mt-8 border-t border-[#ece6db] pt-6 text-xs text-[#8a867f]">
              <p>Hanya akun dengan flag admin yang dapat mengakses dashboard.</p>
              <Link href="/" className="mt-3 inline-block text-[#383532] underline underline-offset-4">
                Kembali ke situs
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
