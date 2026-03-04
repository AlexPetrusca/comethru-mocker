import { api } from './api';

export interface Message {
  id: number;
  from: string;
  to: string;
  body: string;
  sentAt: string;
}

export interface SendMessageRequest {
  from: string;
  to: string;
  body: string;
}

export const messagesService = {
  async send(data: SendMessageRequest): Promise<Message> {
    const response = await api.post<Message>('/messages/send', data);
    return response.data;
  },

  async getAll(): Promise<Message[]> {
    const response = await api.get<Message[]>('/messages');
    return response.data;
  },

  async getByRecipient(to: string): Promise<Message[]> {
    const response = await api.get<Message[]>(`/messages/recipient/${to}`);
    return response.data;
  },

  async getBySender(from: string): Promise<Message[]> {
    const response = await api.get<Message[]>(`/messages/sender/${from}`);
    return response.data;
  },

  async getBetween(from: string, to: string): Promise<Message[]> {
    const response = await api.get<Message[]>('/messages/between', {
      params: { from, to },
    });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/messages/${id}`);
  },
};
