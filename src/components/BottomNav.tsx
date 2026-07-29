"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Stethoscope, User } from "lucide-react";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Diagnostika", href: "/diagnostika", icon: Stethoscope },
  { name: "Profile", href: "/profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show bottom nav on login page
  if (pathname === "/login") return null;

  return (
    <nav className="absolute bottom-0 w-full z-50 px-6 py-4 glass-soft rounded-t-3xl border-t border-white/40">
      <ul className="flex justify-between items-center relative">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <li key={item.name} className="relative z-10 flex-1 flex justify-center">
              <Link
                href={item.href}
                className="flex flex-col items-center gap-1 p-2 w-full"
              >
                <div className="relative">
                  <Icon
                    className={`w-6 h-6 transition-all duration-300 ${
                      isActive ? "text-[#ff756b] scale-110 drop-shadow-sm" : "text-[#8a7b78] scale-100"
                    }`}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -inset-3 bg-white/50 rounded-full blur-md -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
                <span
                  className={`text-xs font-bold transition-colors duration-300 mt-1 ${
                    isActive ? "text-[#2d2d2d]" : "text-[#8a7b78]"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
