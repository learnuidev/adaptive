export interface UserWebsite {
  id: string;
  title: string;
  description: string;

  apiKey: string;
  scopes: string[];

  userId: string;
  domain: string;
  urlEndpoint: string;

  createdAt: number;
}

export interface UserWebsiteWithSecret extends UserWebsite {
  apiSecret: string;
  previewApiSecret: string;
}
