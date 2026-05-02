"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ChatWidget } from "@/components/ChatWidget";

export function SiteChromeHeader() {
  const pathname = usePathname();
  if (pathname === "/booking") return null;
  return <Header />;
}

export function SiteChromeFooter() {
  const pathname = usePathname();
  if (pathname === "/booking") return null;
  return (
    <>
      <Footer />
      <WhatsAppButton />
      <ChatWidget />
    </>
  );
}
