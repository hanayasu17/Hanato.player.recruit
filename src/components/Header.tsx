"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 flex justify-between items-center transition-all duration-300 ${
        isScrolled
          ? "py-3 shadow-[0_2px_20px_rgba(0,0,0,0.05)]"
          : "py-4"
      }`}
      style={{ background: "rgba(250, 249, 247, 0.95)", backdropFilter: "blur(10px)" }}
    >
      <Link href="/" className="no-underline">
        <div className="font-serif text-2xl font-semibold tracking-wider text-ink">
          花人
          <span className="block text-xs text-warmgray tracking-[0.2em] font-sans font-normal">
            HANATO
          </span>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex gap-8 list-none">
        {[
          { href: "/", label: "ホーム" },
          { href: "/blog", label: "ブログ" },
          { href: "/#profile", label: "プロフィール" },
          { href: "/#contact", label: "お問い合わせ" },
        ].map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-ink no-underline text-sm tracking-wide relative pb-1 group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-sakura-deep transition-all duration-300 group-hover:w-full" />
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="メニューを開く"
      >
        <span
          className={`block w-6 h-0.5 bg-ink transition-all duration-300 ${
            isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-ink transition-all duration-300 ${
            isMobileMenuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-ink transition-all duration-300 ${
            isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-paper shadow-lg md:hidden">
          <ul className="list-none py-4">
            {[
              { href: "/", label: "ホーム" },
              { href: "/blog", label: "ブログ" },
              { href: "/#profile", label: "プロフィール" },
              { href: "/#contact", label: "お問い合わせ" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-6 py-3 text-ink no-underline text-sm tracking-wide hover:bg-sakura/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
