"use client";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      bgClass: "bg-[#1DA1F2] hover:bg-[#1a8cd8]",
      label: "X",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bgClass: "bg-[#1877F2] hover:bg-[#166bda]",
      label: "FB",
    },
    {
      name: "はてなブックマーク",
      href: `https://b.hatena.ne.jp/entry/${url}`,
      bgClass: "bg-[#00A4DE] hover:bg-[#0093c7]",
      label: "B!",
    },
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-warmgray">シェア:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center w-10 h-10 text-white text-xs font-bold no-underline transition-all duration-300 ${link.bgClass}`}
          aria-label={`${link.name}でシェア`}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
