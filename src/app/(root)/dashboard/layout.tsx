export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
