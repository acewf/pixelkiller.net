import type { Metadata } from "next";
import { Roboto } from 'next/font/google'
import Image from "next/image";
import "./globals.css";
import { Email, Git, Linkedin } from "@/components/Icons";

import logo from "./pixelkiller-logo-simpler.jpg"


export const metadata: Metadata = {
  title: "Web Developer Portfolio",
  description: "Web Developer Portfolio",
};

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
})

const navItems = [
  { name: "Skills", href: "#skills" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
  { name: "Works", href: "/works" },
]

const socialItems = [
  { name: "Email", href: "mailto:contact@pixelkiller.net", icon: Email },
  { name: "Linkedin", href: "https://pt.linkedin.com/pub/pedro-martins/18/762/302", icon: Linkedin },
  { name: "Github", href: "https://github.com/acewf", icon: Git },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={roboto.className}
      >
        <header className="flex my-2 items-center justify-between max-w-screen-xl mx-auto px-2 sticky top-0 z-50 bg-background">
          <Image src={logo.src} alt="logo" width={80} height={80} />
          <nav className="text-md font-bold mx-4">
            <ul className="flex gap-4 items-center justify-center flex-row uppercase">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="hover:text-contrast">{item.name}</a>
                </li>
              ))}
            </ul>
            <span className="absolute -bottom-6 left-0 w-full h-7 bg-gradient-to-t from-transparent to-background block"></span>
          </nav>
        </header>
        <main className="max-w-screen-xl mx-auto min-h-screen -mb-20">
          {children}
        </main>
        <footer className="flex gap-6 flex-wrap items-center justify-center mt-8">
          {socialItems.map((item) => (
            <a key={item.name} href={item.href}>
              <span className="sr-only">{item.name}</span>
              <item.icon />
            </a>
          ))}
        </footer>
      </body>
    </html>
  );
}
