import LoginForm from "./LoginForm";
import { safeNextPath } from "@/lib/auth";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(params.next) || "/dashboard";
  return <LoginForm next={next} />;
}
