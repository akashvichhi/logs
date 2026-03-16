export interface IApiKey {
  id: number;
  name: string;
  prefix: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string | null;
}

export interface IApiKeyWithSecret extends IApiKey {
  fullKey: string;
}
