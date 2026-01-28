import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] text-paper">
      <div className="max-w-[1200px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 md:gap-16">
        {/* Brand */}
        <div>
          <Link href="/" className="no-underline inline-block mb-4">
            <div className="font-serif text-2xl font-semibold tracking-wider text-paper">
              花人
              <span className="block text-xs text-warmgray tracking-[0.2em] font-sans font-normal">
                HANATO
              </span>
            </div>
          </Link>
          <p className="text-sm text-warmgray mb-6">教えるを仕事にする</p>
          <address className="text-[0.8125rem] text-warmgray leading-8 not-italic">
            〒166-0015
            <br />
            東京都杉並区成田東1丁目40-12
            <br />
            代表：永田安孝
          </address>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-xs tracking-[0.2em] text-sakura mb-6">
            NAVIGATION
          </h4>
          <ul className="list-none space-y-3">
            {[
              { href: "/", label: "ホーム" },
              { href: "/blog", label: "ブログ" },
              { href: "/#profile", label: "プロフィール" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-warmgray no-underline text-sm hover:text-paper transition-colors duration-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & SNS */}
        <div>
          <h4 className="text-xs tracking-[0.2em] text-sakura mb-6">
            CONNECT
          </h4>
          <ul className="list-none space-y-3">
            <li>
              <Link
                href="/#contact"
                className="text-warmgray no-underline text-sm hover:text-paper transition-colors duration-300"
              >
                お問い合わせ
              </Link>
            </li>
            <li>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-warmgray no-underline text-sm hover:text-paper transition-colors duration-300"
              >
                Twitter / X
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-warmgray no-underline text-sm hover:text-paper transition-colors duration-300"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-warmgray no-underline text-sm hover:text-paper transition-colors duration-300"
              >
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-[1200px] mx-auto px-6 py-8 border-t border-white/10 text-center text-xs text-warmgray">
        &copy; {new Date().getFullYear()} 花人-Hanato-. All rights reserved.
      </div>
    </footer>
  );
}
