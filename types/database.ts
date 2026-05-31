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
    };
    Views: Record<string, never>;
    Functions: {
      set_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type RiztamaBusinessSchema = Database["riztama_business"];
