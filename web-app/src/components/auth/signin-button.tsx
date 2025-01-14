"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github } from "@/components/ui/github";

const GithubSignIn = () => {
  return (
    <Button
      onClick={() => signIn("github", { redirectTo: "/" })}
      className="w-full"
      variant="outline"
    >
      <Github />
      Continue with GitHub
    </Button>
  );
};

export { GithubSignIn };
