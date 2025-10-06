# Data Types

## Core Type Definitions

### LiveUser
```typescript
export type LiveUser = {
  visitor_id: string;
  last_seen: string;
  email?: string;
  country?: string;
  region?: string;
  city?: string;
  page?: string;
  duration?: number;
};
```

### LiveUserSummary
```typescript
export type LiveUserSummary = {
  totalUsers: number;
  avgSessionDuration: number;
  topPages: Array<{
    page: string;
    users: number;
  }>;
  topCountries: Array<{
    country: string;
    users: number;
  }>;
};
```

### GetLiveUsersResponse
```typescript
export type GetLiveUsersResponse = {
  liveUsers: LiveUser[];
  metadata: {
    websiteId: string;
    timeWindowMinutes: number;
    totalLiveUsers: number;
    returnedUsers: number;
    lastUpdated: string;
    timezone: string;
  };
  summary?: LiveUserSummary;
  geography?: Array<{
    country: string;
    region: string;
    city: string;
    users: number;
  }>;
};
```

## Component Props

### LiveUsersGlobeProps
```typescript
interface LiveUsersGlobeProps {
  websiteId: string;
  isOpen: boolean;
  onClose: () => void;
}
```

## Internal Data Structures

### LocationGroup
```typescript
interface LocationGroup {
  city: string;
  country: string;
  users: LiveUser[];
  count: number;
}
```

### GeoJSON Feature
```typescript
interface UserLocationFeature {
  type: "Feature";
  properties: {
    name: string;
    country: string;
    userCount: number;
    users: LiveUser[];
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}
```
