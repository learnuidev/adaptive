export interface DocItem {
  title: string;
  description: string;
  content: string;
}

export interface DocCategory {
  category: string;
  items: DocItem[];
}

export const documentation: DocCategory[] = [
  {
    category: "Get Started",
    items: [
      {
        title: "Quick Start Guide",
        description: "Get started with Adaptive analytics in minutes",
        content: `# Quick Start Guide

Welcome to Adaptive! Get your analytics up and running in just a few minutes.

## Installation

Add the Adaptive tracking script to your website:

\`\`\`html
<script
  defer
  data-website-id="your-website-id"
  data-domain="yourdomain.com"
  src="https://adaptive.fyi/tracker.js"
></script>
\`\`\`

## Features

- Real-time analytics
- Feature flags
- User cohorts
- Event tracking
- Revenue attribution

## Next Steps

1. Set up your first feature flag
2. Create user cohorts
3. Track custom events
4. Integrate with your tools`
      },
      {
        title: "Installation",
        description: "Install Adaptive on your website or application",
        content: `# Installation

## Web Installation

Add the tracking script to the \`<head>\` section of your website:

\`\`\`html
<script
  defer
  data-website-id="your-website-id"
  data-domain="yourdomain.com"
  src="https://adaptive.fyi/tracker.js"
></script>
\`\`\`

## Framework-Specific Installation

### React / Next.js

\`\`\`jsx
// Add to your root layout or _app.js
import Script from 'next/script';

export default function Layout({ children }) {
  return (
    <>
      <Script
        src="https://adaptive.fyi/tracker.js"
        data-website-id="your-website-id"
        data-domain="yourdomain.com"
        strategy="afterInteractive"
      />
      {children}
    </>
  );
}
\`\`\`

### Vue.js

\`\`\`javascript
// In your main.js
const script = document.createElement('script');
script.defer = true;
script.setAttribute('data-website-id', 'your-website-id');
script.setAttribute('data-domain', 'yourdomain.com');
script.src = 'https://adaptive.fyi/tracker.js';
document.head.appendChild(script);
\`\`\``
      },
      {
        title: "Track Custom Events",
        description: "Track user actions and custom events",
        content: `# Track Custom Events

Track specific user actions beyond pageviews to understand user behavior.

## Client-Side Tracking

\`\`\`javascript
window?.adaptive("event_name", {
  user_email: "user@example.com",
  custom_property: "value"
});
\`\`\`

## HTML Attributes

Track clicks automatically:

\`\`\`html
<button 
  data-adaptive-event="button_clicked"
  data-adaptive-label="signup">
  Sign Up
</button>
\`\`\`

## Common Events

- \`signup\` - User registration
- \`checkout_initiated\` - Purchase started
- \`feature_used\` - Feature interaction
- \`goal_completed\` - Goal achievement

## Best Practices

- Use lowercase with underscores
- Keep event names consistent
- Add meaningful metadata
- Track key conversion points`
      }
    ]
  },
  {
    category: "Features",
    items: [
      {
        title: "Feature Flags",
        description: "Control feature rollouts and A/B testing",
        content: `# Feature Flags

Feature flags allow you to control feature visibility and perform A/B testing.

## Creating a Feature Flag

1. Navigate to the Features section
2. Click "Add Feature"
3. Define your feature name and description
4. Set rollout rules

## Rollout Rules

Target specific user segments:

- **User attributes**: Email, location, device
- **Percentage rollout**: Gradual feature releases
- **Cohort targeting**: Specific user groups

## Example Use Cases

- **Beta testing**: Roll out to 10% of users
- **Geographic rollout**: Enable for specific countries
- **A/B testing**: Compare feature variants
- **Kill switches**: Disable features instantly

## Best Practices

- Start with small rollouts
- Monitor performance metrics
- Use descriptive names
- Document feature purposes`
      },
      {
        title: "User Cohorts",
        description: "Segment and analyze user groups",
        content: `# User Cohorts

Create and analyze specific user segments for targeted insights.

## Creating Cohorts

Define cohorts based on:

- User behavior
- Demographics
- Event completion
- Custom attributes

## Use Cases

### High-Value Users
Track users who generate the most revenue

### Power Users
Identify users with high engagement

### At-Risk Users
Find users showing declining activity

### New Users
Monitor onboarding success

## Cohort Analysis

- Track retention rates
- Compare conversion metrics
- Analyze feature adoption
- Monitor revenue trends

## Best Practices

- Define clear criteria
- Review regularly
- Combine with feature flags
- Track cohort performance`
      },
      {
        title: "Real-Time Analytics",
        description: "Monitor visitor activity as it happens",
        content: `# Real-Time Analytics

Monitor your website activity in real-time with live visitor tracking.

## Live Visitor Map

See active visitors on an interactive globe:

- **Geographic distribution**: Where visitors are located
- **Active sessions**: Current user count
- **Traffic sources**: How visitors found you
- **Device breakdown**: Desktop vs mobile

## Real-Time Metrics

Track instantly:

- Current visitors
- Pageviews per minute
- Top pages
- Referral sources
- Active events

## Filtering

Apply real-time filters:

- By country/region
- By traffic source
- By device type
- By specific pages

## Use Cases

- Monitor campaign launches
- Track viral content
- Detect traffic spikes
- Identify technical issues`
      }
    ]
  },
  {
    category: "API Reference",
    items: [
      {
        title: "API Introduction",
        description: "Get started with the Adaptive API",
        content: `# API Introduction

The Adaptive API allows you to programmatically access your analytics data and manage resources.

## Authentication

Use API keys from your website settings:

\`\`\`bash
curl https://api.adaptive.fyi/v1/events \\
  -H "Authorization: Bearer YOUR_API_KEY"
\`\`\`

## Base URL

\`\`\`
https://api.adaptive.fyi/v1
\`\`\`

## Rate Limits

- 1000 requests per hour
- 100 requests per minute

## Response Format

All responses are JSON:

\`\`\`json
{
  "success": true,
  "data": {},
  "error": null
}
\`\`\`

## Endpoints

- \`POST /events\` - Track events
- \`GET /analytics\` - Retrieve analytics
- \`GET /cohorts\` - List cohorts
- \`GET /features\` - List features`
      },
      {
        title: "Track Events via API",
        description: "Send custom events from your server",
        content: `# Track Events via API

Send events directly from your server for more reliable tracking.

## Endpoint

\`\`\`
POST https://api.adaptive.fyi/v1/events
\`\`\`

## Request Body

\`\`\`json
{
  "website_id": "your-website-id",
  "visitor_id": "optional-visitor-id",
  "event_name": "purchase_completed",
  "metadata": {
    "email": "user@example.com",
    "amount": 99.99,
    "product_id": "prod_123"
  }
}
\`\`\`

## Example

\`\`\`javascript
const response = await fetch('https://api.adaptive.fyi/v1/events', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    website_id: 'your-website-id',
    event_name: 'purchase_completed',
    metadata: {
      amount: 99.99
    }
  })
});
\`\`\`

## Response

\`\`\`json
{
  "success": true,
  "event_id": "evt_123"
}
\`\`\``
      }
    ]
  }
];
