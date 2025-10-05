export interface ApiKey {
  id: string;
  apiKey: string; // encrypted
  websiteId: string;
  userId: string;
  previewApiSecret: string;
  createdAt: number;
  updatedAt: number;
}

export interface ApiKeyWithSecret extends ApiKey {
  apiSecret: string; // only returned on creation/rotation
}
