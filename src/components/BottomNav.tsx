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
    <nav className="absolute bottom-0 w-full z-50 px-6 py-4 glass rounded-t-3xl border-t border-white/5">
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
                      isActive ? "text-neon-teal drop-shadow-[0_0_8px_rgba(0,245,212,0.8)] scale-110" : "text-gray-500 scale-100"
                    }`}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -inset-3 bg-neon-teal/20 rounded-full blur-md -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
                <span
                  className={`text-xs font-medium transition-colors duration-300 mt-1 ${
                    isActive ? "text-white text-shadow-neon-blue" : "text-gray-500"
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
