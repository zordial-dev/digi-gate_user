export interface Organisation {
  id: number;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url: string;
  timezone: string;
  host_available_message: string;
  host_unavailable_message: string;
  is_active: boolean;
  people: Host[];
  created_at: string;
  updated_at: string;
}

export interface Host {
  id: number;
  full_name: string;
  designation: string;
  email: string;
  profile_pic: string;
  is_available: boolean;
}

export interface VisitorFormData {
  full_name: string;
  designation: string;
  company: string;
  location?: string | null;
  email?: string | null;
  linkedin?: string | null;
  mobile_number: string;
  purpose_of_visit: string;
  reference?: string | null;
}

export interface Visitor {
  id: number;
  organisation_id: number;
  full_name: string;
  designation: string;
  company: string;
  location?: string | null;
  email?: string | null;
  linkedin?: string | null;
  mobile_number: string;
  created_at: string;
  updated_at: string;
}

export interface VisitorVisit {
  id: number;
  visitor_id: number;
  organisation_id: number;
  host_id: number;
  purpose_of_visit: string;
  reference?: string | null;
  selfie_url?: string | null;
  otp_verified: boolean;
  otp_code?: string | null;
  otp_expires_at?: string | null;
  otp_attempts: number;
  otp_sent_at?: string | null;
  otp_verified_at?: string | null;
  visit_date: string;
  visit_time: string;
  check_in_time: string;
  check_out_time?: string | null;
  submission_timestamp: string;
  host_available_at_submission: boolean;
  confirmation_message?: string | null;
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface ConfirmationData {
  message: string;
  host_available: boolean;
  host_name: string;
}