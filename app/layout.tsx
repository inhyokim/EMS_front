import "./globals.css";
import { RQProvider } from "@/src/lib/queryClient";

export const metadata = { title: "EMS", description: "EMS" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body><RQProvider>{children}</RQProvider></body></html>;
}