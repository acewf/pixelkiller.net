import { site } from "@/content/site";
import { Plus, VoxelMark } from "./icons";
import { NavDisclosure } from "./NavDisclosure";

const LINK = "inline-flex min-h-11 items-center text-ink transition-colors duration-200 hover:text-accent";

/** Skip link plus the site header. Rendered by every page, so links point at "/#section". */
export function Nav() {
  const { nav } = site;
  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-[2px] bg-accent font-semibold text-on-accent focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-20 focus:px-4 focus:py-3"
      >
        {site.skipLink}
      </a>
      <header className="absolute inset-x-0 top-0 z-10">
        <div className="shell flex items-center justify-between gap-x-6 py-[18px]">
          <a href={nav.homeHref} aria-label={nav.homeLabel} className="inline-flex min-h-11 items-center gap-3 text-ink">
            <VoxelMark className="block h-[30px] w-[26px] flex-none" />
            <span className="text-[15px] font-extrabold tracking-[0.06em] uppercase [font-stretch:125%]">{site.name}</span>
          </a>
          <nav aria-label={nav.label}>
            <ul className="label-mono flex flex-wrap items-center gap-x-[26px] max-[720px]:hidden">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={LINK}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            {/* Narrow screens: every link stays reachable behind a disclosure. */}
            <NavDisclosure className="group min-[720px]:hidden">
              <summary aria-label={nav.menuLabel} className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                {/* Older WebKit ignores display:flex on <summary>, so the row lives on a span. */}
                <span className={`${LINK} label-mono gap-2.5`}>
                  {nav.menu}
                  <Plus className="block size-3.5 transition-transform duration-200 group-open:rotate-45" />
                </span>
              </summary>
              <ul className="label-mono shell absolute inset-x-0 top-full flex flex-col border-y border-hairline bg-ground py-2">
                {nav.links.map((link) => (
                  <li key={link.href} className="border-b border-hairline last:border-b-0">
                    <a href={link.href} className={`${LINK} w-full`}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </NavDisclosure>
          </nav>
        </div>
      </header>
    </>
  );
}
