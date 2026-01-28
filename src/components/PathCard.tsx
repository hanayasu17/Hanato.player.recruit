"use client";

interface PathCardProps {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  desc: string;
  points: string[];
}

export default function PathCard({
  icon,
  title,
  subtitle,
  color,
  desc,
  points,
}: PathCardProps) {
  return (
    <article className="bg-white p-10 relative overflow-hidden transition-all duration-400 border border-black/5 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group scroll-animate">
      <div
        className="absolute top-0 left-0 right-0 h-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400"
        style={{ background: color }}
      />
      <div className="text-4xl mb-6">{icon}</div>
      <h3
        className="font-serif text-2xl font-semibold mb-2"
        style={{ color }}
      >
        {title}
      </h3>
      <p className="text-sm text-warmgray mb-6 tracking-wide">{subtitle}</p>
      <p className="text-[0.9375rem] text-ink mb-8">{desc}</p>
      <ul className="list-none mb-8">
        {points.map((point) => (
          <li
            key={point}
            className="py-2 pl-6 relative text-sm text-warmgray"
          >
            <span style={{ color }} className="absolute left-0">
              ✓
            </span>
            <span className="ml-1">{point}</span>
          </li>
        ))}
      </ul>
      <a
        href="#contact"
        className="inline-block px-8 py-3 border text-[0.8125rem] tracking-[0.1em] no-underline transition-all duration-300"
        style={{
          borderColor: color,
          color: color,
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.background = color;
          (e.target as HTMLElement).style.color = "white";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.background = "transparent";
          (e.target as HTMLElement).style.color = color;
        }}
      >
        詳しく聞く
      </a>
    </article>
  );
}
