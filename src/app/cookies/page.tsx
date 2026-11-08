import { LegalPage, legalMetadata } from "@/components/content/LegalPage";

export const metadata = legalMetadata("cookies");

export default function Page() {
  return <LegalPage slug="cookies" />;
}
