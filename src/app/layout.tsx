import type { Metadata } from "next";
import "./globals.css";
import CosmicNetworkBackground from "@/components/background/CosmicNetworkBackground";

export const metadata: Metadata = {
  title: "SkillBite — Học kỹ năng thực tế 10 phút mỗi ngày",
  description: "Ứng dụng giúp sinh viên và người đi làm học kỹ năng thực tế 10 phút mỗi ngày",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#061625] text-[#F5FAFF] relative selection:bg-[#43D5ED]/30 selection:text-[#43D5ED] overflow-x-hidden">
        {/* Layer 0 & 1: Vanta.NET particle network + atmospheric gradient */}
        <CosmicNetworkBackground />
        
        {/* Layer 2: Main application UI */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
