import { LegalPage, legalMetadata } from "@/components/content/LegalPage";

export const metadata = legalMetadata("mentions-legales");

export default function Page() {
  return <LegalPage slug="mentions-legales" />;
}
