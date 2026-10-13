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
    apiClient.post<{
      success: boolean;
      message: string;
      email: string;
      emailServiceOutput?: any;
      devOtp?: string;
      error?: string;
    }>(
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

export interface PostOfficeDetail {
  Name: string;
  Description: string | null;
  BranchType: string;
  DeliveryStatus: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  Block: string;
  State: string;
  Country: string;
  Pincode: string;
}

export interface PincodeApiResponse {
  Message: string;
  Status: 'Success' | 'Error';
  PostOffice: PostOfficeDetail[] | null;
}

export interface ZippopotamPlace {
  'place name': string;
  longitude: string;
  state: string;
  'state abbreviation': string;
  latitude: string;
}

export interface ZippopotamApiResponse {
  'post code': string;
  country: string;
  'country abbreviation': string;
  places: ZippopotamPlace[];
}

export interface PostalCodeLocation {
  placeName: string;
  state: string;
  stateAbbreviation?: string;
  latitude?: string;
  longitude?: string;
}

export interface PostalCodeSearchResult {
  success: boolean;
  message: string;
  city?: string;
  district?: string;
  state?: string;
  stateAbbreviation?: string;
  country?: string;
  countryAbbreviation?: string;
  latitude?: string;
  longitude?: string;
  places?: PostalCodeLocation[];
  postOffices?: PostOfficeDetail[];
  source?: 'postalpincode' | 'zippopotam';
}

export type PincodeSearchResult = PostalCodeSearchResult;

export const zippopotamApi = {
  lookup: async (country: string, postalCode: string): Promise<PostalCodeSearchResult> => {
    const cleanCountry = country.trim().toLowerCase();
    const cleanPostal = postalCode.trim();

    if (!cleanCountry || !cleanPostal) {
      return {
        success: false,
        message: 'Country code and postal code are required.',
      };
    }

    const queryEndpoint = async (code: string): Promise<ZippopotamApiResponse | null> => {
      try {
        const response = await fetch(
          `https://api.zippopotam.us/${encodeURIComponent(cleanCountry)}/${encodeURIComponent(code)}`
        );
        if (!response.ok) return null;
        const data: ZippopotamApiResponse = await response.json();
        if (data && Array.isArray(data.places) && data.places.length > 0) {
          return data;
        }
        return null;
      } catch {
        return null;
      }
    };

    try {
      // 1. Try exact postal code
      let data = await queryEndpoint(cleanPostal);

      // 2. If not found and code contains hyphens or spaces, try prefix (e.g. 90210-1234 -> 90210, SW1A 1AA -> SW1A)
      if (!data && (cleanPostal.includes('-') || cleanPostal.includes(' '))) {
        const prefix = cleanPostal.split(/[- ]+/)[0].trim();
        if (prefix && prefix !== cleanPostal) {
          data = await queryEndpoint(prefix);
        }
      }

      if (data && data.places && data.places.length > 0) {
        const first = data.places[0];
        return {
          success: true,
          message: `Found ${data.places.length} location(s) for ${data['post code']}`,
          city: first['place name'],
          district: first['place name'],
          state: first.state,
          stateAbbreviation: first['state abbreviation'],
          country: data.country,
          countryAbbreviation: data['country abbreviation'],
          latitude: first.latitude,
          longitude: first.longitude,
          places: data.places.map((p) => ({
            placeName: p['place name'],
            state: p.state,
            stateAbbreviation: p['state abbreviation'],
            latitude: p.latitude,
            longitude: p.longitude,
          })),
          source: 'zippopotam',
        };
      }

      return {
        success: false,
        message: `No records found for postal code "${cleanPostal}" in ${country.toUpperCase()}.`,
      };
    } catch (err: any) {
      console.error('Failed to fetch postal code from zippopotam:', err);
      return {
        success: false,
        message: err.message || 'Failed to fetch postal code details.',
      };
    }
  },
};

export const pincodeApi = {
  lookup: async (pincode: string, countryCode: string = 'IN'): Promise<PostalCodeSearchResult> => {
    const cleanPin = pincode.trim();
    const cleanCountry = (countryCode || 'IN').trim().toUpperCase();

    // If country is India
    if (cleanCountry === 'IN' || cleanCountry === 'INDIA') {
      if (!cleanPin || cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
        return {
          success: false,
          message: 'PIN code must be a 6-digit number.',
        };
      }

      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
        if (response.ok) {
          const data: PincodeApiResponse[] | PincodeApiResponse = await response.json();
          const result = Array.isArray(data) ? data[0] : data;

          if (result && result.Status === 'Success' && result.PostOffice && result.PostOffice.length > 0) {
            const firstPo = result.PostOffice[0];
            const city = (firstPo.District && firstPo.District !== 'NA')
              ? firstPo.District
              : (firstPo.Block && firstPo.Block !== 'NA')
              ? firstPo.Block
              : (firstPo.Circle && firstPo.Circle !== 'NA')
              ? firstPo.Circle
              : firstPo.Region || '';
            const state = (firstPo.State && firstPo.State !== 'NA') ? firstPo.State : '';
            const country = (firstPo.Country && firstPo.Country !== 'NA') ? firstPo.Country : 'India';

            return {
              success: true,
              message: result.Message || `Found ${result.PostOffice.length} post office(s)`,
              city,
              district: firstPo.District,
              state,
              country,
              countryAbbreviation: 'IN',
              postOffices: result.PostOffice,
              places: result.PostOffice.map((po) => ({
                placeName: po.Name,
                state: po.State,
              })),
              source: 'postalpincode',
            };
          }
        }
      } catch (err) {
        console.warn('postalpincode.in lookup failed, falling back to zippopotam.us:', err);
      }

      // Fallback for India to zippopotam
      const zippoResult = await zippopotamApi.lookup('in', cleanPin);
      if (zippoResult.success) {
        return zippoResult;
      }

      return {
        success: false,
        message: 'No records found for this PIN code.',
      };
    }

    // For any other country, use Zippopotam
    return zippopotamApi.lookup(cleanCountry, cleanPin);
  },
};

export const postalCodeApi = pincodeApi;