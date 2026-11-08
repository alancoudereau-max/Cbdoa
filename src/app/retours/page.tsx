import { LegalPage, legalMetadata } from "@/components/content/LegalPage";

export const metadata = legalMetadata("retours");

export default function Page() {
  return <LegalPage slug="retours" />;
}
