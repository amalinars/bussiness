import { PendingSubmitButton } from "@/components/PendingSubmitButton";
import type { SubscriptionFormOptionsResult, SubscriptionListItem } from "@/lib/subscriptions";

import { archiveBookingAction } from "./actions";
import { BookingFormDialog } from "./BookingFormDialog";

type BookingActionsProps = {
  booking: SubscriptionListItem;
  options: Extract<SubscriptionFormOptionsResult, { error: null }>;
};

export function BookingActions({ booking, options }: BookingActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      <BookingFormDialog booking={booking} options={options} />
      <form action={archiveBookingAction} className="w-full sm:w-auto">
        <input type="hidden" name="id" value={booking.id} />
        <PendingSubmitButton idleLabel="Archive" pendingLabel="Archiving..." size="sm" variant="neutral" className="w-full sm:w-auto" disabled={booking.status === "archived"}>
          Archive
        </PendingSubmitButton>
      </form>
    </div>
  );
}
