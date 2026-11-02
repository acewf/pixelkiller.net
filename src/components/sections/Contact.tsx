import { site } from "@/content/site";
import { ArrowUpRight } from "../icons";
import { SectionLabel } from "../SectionLabel";

export function Contact() {
  const { contact } = site;
  return (
    <section id={contact.id} aria-labelledby="contact-title" className="border-t border-hairline">
      <div className="shell pt-[clamp(96px,12vw,184px)] pb-[clamp(80px,9vw,128px)]">
        <SectionLabel meta={contact} />
        <p className="mb-[18px] text-[clamp(20px,2vw,28px)] leading-[1.3] text-ink-quiet [font-stretch:104%]">
          {contact.prompt}
        </p>
        <h2 id="contact-title" className="font-display text-closing font-extrabold text-balance [font-stretch:120%]">
          {contact.title}
        </h2>
        <a
          href={contact.email.href}
          className="link-underline mt-[clamp(40px,5vw,72px)] inline-block font-display text-email font-semibold wrap-anywhere text-ink [font-stretch:106%]"
        >
          {contact.email.label}
        </a>
        <ul
          aria-label={contact.linksLabel}
          className="mt-[clamp(32px,4vw,48px)] flex flex-wrap gap-x-8 gap-y-1 font-mono text-[13px] tracking-[0.08em] uppercase"
        >
          {contact.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-ink transition-colors duration-200 hover:text-accent"
              >
                {link.label}
                <span className="sr-only"> {site.newTab}</span>
                <ArrowUpRight className="block size-3.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
