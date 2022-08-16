export interface DelegateAccessTokenPayload {
  data: Data;
  extensions: Extensions;
}

interface Extensions {
  cost: Cost;
}

interface Cost {
  requestedQueryCost: number;
  actualQueryCost: number;
  throttleStatus: ThrottleStatus;
}

interface ThrottleStatus {
  maximumAvailable: number;
  currentlyAvailable: number;
  restoreRate: number;
}

interface Data {
  delegateAccessTokenCreate: DelegateAccessTokenCreate;
}

interface DelegateAccessTokenCreate {
  delegateAccessToken: DelegateAccessToken;
  shop: Shop;
  userErrors: any[];
}

interface Shop {
  id: string;
  name: string;
}

interface DelegateAccessToken {
  accessToken: string;
}