import { auth } from "@/auth";
import { BadgePlus, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";
import LogoutForm from "./LogoutForm";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Suspense } from "react";

export default function Navbar() {
  return (
    <Suspense>
      <NavbarContent />
    </Suspense>
  );
}

async function NavbarContent() {
  const session = await auth();
  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href={"/"}>
          <Image
            src="/logo.png"
            alt="YC Directory Logo"
            width={144}
            height={30}
          />
        </Link>
        <div className="flex items-center gap-5 text-black">
          {session && session?.user ? (
            <>
              <Link href={"/startup/create"}>
                <span className="max-sm:sr-only">Create</span>
                <BadgePlus size={24} className="sm:hidden" />
              </Link>
              <LogoutForm />
              <Link href={`/user/${session?.user?.id}`}>
                <Avatar className="size-10">
                  {session.user.image && (
                    <AvatarImage
                      src={session.user.image}
                      alt={session?.user?.name || ""}
                    />
                  )}
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <LoginForm />
          )}
        </div>
      </nav>
    </header>
  );
}
