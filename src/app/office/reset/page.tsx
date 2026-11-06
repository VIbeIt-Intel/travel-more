import type { Metadata } from "next";
import { ResetPassword } from "@/components/OfficePassword";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
};

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { token } = await searchParams;
  return (
    <main id="main-content">
      <ResetPassword token={typeof token === "string" ? token : ""} />
    </main>
  );
}
