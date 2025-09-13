import { getUserForms } from "@/app/actions/form";
import ClientFormsPage from "./clientFormsPage";

export const dynamic = "force-dynamic";

export default async function FormsPage() {
  const forms = await getUserForms();
  return <ClientFormsPage initialForms={forms} />;
}
