import { connection } from "next/server";

import { EmptyState } from "@/components/EmptyState";
import { PageContainer } from "@/components/PageContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSubscriptionFormOptions, getSubscriptions } from "@/lib/subscriptions";
import { Countdown } from "@/components/Countdown";

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
    account?: string;
  }>;
};

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  await connection();

  const params = await searchParams;
  const status = bookingStatusTone[params.status as keyof typeof bookingStatusTone] ? params.status : "all";
  const optionsResult = await getSubscriptionFormOptions();
  const serviceAccountId = optionsResult.error === null && optionsResult.serviceAccounts.some((account) => account.id === params.account)
    ? params.account
    : "all";
  const filters = {
    q: params.q ?? "",
    status: status as keyof typeof bookingStatusTone | "all",
    service_account_id: serviceAccountId,
  };
  const hasFilters = Boolean(filters.q || filters.status !== "all" || filters.service_account_id !== "all");
  const bookingsResult = await getSubscriptions(filters);
  const canOpenForm = optionsResult.error === null;

  return (
    <PageContainer
      title="Bookings"
      eyebrow="Bookings"
      description="Manage customer bookings from service account profiles and rental packages."
    >
      <BookingFilters
        q={filters.q}
        status={filters.status}
        serviceAccountId={filters.service_account_id}
        serviceAccounts={optionsResult.error === null ? optionsResult.serviceAccounts : []}
      />
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
                : optionsResult.error ?? "Add the first booking to start managing customer rentals."
            }
          />
        </div>
      ) : (
        <Card>
          <CardHeader className="grid gap-3 px-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6">
            <div className="min-w-0">
              <CardTitle className="text-lg sm:text-xl">Booking list</CardTitle>
              <CardDescription className="wrap-break-word">
                {bookingsResult.data.length} {hasFilters ? "matching" : "total"} booking records found.
              </CardDescription>
            </div>
            {canOpenForm ? <BookingFormDialog options={optionsResult} /> : null}
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid gap-3 md:hidden">
              {bookingsResult.data.map((booking) => (
                <div key={booking.id} className="min-w-0 space-y-3 rounded-base border-2 border-border bg-background p-3 shadow-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="wrap-break-word font-heading font-bold">{booking.customer?.name ?? "Unknown customer"}</p>
                      <p className="wrap-break-word text-xs font-base text-muted-foreground">
                        {booking.customer?.phone ?? booking.customer?.contact_label ?? "No contact"}
                      </p>
                    </div>
                    <StatusBadge tone={bookingStatusTone[booking.status]}>{booking.status}</StatusBadge>
                  </div>

                  <div className="grid gap-2 text-sm font-base">
                    <div className="rounded-base border border-border bg-secondary-background p-2">
                      <p className="text-xs text-muted-foreground">Account / Profile</p>
                      <p className="wrap-break-word font-heading font-bold">{booking.serviceAccount?.label ?? "Unknown account"}</p>
                      <p className="wrap-break-word text-xs">
                        {booking.profile?.profile_name ?? "Unknown profile"}
                        {booking.profile?.profile_pin ? ` — PIN ${booking.profile.profile_pin}` : ""}
                      </p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-base border border-border bg-secondary-background p-2">
                        <p className="text-xs text-muted-foreground">Package</p>
                        <p className="wrap-break-word font-heading font-bold">{booking.package_name_snapshot}</p>
                        <p className="text-xs">{booking.duration_days_snapshot} day(s)</p>
                      </div>
                      <div className="rounded-base border border-border bg-secondary-background p-2">
                        <p className="text-xs text-muted-foreground">Dates</p>
                        <p>{booking.start_date}</p>
                        <p className="text-xs mb-1">
                          to {booking.end_date}
                          {booking.end_time ? ` at ${booking.end_time.slice(0, 5)}` : ""}
                        </p>
                        <Countdown endDate={booking.end_date} endTime={booking.end_time} status={booking.status} />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-base border border-border bg-secondary-background p-2">
                      <span className="text-xs text-muted-foreground">Price</span>
                      <span className="wrap-break-word text-right font-heading font-bold">Rp {booking.price_snapshot.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="rounded-base border border-border bg-secondary-background p-2">
                      <p className="text-xs text-muted-foreground">Notes</p>
                      <p className="whitespace-pre-wrap wrap-break-word">{booking.notes ?? "-"}</p>
                    </div>
                  </div>

                  {canOpenForm ? <BookingActions booking={booking} options={optionsResult} /> : null}
                </div>
              ))}
            </div>

            <div className="hidden w-full overflow-x-auto rounded-base border-2 border-border md:block">
              <table className="min-w-[980px] w-full border-collapse text-left text-sm font-base">
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
                      <td className="px-4 py-3 align-top">
                        <div className="font-heading">{booking.customer?.name ?? "Unknown customer"}</div>
                        <div className="text-xs">{booking.customer?.phone ?? booking.customer?.contact_label ?? "No contact"}</div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="font-heading">{booking.serviceAccount?.label ?? "Unknown account"}</div>
                        <div className="text-xs">
                          {booking.profile?.profile_name ?? "Unknown profile"}
                          {booking.profile?.profile_pin ? ` — PIN ${booking.profile.profile_pin}` : ""}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div>{booking.package_name_snapshot}</div>
                        <div className="text-xs">{booking.duration_days_snapshot} day(s)</div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div>{booking.start_date}</div>
                        <div className="text-xs mb-1">
                          to {booking.end_date}
                          {booking.end_time ? ` at ${booking.end_time.slice(0, 5)}` : ""}
                        </div>
                        <Countdown endDate={booking.end_date} endTime={booking.end_time} status={booking.status} />
                      </td>
                      <td className="px-4 py-3 align-top">Rp {booking.price_snapshot.toLocaleString("id-ID")}</td>
                      <td className="px-4 py-3 align-top">
                        <StatusBadge tone={bookingStatusTone[booking.status]}>{booking.status}</StatusBadge>
                      </td>
                      <td className="max-w-xs px-4 py-3 align-top wrap-break-word">{booking.notes ?? "-"}</td>
                      <td className="px-4 py-3 align-top">
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
