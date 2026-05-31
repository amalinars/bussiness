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
          <CardHeader className="grid gap-3 px-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6">
            <div className="min-w-0">
              <CardTitle className="text-lg sm:text-xl">Customer list</CardTitle>
              <CardDescription className="wrap-break-word">
                {customers.length} {hasFilters ? "matching" : "total"} customer records found.
              </CardDescription>
            </div>
            <CustomerFormDialog />
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid gap-3 md:hidden">
              {customers.map((customer) => (
                <div key={customer.id} className="min-w-0 space-y-3 rounded-base border-2 border-border bg-background p-3 shadow-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="wrap-break-word font-heading font-bold">{customer.name}</p>
                      <p className="wrap-break-word text-xs font-base text-muted-foreground">{customer.contact_label ?? "No contact label"}</p>
                    </div>
                    <StatusBadge tone={customerStatusTone[customer.status]}>{customer.status}</StatusBadge>
                  </div>

                  <div className="grid gap-2 text-sm font-base">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-base border border-border bg-secondary-background p-2">
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="wrap-break-word">{customer.phone ?? "No phone"}</p>
                      </div>
                      <div className="rounded-base border border-border bg-secondary-background p-2">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="wrap-break-word">{customer.email ?? "-"}</p>
                      </div>
                    </div>
                    <div className="rounded-base border border-border bg-secondary-background p-2">
                      <p className="text-xs text-muted-foreground">Notes</p>
                      <p className="whitespace-pre-wrap wrap-break-word">{customer.notes ?? "-"}</p>
                    </div>
                  </div>

                  <CustomerActions customer={customer} />
                </div>
              ))}
            </div>

            <div className="hidden w-full overflow-x-auto rounded-base border-2 border-border md:block">
              <table className="min-w-[760px] w-full border-collapse text-left text-sm font-base">
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
                      <td className="px-4 py-3 align-top font-heading">{customer.name}</td>
                      <td className="px-4 py-3 align-top">
                        <div>{customer.contact_label ?? "-"}</div>
                        <div className="text-xs">{customer.phone ?? "No phone"}</div>
                      </td>
                      <td className="max-w-xs px-4 py-3 align-top wrap-break-word">{customer.email ?? "-"}</td>
                      <td className="px-4 py-3 align-top">
                        <StatusBadge tone={customerStatusTone[customer.status]}>{customer.status}</StatusBadge>
                      </td>
                      <td className="max-w-xs px-4 py-3 align-top wrap-break-word">{customer.notes ?? "-"}</td>
                      <td className="px-4 py-3 align-top">
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
