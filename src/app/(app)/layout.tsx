import { checkAuth } from "@/lib/auth/utils";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import NextAuthProvider from "@/lib/auth/Provider";
import TrpcProvider from "@/lib/trpc/Provider";
import { cookies } from "next/headers";
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const clientCookies = await cookies();
  return (
    <main>
      <NextAuthProvider>
        <TrpcProvider cookies={clientCookies.toString()}>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 md:p-8 pt-2 p-8 overflow-y-auto">
              <Navbar />
              {children}
            </main>
          </div>
        </TrpcProvider>
      </NextAuthProvider>

      <Toaster richColors />
    </main>
  );
}
