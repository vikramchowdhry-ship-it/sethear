import ResetForm from "./ResetForm";
import Link from "next/link";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Missing reset link</h1>
        <p className="mt-3 text-slate-600">
          This page needs a reset token from your email link.
        </p>
        <Link href="/forgot-password" className="mt-6 inline-block text-amber-700 underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return <ResetForm token={token} />;
}
