import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import SignupForm from "@/components/form/signup-form";
import { auth } from "@/auth";
import Link from "next/link";

const Page = async () => {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-sm mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>

        <SignupForm />
        <div className="text-center">

          <Button asChild variant="link">
            <Link href="/sign-in">Already have an account? Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
