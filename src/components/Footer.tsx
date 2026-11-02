import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="shell label-mono flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-[22px] text-muted">
        <span>{site.footer.line}</span>
        <a href="#top" className="inline-flex min-h-11 items-center text-ink transition-colors duration-200 hover:text-accent">
          {site.footer.backToTop}
        </a>
      </div>
    </footer>
  );
}
