import apiClient from './client';
import type { Organisation, Visitor, VisitorFormData, VisitorVisit } from '@/types';

export const organisationApi = {
  getById: (id: number | string) =>
    apiClient.get<{ success: boolean; data: Organisation | null; error?: string }>(`/organisations/${id}`),

  register: (formData: FormData) =>
    apiClient.post<{ success: boolean; message: string; data: Organisation; error?: string }>(
      '/organisations/register',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    ),

  sendVerificationOtp: (email: string) =>
    apiClient.post<{ success: boolean; message: string; email: string; devOtp?: string; error?: string }>(
      '/organisations/send-verification-otp',
      { email }
    ),

  verifyRegistrationOtp: (email: string, otp: string) =>
    apiClient.post<{ success: boolean; message: string; error?: string }>(
      '/organisations/verify-registration-otp',
      { email, otp }
    ),
};

export const visitorApi = {
  check: (mobile_number: string, organisation_id: number) =>
    apiClient.get<{
      success: boolean;
      isReturning: boolean;
      data: Visitor | null;
      lastVisit?: VisitorVisit;
    }>(`/visitors/check?mobile_number=${mobile_number}&organisation_id=${organisation_id}`),

  sendOtp: (mobile_number: string) =>
    apiClient.post<{ success: boolean; message: string; error?: string }>(
      '/visitors/send-otp',
      { mobile_number }
    ),

  verifyOtp: (mobile_number: string, otp: string) =>
    apiClient.post<{ success: boolean; message: string; error?: string }>(
      '/visitors/verify-otp',
      { mobile_number, otp }
    ),

  create: (data: Partial<VisitorFormData & { organisation_id: number }>) =>
    apiClient.post<{ success: boolean; data: Visitor; error?: string }>('/visitors', data),
};

export const visitApi = {
  create: (formData: FormData) =>
    apiClient.post<{
      success: boolean;
      data: VisitorVisit;
      confirmation: {
        message: string;
        host_available: boolean;
        host_name: string;
      };
      error?: string;
    }>('/visitor-visits', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};