import { AccountPage } from "@/components/account/account-page";
import { AuthPanel } from "@/components/account/auth-panel";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export const metadata = { title: "Tu perfil" };

export default async function Page({ searchParams }: { searchParams: Promise<{ auth?: string; mode?: string }> }) {
  const params = await searchParams;
  const authEnabled = Boolean(getSupabaseConfig());
  const supabase = authEnabled ? await createSupabaseServerClient() : null;
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user ? {
    name: typeof data.user.user_metadata.full_name === "string" ? data.user.user_metadata.full_name : "",
    email: data.user.email ?? "",
  } : null;

  const authMode = params.mode === "reset" ? "reset" : "auth";
  return <AccountPage authEnabled={authEnabled} user={user} authMode={authMode} authPanel={authEnabled ? <AuthPanel status={params.auth} mode={authMode} /> : null} />;
}
