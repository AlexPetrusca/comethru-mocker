import { api } from './api';

export interface VerificationCode {
  id: number;
  to: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  verified: boolean;
}

export interface SendVerificationRequest {
  to: string;
}

export interface VerifyCodeRequest {
  to: string;
  code: string;
}

export interface VerifyCodeResponse {
  valid: boolean;
  message?: string;
}

export const verificationService = {
  async send(data: SendVerificationRequest): Promise<void> {
    await api.post('/verification/send', data);
  },

  async verify(data: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    const response = await api.post<VerifyCodeResponse>('/verification/verify', data);
    return response.data;
  },

  async getByRecipient(to: string): Promise<VerificationCode[]> {
    const response = await api.get<VerificationCode[]>(`/verification/recipient/${to}`);
    return response.data;
  },
};
