import { Button } from "@/components/ui/button";
import type { SubscriptionFormOptionsResult, SubscriptionListItem } from "@/lib/subscriptions";

import { archiveBookingAction } from "./actions";
import { BookingFormDialog } from "./BookingFormDialog";

type BookingActionsProps = {
  booking: SubscriptionListItem;
  options: Extract<SubscriptionFormOptionsResult, { error: null }>;
};

export function BookingActions({ booking, options }: BookingActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <BookingFormDialog booking={booking} options={options} />
      <form action={archiveBookingAction}>
        <input type="hidden" name="id" value={booking.id} />
        <Button type="submit" size="sm" variant="neutral" disabled={booking.status === "archived"}>
          Archive
        </Button>
      </form>
    </div>
  );
}
