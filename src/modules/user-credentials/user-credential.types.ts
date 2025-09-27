export interface UserCredential {
  id: string;
  title: string;
  description: string;

  apiKey: string;
  apiSecret: string;
  previewApiSecret: string;
  scopes: string[];

  userId: string;
  domain: string;
  urlEndpoint: string;

  createdAt: number;
}
