import type {
  CustomerStatus,
  RentalPackageStatus,
  ServiceAccountProfileStatus,
  ServiceAccountStatus,
  SubscriptionStatus,
} from "@/types/database";

export const CUSTOMER_STATUSES = ["active", "inactive", "archived"] as const satisfies readonly CustomerStatus[];

export const SERVICE_ACCOUNT_STATUSES = [
  "active",
  "full",
  "maintenance",
  "inactive",
  "archived",
] as const satisfies readonly ServiceAccountStatus[];

export const SERVICE_ACCOUNT_PROFILE_STATUSES = [
  "available",
  "occupied",
  "reserved",
  "maintenance",
  "archived",
] as const satisfies readonly ServiceAccountProfileStatus[];

export const RENTAL_PACKAGE_STATUSES = ["active", "archived"] as const satisfies readonly RentalPackageStatus[];

export const SUBSCRIPTION_STATUSES = [
  "booked",
  "completed",
  "cancelled",
  "archived",
] as const satisfies readonly SubscriptionStatus[];
