"use client";
import { RedirectToSignIn, SignedOut } from "@clerk/clerk-react";
import { SignedIn } from "@clerk/nextjs";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SignedIn> {children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
