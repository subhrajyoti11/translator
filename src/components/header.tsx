"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked } from "lucide-react";

import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Translate" },
    { href: "/retrain", label: "Retrain Model" },
  ];

  return (
    <header className="border-b bg-card/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="bg-primary p-2 rounded-lg">
            <BookMarked className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-headline text-xl font-bold">
            Bhashaantar AI
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-base md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-medium text-muted-foreground transition-colors hover:text-primary relative",
                pathname === item.href && "text-primary"
              )}
            >
              {item.label}
              {pathname === item.href && (
                 <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
