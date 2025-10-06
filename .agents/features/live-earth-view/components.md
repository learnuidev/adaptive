# Components

## Main Component

### LiveUsersGlobe
**Location**: `src/components/dashboard/live-users-globe.tsx`

**Props**:
```typescript
interface LiveUsersGlobeProps {
  websiteId: string;
  isOpen: boolean;
  onClose: () => void;
}
```

**Key Features**:
- Full-screen modal with backdrop blur
- 3D rotating globe using Mapbox GL JS
- Real-time user location clustering
- Interactive popups with user details
- Automatic rotation animation
- Responsive design

## Component Structure

### Header Section
- Live user count with pulsing indicator
- Close button functionality
- Glass morphism styling

### Map Container
- Mapbox GL JS integration
- Dark theme with atmosphere effects
- 3D globe projection
- User location markers

### Legend
- Bottom-left positioned overlay
- Activity indicators
- Size mapping explanation

## Mapbox Configuration

### Globe Setup
```typescript
new mapboxgl.Map({
  container: mapContainer.current,
  style: "mapbox://styles/mapbox/dark-v11",
  projection: "globe",
  center: [0, 0],
  zoom: 1.5,
  pitch: 0,
  bearing: 0,
});
```

### Atmosphere Effects
```typescript
mapInstance.setFog({
  "horizon-blend": 0.1,
  color: "#242B4B",
  "high-color": "#161B3D",
  "space-color": "#0B0E1F",
  "star-intensity": 0.15,
});
```

### User Location Layer
```typescript
mapInstance.addLayer({
  id: "users-layer",
  type: "circle",
  source: "users-source",
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["get", "userCount"],
      1, 5,
      10, 15,
      50, 25,
    ],
    "circle-color": "#00ff88",
    "circle-opacity": 0.8,
    "circle-stroke-color": "#ffffff",
    "circle-stroke-width": 2,
  },
});
```

## Interactive Features

### Click Popups
- Shows city, country, and user count
- Displays individual user details (up to 3)
- Includes current page and session duration
- Responsive popup positioning

### Hover Effects
- Cursor changes on marker hover
- Visual feedback for interactive elements

### Rotation Animation
- Continuous 0.1 degree rotation every 50ms
- Smooth transition effects
- Automatic cleanup on unmount

## Usage in Dashboard
**Location**: `src/pages/dashboard.tsx`

```typescript
<LiveUsersGlobe 
  websiteId={websiteId}
  isOpen={showGlobe}
  onClose={() => setShowGlobe(false)}
/>
```
