import type { CustomerStatus, ServiceAccountStatus } from "@/types/database";

export const CUSTOMER_STATUSES = ["active", "inactive", "archived"] as const satisfies readonly CustomerStatus[];

export const SERVICE_ACCOUNT_STATUSES = [
  "active",
  "full",
  "maintenance",
  "inactive",
  "archived",
] as const satisfies readonly ServiceAccountStatus[];
