import RegisterForm from "./RegisterForm";
import { safeNextPath } from "@/lib/auth";

export default async function Register({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(params.next) || "/signup";
  return <RegisterForm next={next} />;
}
