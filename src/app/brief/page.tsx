import { redirect } from "next/navigation";

export default async function BriefPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const params = await searchParams;
  redirect(params.event ? `/?event=${params.event}` : "/");
}
