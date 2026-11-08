import { LegalPage, legalMetadata } from "@/components/content/LegalPage";

export const metadata = legalMetadata("cgv");

export default function Page() {
  return <LegalPage slug="cgv" />;
}
