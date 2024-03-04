import { getAuthSession } from "@/@server/config/next-auth";
import { redirect } from "next/navigation";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (session?.user) {
    return redirect("/");
  }
  return (
    <>{children}</>
  )
}
