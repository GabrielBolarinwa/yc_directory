"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutForm() {
  const handleLogOut = async () => {
    await signOut({
      redirectTo: "/",
    });
  };

  return (
    <form action={handleLogOut}>
      <button type="submit">
        <span className="max-sm:hidden">Sign Out</span>
        <LogOut size={24} className="sm:hidden text-red-500" />
      </button>
    </form>
  );
}
