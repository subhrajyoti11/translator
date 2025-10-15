"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked } from "lucide-react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Translate" },
    { href: "/retrain", label: "Retrain Model" },
  ];

  return (
    <header className="border-b-2 border-border/50 glass-effect-light dark:glass-effect-dark-enhanced sticky top-0 z-50">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <BookMarked className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-headline text-xl font-bold text-gradient-light dark:text-gradient-dark">
            LexiFlow AI
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-8 text-base md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-medium text-muted-foreground transition-all duration-300 hover:text-primary relative px-3 py-2 rounded-lg hover:bg-primary/5",
                  pathname === item.href && "text-primary bg-primary/10"
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
