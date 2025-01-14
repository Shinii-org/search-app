import KeywordsWrapper from "@/components/keywords/keywords-wrapper";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (!session || !session.user) redirect("/sign-in");

  return <KeywordsWrapper session={session} />;
}
