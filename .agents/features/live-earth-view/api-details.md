# API Details

## Live Users API
- **Endpoint**: `/v1/analytics/get-live-users`
- **Method**: POST
- **Authentication**: Bearer token via `fetchWithToken`
- **Base URL**: Configured in `appConfig.apiUrl`

### Request Body
```typescript
{
  websiteId: string,
  timeWindowMinutes?: number, // default: 30
  includeSummary?: boolean, // default: true
  includeGeography?: boolean, // default: false
  limit?: number // default: 100
}
```

### Response Structure
```typescript
{
  liveUsers: LiveUser[],
  metadata: {
    websiteId: string,
    timeWindowMinutes: number,
    totalLiveUsers: number,
    returnedUsers: number,
    lastUpdated: string,
    timezone: string
  },
  summary?: LiveUserSummary,
  geography?: Array<GeographicData>
}
```

## Data Refresh Rate
- **Automatic Refresh**: Every 30 seconds
- **Refetch Triggers**: Window focus, reconnection, mount
- **Background Refresh**: Disabled when not in focus

## Error Handling
- API errors are caught and handled by React Query
- Failed requests throw descriptive error messages
- Graceful fallback for missing geolocation data
