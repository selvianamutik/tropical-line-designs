import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";

function createPassThroughResponse(request: NextRequest) {
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

function copyAuthState(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });

  for (const [key, value] of from.headers.entries()) {
    if (key.toLowerCase() !== "set-cookie") {
      to.headers.set(key, value);
    }
  }

  return to;
}

function clearSupabaseAuthCookies(request: NextRequest, response: NextResponse) {
  request.cookies.getAll().forEach((cookie) => {
    if (cookie.name.startsWith("sb-")) {
      request.cookies.delete(cookie.name);
      response.cookies.delete(cookie.name);
    }
  });
}

function isInvalidRefreshTokenError(error: { code?: string; status?: number } | null) {
  return error?.status === 400
    && (error.code === "refresh_token_not_found" || error.code === "refresh_token_already_used");
}

export async function middleware(request: NextRequest) {
  let response = createPassThroughResponse(request);

  const supabase = createServerClient(
    env.supabaseUrl,
    env.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = createPassThroughResponse(request);
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    },
  );

  const { data, error } = await supabase.auth.getUser();
  const isAdmin = data.user?.app_metadata?.is_admin === true;
  const { pathname, search } = request.nextUrl;

  if (isInvalidRefreshTokenError(error)) {
    clearSupabaseAuthCookies(request, response);

    if (pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "Sesi login sudah kedaluwarsa. Silakan login ulang.");
      url.searchParams.set("next", `${pathname}${search}`);
      return copyAuthState(response, NextResponse.redirect(url));
    }

    return response;
  }

  if (pathname.startsWith("/admin") && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "Silakan login sebagai admin.");
    url.searchParams.set("next", `${pathname}${search}`);
    return copyAuthState(response, NextResponse.redirect(url));
  }

  if (pathname === "/login" && isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return copyAuthState(response, NextResponse.redirect(url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/auth/callback"],
};
