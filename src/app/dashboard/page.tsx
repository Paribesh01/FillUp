import { getUserForms } from "@/app/actions/form";
import { columns, Form } from "@/components/ui/forms-table/columns";
import { DataTable } from "@/components/ui/forms-table/data-table";
import CreateFormButton from "./CreateFormButton";

export default async function DashboardPage() {
  const forms = await getUserForms();

  // Map dates to string for serialization
  const data: Form[] = forms.map((form: any) => ({
    id: form.id,
    title: form.title,
    createdAt: form.createdAt,
    updatedAt: form.updatedAt,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Forms</h1>
      <CreateFormButton />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
