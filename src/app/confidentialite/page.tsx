import { LegalPage, legalMetadata } from "@/components/content/LegalPage";

export const metadata = legalMetadata("confidentialite");

export default function Page() {
  return <LegalPage slug="confidentialite" />;
}
