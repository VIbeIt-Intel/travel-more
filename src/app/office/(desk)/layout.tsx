import type { Metadata } from "next";
import { OfficeLogin } from "@/components/OfficeLogin";
import { OfficeShell } from "@/components/OfficeShell";
import { currentUser } from "@/lib/session";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DeskLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) {
    return (
      <main id="main-content">
        <OfficeLogin />
      </main>
    );
  }
  return (
    <main id="main-content">
      <OfficeShell name={user.name}>{children}</OfficeShell>
    </main>
  );
}
