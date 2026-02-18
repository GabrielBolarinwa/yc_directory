"use client";

import { signIn } from "next-auth/react";

export default function LoginForm() {
  const handleLogin = async () => {
    await signIn("google");
  };

  return (
    <form action={handleLogin}>
      <button type="submit">Login</button>
    </form>
  );
}
