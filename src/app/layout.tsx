'use client'
import { Geist, Geist_Mono, Grenze_Gotisch } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const grenzeGotisch = Grenze_Gotisch({
  variable: "--font-grenze-gotisch",
  subsets: ["latin"],
});

const links = [
  {
    name: 'List of Cards',
    href: '/'
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <Providers>
          <header className={`${grenzeGotisch.className} bg-gray-800 text-white p-4 flex justify-start items-center`}>
            <h1 className="text-2xl font-bold mr-4">MAGIC: The Gathering</h1>
            {links.map((link) => (
              <Link key={link.name} href={link.href} className={`${pathname === link.href ? 'text-gray-300' : 'text-white'}`}>{link.name}</Link>
            ))}
          </header>
          <main className="p-4 bg-stone-400 min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
