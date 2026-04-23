import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://seventattoo.com.br";

export const metadata: Metadata = {
  title: {
    default: "Seven Tattoo | Estúdio Privado em Duque de Caxias, RJ",
    template: "%s | Seven Tattoo",
  },
  description:
    "Seven Tattoo — estúdio privado de tatuagem em Duque de Caxias, RJ. Arte única e personalizada por Geovanny Freitas. Orçamentos e agendamentos via Instagram @seventattoo_ofc.",
  keywords: [
    "tatuagem",
    "tattoo",
    "estúdio de tatuagem",
    "Duque de Caxias",
    "RJ",
    "Seven Tattoo",
    "tatuagem personalizada",
    "tatuagem artística",
    "Geovanny Freitas",
  ],
  authors: [{ name: "Geovanny Freitas" }],
  creator: "Seven Tattoo",
  publisher: "Seven Tattoo",
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BASE_URL,
    title: "Seven Tattoo | Estúdio Privado em Duque de Caxias, RJ",
    description:
      "Arte única e personalizada. Estúdio privado em Duque de Caxias, RJ. @seventattoo_ofc",
    siteName: "Seven Tattoo",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Seven Tattoo — Arte na pele, para sempre",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seven Tattoo | Estúdio Privado em Duque de Caxias, RJ",
    description: "Arte única e personalizada. @seventattoo_ofc",
    images: [`${BASE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#d4af37",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TattooShop",
              name: "Seven Tattoo",
              description:
                "Estúdio privado de tatuagem em Duque de Caxias, RJ.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Rua Erne",
                addressLocality: "Duque de Caxias",
                addressRegion: "RJ",
                addressCountry: "BR",
              },
              telephone: "+5521965813894",
              url: BASE_URL,
              sameAs: [
                "https://www.instagram.com/seventattoo_ofc/",
                "https://www.facebook.com/profile.php?id=100028099554525",
                "https://www.tiktok.com/@7seventattoo",
              ],
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
