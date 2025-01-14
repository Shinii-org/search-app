import { GithubSignIn } from "@/components/auth/signin-button";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import SigninForm from "@/components/form/signin-form";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import Link from "next/link";

const Page = async () => {
  await cookies();
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-sm mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

        <GithubSignIn />
        {/* Email/Password Sign In */}
        <SigninForm />
        <div className="text-center">
          <Button  asChild variant="link">
            <Link href="/sign-up">Don&apos;t have an account? Sign up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
