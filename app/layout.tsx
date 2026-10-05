import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "Reynold Andre – Web Developer",
  description: "Personal portfolio of Reynold Andre, Web Developer and Software Engineering Technology graduate from IPB University.",
  icons: {
    icon: "/image/logoRey0.png",
    shortcut: "/image/logoRey0.png",
  },
  openGraph: {
    title: "Reynold Andre – Web Developer",
    description: "Personal portfolio of Reynold Andre, Web Developer and Software Engineering Technology graduate from IPB University.",
    type: "website",
    images: [
      {
        url: "/image/andre.jpg",
        width: 800,
        height: 800,
        alt: "Reynold Andre",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased selection:bg-[#ff3f81] selection:text-white">
        {children}
      </body>
    </html>
  );
}
