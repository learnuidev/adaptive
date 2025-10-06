# React Hooks

## Primary Hook

### useGetLiveUsersQuery
**Location**: `src/modules/analytics/use-get-live-users-query.ts`

```typescript
export const useGetLiveUsersQuery = ({
  websiteId,
  timeWindowMinutes = 30,
  includeSummary = true,
  includeGeography = false,
  limit = 100,
  enabled = true,
}: {
  websiteId: string;
  timeWindowMinutes?: number;
  includeSummary?: boolean;
  includeGeography?: boolean;
  limit?: number;
  enabled?: boolean;
}) => useQuery<GetLiveUsersResponse>
```

#### Hook Configuration
- **Query Key**: `["get-live-users", websiteId, timeWindowMinutes, includeSummary, includeGeography, limit]`
- **Refetch Interval**: 30,000ms (30 seconds)
- **Refetch on Mount**: Enabled
- **Refetch on Reconnect**: Enabled
- **Refetch on Window Focus**: Enabled
- **Background Refetch**: Disabled
- **Enabled Condition**: `enabled && !!websiteId`

#### Usage Example
```typescript
const { data: liveUsersData } = useGetLiveUsersQuery({
  websiteId,
  timeWindowMinutes: 30,
  includeSummary: false,
  includeGeography: true,
  limit: 1000,
  enabled: isOpen && !!websiteId,
});
```

## Hook Dependencies

### Supporting Hooks
- **useQuery**: From `@tanstack/react-query` for data fetching
- **useEffect**: For Mapbox initialization and cleanup
- **useRef**: For Mapbox instance management
- **useState**: For map loading state management

## Custom Hook Features
- **Automatic Cleanup**: Properly removes Mapbox instance on unmount
- **Conditional Fetching**: Only fetches when component is open and websiteId exists
- **Error Boundary**: Handles API failures gracefully
- **Loading States**: Built-in loading indicators for better UX
