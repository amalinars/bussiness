import { connection } from "next/server";

import { EmptyState } from "@/components/EmptyState";
import { PageContainer } from "@/components/PageContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCustomers } from "@/lib/customers";

import { CustomerActions } from "./CustomerActions";
import { CustomerFormDialog } from "./CustomerFormDialog";

const customerStatusTone = {
  active: "active",
  inactive: "warning",
  archived: "neutral",
} as const;

export default async function CustomersPage() {
  await connection();

  const { data: customers, error } = await getCustomers();

  return (
    <PageContainer
      title="Customers"
      eyebrow="Active MVP module"
      description="Customer records from the initial Supabase database foundation."
    >
      {error ? (
        <EmptyState title="Customer data unavailable" description={error} />
      ) : customers.length === 0 ? (
        <div className="space-y-4">
          <CustomerFormDialog />
          <EmptyState
            title="No customers yet"
            description="The customers table is connected. Add the first customer to start managing records."
          />
        </div>
      ) : (
        <Card>
          <CardHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <CardTitle>Customer list</CardTitle>
              <CardDescription>{customers.length} customer records loaded from Supabase.</CardDescription>
            </div>
            <CustomerFormDialog />
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-base border-2 border-border">
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
