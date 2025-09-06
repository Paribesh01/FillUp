import { getUserForms } from "@/app/actions/form";
import ClientFormsPage from "./clientFormsPage";

export default async function FormsPage() {
  const forms = await getUserForms();
  return <ClientFormsPage initialForms={forms} />;
}
