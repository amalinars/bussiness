import { connection } from "next/server";

import { EmptyState } from "@/components/EmptyState";
import { PageContainer } from "@/components/PageContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCustomers } from "@/lib/customers";

import { CustomerActions } from "./CustomerActions";
import { CustomerFilters } from "./CustomerFilters";
import { CustomerFormDialog } from "./CustomerFormDialog";

const customerStatusTone = {
  active: "active",
  inactive: "warning",
  archived: "neutral",
} as const;

type CustomersPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  await connection();

  const params = await searchParams;
  const status = customerStatusTone[params.status as keyof typeof customerStatusTone] ? params.status : "all";
  const filters = {
    q: params.q ?? "",
    status: status as keyof typeof customerStatusTone | "all",
  };
  const hasFilters = Boolean(filters.q || filters.status !== "all");

  const { data: customers, error } = await getCustomers(filters);

  return (
    <PageContainer
      title="Customers"
      eyebrow="Customers"
      description="Manage customer records and contact details."
    >
      <CustomerFilters q={filters.q} status={filters.status} />
      {error ? (
        <EmptyState title="Customer data unavailable" description={error} />
      ) : customers.length === 0 ? (
        <div className="space-y-4">
          <CustomerFormDialog />
          <EmptyState
            title={hasFilters ? "No matching customers" : "No customers yet"}
            description={
              hasFilters
                ? "Try a different search or status filter."
                : "Add the first customer to start managing records."
            }
          />
        </div>
      ) : (
        <Card>
          <CardHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <CardTitle>Customer list</CardTitle>
              <CardDescription>
                {customers.length} {hasFilters ? "matching" : "total"} customer records found.
              </CardDescription>
            </div>
            <CustomerFormDialog />
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto rounded-base border-2 border-border">
              <table className="w-full border-collapse text-left text-sm font-base">
                <thead className="bg-secondary-background">
                  <tr className="border-b-2 border-border">
                    <th className="px-4 py-3 font-heading">Name</th>
                    <th className="px-4 py-3 font-heading">Contact</th>
                    <th className="px-4 py-3 font-heading">Email</th>
                    <th className="px-4 py-3 font-heading">Status</th>
                    <th className="px-4 py-3 font-heading">Notes</th>
                    <th className="px-4 py-3 font-heading">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b-2 border-border last:border-b-0">
                      <td className="px-4 py-3 font-heading">{customer.name}</td>
                      <td className="px-4 py-3">
                        <div>{customer.contact_label ?? "-"}</div>
                        <div className="text-xs">{customer.phone ?? "No phone"}</div>
                      </td>
                      <td className="px-4 py-3">{customer.email ?? "-"}</td>
                      <td className="px-4 py-3">
                        <StatusBadge tone={customerStatusTone[customer.status]}>{customer.status}</StatusBadge>
                      </td>
                      <td className="px-4 py-3">{customer.notes ?? "-"}</td>
                      <td className="px-4 py-3">
                        <CustomerActions customer={customer} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
