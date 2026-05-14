import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables for middleware client.");
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Update the request cookies
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        // Re-create the response to include the updated request headers
        supabaseResponse = NextResponse.next({
          request,
        });

        // Set the cookies on the response
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // Calling getUser() will safely refresh the auth token if it is expired,
  // triggering the setAll callback above to persist the new token.
  await supabase.auth.getUser();

  return supabaseResponse;
}