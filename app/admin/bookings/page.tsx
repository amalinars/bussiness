import { connection } from "next/server";

import { EmptyState } from "@/components/EmptyState";
import { PageContainer } from "@/components/PageContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSubscriptionFormOptions, getSubscriptions } from "@/lib/subscriptions";

import { BookingActions } from "./BookingActions";
import { BookingFilters } from "./BookingFilters";
import { BookingFormDialog } from "./BookingFormDialog";

const bookingStatusTone = {
  booked: "active",
  completed: "info",
  cancelled: "warning",
  archived: "neutral",
} as const;

type BookingsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  await connection();

  const params = await searchParams;
  const status = bookingStatusTone[params.status as keyof typeof bookingStatusTone] ? params.status : "all";
  const filters = {
    q: params.q ?? "",
    status: status as keyof typeof bookingStatusTone | "all",
  };
  const hasFilters = Boolean(filters.q || filters.status !== "all");

  const [bookingsResult, optionsResult] = await Promise.all([
    getSubscriptions(filters),
    getSubscriptionFormOptions(),
  ]);

  const canOpenForm = optionsResult.error === null;

  return (
    <PageContainer
      title="Bookings"
      eyebrow="New MVP module"
      description="Manage customer bookings from service account profiles and rental packages."
    >
      <BookingFilters q={filters.q} status={filters.status} />
      {bookingsResult.error ? (
        <EmptyState title="Booking data unavailable" description={bookingsResult.error} />
      ) : bookingsResult.data.length === 0 ? (
        <div className="space-y-4">
          {canOpenForm ? <BookingFormDialog options={optionsResult} /> : null}
          <EmptyState
            title={hasFilters ? "No matching bookings" : "No bookings yet"}
            description={
              hasFilters
                ? "Try a different search or status filter."
                : optionsResult.error ?? "Add the first booking to start replacing the spreadsheet flow."
            }
          />
        </div>
      ) : (
        <Card>
          <CardHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <CardTitle>Booking list</CardTitle>
              <CardDescription>
                {bookingsResult.data.length} {hasFilters ? "matching" : "total"} booking records loaded from Supabase.
              </CardDescription>
            </div>
            {canOpenForm ? <BookingFormDialog options={optionsResult} /> : null}
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto rounded-base border-2 border-border">
              <table className="w-full border-collapse text-left text-sm font-base">
                <thead className="bg-secondary-background">
                  <tr className="border-b-2 border-border">
                    <th className="px-4 py-3 font-heading">Customer</th>
                    <th className="px-4 py-3 font-heading">Account/Profile</th>
                    <th className="px-4 py-3 font-heading">Package</th>
                    <th className="px-4 py-3 font-heading">Dates</th>
                    <th className="px-4 py-3 font-heading">Price</th>
                    <th className="px-4 py-3 font-heading">Status</th>
                    <th className="px-4 py-3 font-heading">Notes</th>
                    <th className="px-4 py-3 font-heading">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingsResult.data.map((booking) => (
                    <tr key={booking.id} className="border-b-2 border-border last:border-b-0">
                      <td className="px-4 py-3">
                        <div className="font-heading">{booking.customer?.name ?? "Unknown customer"}</div>
                        <div className="text-xs">{booking.customer?.phone ?? booking.customer?.contact_label ?? "No contact"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-heading">{booking.serviceAccount?.label ?? "Unknown account"}</div>
                        <div className="text-xs">
                          {booking.profile?.profile_name ?? "Unknown profile"}
                          {booking.profile?.profile_pin ? ` — PIN ${booking.profile.profile_pin}` : ""}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>{booking.package_name_snapshot}</div>
                        <div className="text-xs">{booking.duration_days_snapshot} day(s)</div>
                      </td>
                      <td className="px-4 py-3">
                        <div>{booking.start_date}</div>
                        <div className="text-xs">to {booking.end_date}</div>
                      </td>
                      <td className="px-4 py-3">Rp {booking.price_snapshot.toLocaleString("id-ID")}</td>
                      <td className="px-4 py-3">
                        <StatusBadge tone={bookingStatusTone[booking.status]}>{booking.status}</StatusBadge>
                      </td>
                      <td className="px-4 py-3">{booking.notes ?? "-"}</td>
                      <td className="px-4 py-3">
                        {canOpenForm ? <BookingActions booking={booking} options={optionsResult} /> : null}
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
