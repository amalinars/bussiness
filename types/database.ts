export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type CustomerStatus = "active" | "inactive" | "archived";

export type ServiceAccountStatus =
  | "active"
  | "full"
  | "maintenance"
  | "inactive"
  | "archived";

export type ServiceAccountProfileStatus =
  | "available"
  | "occupied"
  | "reserved"
  | "maintenance"
  | "archived";

export type ServiceAccountCostStatus = "paid" | "planned" | "cancelled";

export type RentalPackageStatus = "active" | "archived";

export type SubscriptionStatus = "booked" | "completed" | "cancelled" | "archived";

export type Customer = {
  id: string;
  name: string;
  contact_label: string | null;
  phone: string | null;
  email: string | null;
  status: CustomerStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ServiceAccount = {
  id: string;
  label: string;
  service_name: string;
  account_identifier: string | null;
  account_password: string | null;
  credential_reference: string | null;
  total_slots: number;
  used_slots: number;
  status: ServiceAccountStatus;
  renewal_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ServiceAccountProfile = {
  id: string;
  service_account_id: string;
  profile_name: string;
  profile_pin: string | null;
  is_rentable: boolean;
  status: ServiceAccountProfileStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ServiceAccountCost = {
  id: string;
  service_account_id: string;
  cost_date: string;
  period_start: string;
  period_end: string;
  amount: number;
  status: ServiceAccountCostStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type RentalPackage = {
  id: string;
  name: string;
  duration_days: number;
  default_price: number;
  status: RentalPackageStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  customer_id: string;
  service_account_id: string;
  service_account_profile_id: string;
  rental_package_id: string;
  package_name_snapshot: string;
  duration_days_snapshot: number;
  price_snapshot: number;
  start_date: string;
  end_date: string;
  end_time: string | null;
  status: SubscriptionStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CustomerInsert = {
  id?: string;
  name: string;
  contact_label?: string | null;
  phone?: string | null;
  email?: string | null;
  status?: CustomerStatus;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CustomerUpdate = Partial<CustomerInsert>;

export type ServiceAccountInsert = {
  id?: string;
  label: string;
  service_name: string;
  account_identifier?: string | null;
  account_password?: string | null;
  credential_reference?: string | null;
  total_slots?: number;
  used_slots?: number;
  status?: ServiceAccountStatus;
  renewal_date?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ServiceAccountUpdate = Partial<ServiceAccountInsert>;

export type ServiceAccountProfileInsert = {
  id?: string;
  service_account_id: string;
  profile_name: string;
  profile_pin?: string | null;
  is_rentable?: boolean;
  status?: ServiceAccountProfileStatus;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ServiceAccountProfileUpdate = Partial<ServiceAccountProfileInsert>;

export type ServiceAccountCostInsert = {
  id?: string;
  service_account_id: string;
  cost_date: string;
  period_start: string;
  period_end: string;
  amount: number;
  status?: ServiceAccountCostStatus;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ServiceAccountCostUpdate = Partial<ServiceAccountCostInsert>;

export type RentalPackageInsert = {
  id?: string;
  name: string;
  duration_days: number;
  default_price: number;
  status?: RentalPackageStatus;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type RentalPackageUpdate = Partial<RentalPackageInsert>;

export type SubscriptionInsert = {
  id?: string;
  customer_id: string;
  service_account_id: string;
  service_account_profile_id: string;
  rental_package_id: string;
  package_name_snapshot: string;
  duration_days_snapshot: number;
  price_snapshot: number;
  start_date: string;
  end_date: string;
  end_time?: string | null;
  status?: SubscriptionStatus;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type SubscriptionUpdate = Partial<SubscriptionInsert>;

export type Database = {
  riztama_business: {
    Tables: {
      customers: {
        Row: Customer;
        Insert: CustomerInsert;
        Update: CustomerUpdate;
        Relationships: [];
      };
      service_accounts: {
        Row: ServiceAccount;
        Insert: ServiceAccountInsert;
        Update: ServiceAccountUpdate;
        Relationships: [];
      };
      service_account_profiles: {
        Row: ServiceAccountProfile;
        Insert: ServiceAccountProfileInsert;
        Update: ServiceAccountProfileUpdate;
        Relationships: [];
      };
      service_account_costs: {
        Row: ServiceAccountCost;
        Insert: ServiceAccountCostInsert;
        Update: ServiceAccountCostUpdate;
        Relationships: [];
      };
      rental_packages: {
        Row: RentalPackage;
        Insert: RentalPackageInsert;
        Update: RentalPackageUpdate;
        Relationships: [];
      };
      subscriptions: {
        Row: Subscription;
        Insert: SubscriptionInsert;
        Update: SubscriptionUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      set_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      complete_expired_bookings: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type RiztamaBusinessSchema = Database["riztama_business"];
