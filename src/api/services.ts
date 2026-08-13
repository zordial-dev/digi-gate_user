import apiClient from './client';
import type { Organisation, Visitor, VisitorFormData, VisitorVisit } from '@/types';

export const organisationApi = {
  getById: (id: number) =>
    apiClient.get<{ success: boolean; data: Organisation }>(`/organisations/${id}`),
};

export const visitorApi = {
  check: (mobile_number: string, organisation_id: number) =>
    apiClient.get<{
      success: boolean;
      isReturning: boolean;
      data: Visitor | null;
      lastVisit?: VisitorVisit;
    }>(`/visitors/check?mobile_number=${mobile_number}&organisation_id=${organisation_id}`),

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