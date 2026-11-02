import { site } from "@/content/site";
import { VoxelMark } from "./icons";

export function Nav() {
  const { nav } = site;
  return (
    <header className="absolute inset-x-0 top-0 z-10">
      <div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-[18px]">
        <a href="#top" aria-label={nav.homeLabel} className="inline-flex min-h-11 items-center gap-3 text-ink">
          <VoxelMark className="block h-[30px] w-[26px] flex-none" />
          <span className="text-[15px] font-extrabold tracking-[0.06em] uppercase [font-stretch:125%]">{site.name}</span>
        </a>
        <nav aria-label={nav.label}>
          <ul className="label-mono flex flex-wrap items-center gap-x-[26px]">
            {nav.links.map((link) => (
              <li key={link.href} className={link.compact ? undefined : "max-[720px]:hidden"}>
                <a
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-ink transition-colors duration-200 hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
