# Implementation Details

## File Structure
```
src/
├── components/dashboard/
│   └── live-users-globe.tsx          # Main globe component
├── modules/analytics/
│   └── use-get-live-users-query.ts   # API hook and types
└── pages/
    └── dashboard.tsx                 # Usage integration
```

## Key Implementation Decisions

### Geolocation Strategy
- **Simplified City Mapping**: Predefined coordinate lookup for major cities
- **Future Enhancement**: Integration with proper geocoding API
- **Fallback Handling**: Default coordinates [0, 0] for unmapped locations

### Performance Optimizations
- **Conditional Rendering**: Component only renders when `isOpen` is true
- **Lazy Loading**: Mapbox loads only when component is opened
- **Cluster Visualization**: Groups users by location to reduce marker count
- **Refetch Control**: Disabled background refreshes to prevent unnecessary calls

### Data Clustering Algorithm
```typescript
const locationGroups = liveUsersData.liveUsers.reduce((acc: any, user) => {
  if (user.city && user.country) {
    const key = `${user.city}, ${user.country}`;
    if (!acc[key]) {
      acc[key] = {
        city: user.city,
        country: user.country,
        users: [],
        count: 0,
      };
    }
    acc[key].users.push(user);
    acc[key].count++;
  }
  return acc;
}, {});
```

### Environment Configuration
- **API Key**: `VITE_MAPBOX_API_KEY` environment variable
- **Base URL**: Configured in `appConfig.apiUrl`
- **Authentication**: Bearer token via `fetchWithToken` utility

### State Management
- **Component State**: Map loading status, map instance ref
- **Data State**: Managed by React Query with automatic refetching
- **UI State**: Modal visibility controlled by parent component

### Error Handling
- **API Failures**: Handled by React Query error boundaries
- **Mapbox Loading**: Graceful fallback with loading indicator
- **Missing Data**: Silently handles users without location data

## Accessibility Considerations
- **Keyboard Navigation**: Close button accessible via keyboard
- **Screen Reader**: Semantic HTML structure
- **Visual Feedback**: Clear loading states and error indicators

## Browser Compatibility
- **Mapbox GL JS**: Requires WebGL support
- **Modern Features**: Uses ES6+ features (async/await, destructuring)
- **Responsive Design**: Works across different screen sizes

## Future Enhancements
1. **Real Geocoding**: Replace city lookup with proper geocoding API
2. **Heat Map Visualization**: Alternative view for high-density areas
3. **Time-based Filtering**: Show users by specific time periods
4. **Export Functionality**: Allow screenshot or data export
5. **Mobile Gestures**: Touch-based rotation and zoom on mobile devices
