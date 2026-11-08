import { LoginForm } from "@/components/admin/LoginForm";
import { adminConfigured } from "@/lib/admin-auth";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="mx-auto max-w-sm py-16">
      <p className="kicker mb-3">Espace réservé</p>
      <h1 className="font-serif text-4xl mb-6">Administration</h1>
      {!adminConfigured() && (
        <p className="mb-4 rounded-xl border border-red-400/40 bg-red-400/10 p-3 text-xs text-red-200">
          Variables ADMIN_PASSWORD (≥ 8 caractères) et ADMIN_SESSION_SECRET non définies : l'administration est désactivée.
        </p>
      )}
      <LoginForm next={next} />
    </div>
  );
}
