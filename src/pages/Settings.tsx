import { useParams } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CredentialSelector } from "@/components/credentials/CredentialSelector";
import { NoCredentialsMessage } from "@/components/credentials/NoCredentialsMessage";
import { CodeBlock } from "@/components/ui/code-block";
import { useListUserCredentialsQuery } from "@/modules/user-credentials/use-list-user-credentials-query";
import { Terminal, Book, ExternalLink } from "lucide-react";

export default function Settings() {
  // Use strict: false to handle cases where params might not exist
  const params = useParams({ strict: false }) as { credentialId?: string };
  const credentialId = params?.credentialId;
  const { data: credentials } = useListUserCredentialsQuery();

  if (!credentialId) {
    return <NoCredentialsMessage />;
  }

  const currentCredential = credentials?.find(c => c.id === credentialId);

  const installCode = `npm install adaptive-engine@latest`;

  const providerCode = `import React, { createContext, useContext } from "react";
import { adaptive, IAdaptive, IAdaptiveInput } from "adaptive-engine";

export const AdaptiveContext = createContext<IAdaptive | undefined>(undefined);

export const useAdaptive = () => {
  const context = useContext(AdaptiveContext);
  if (!context) {
    throw new Error("useAdaptive must be used within an AdaptiveProvider");
  }
  return context;
};

export const AdaptiveProvider = ({
  children,
  domain,
  apiKey,
  apiUrl,
  identity,
}: { children: React.ReactNode } & IAdaptiveInput) => {
  const adaptiveInstance = adaptive({
    apiKey,
    apiUrl,
    domain,
    identity,
  });

  if (!adaptiveInstance) {
    throw new Error("AdaptiveProvider: Failed to initialize adaptive");
  }

  return (
    <AdaptiveContext.Provider value={adaptiveInstance}>
      {children}
    </AdaptiveContext.Provider>
  );
};`;

  const usageCode = `import { AdaptiveProvider, useAdaptive } from './lib/adaptive-provider';

// Wrap your app with the provider
function App() {
  return (
    <AdaptiveProvider
      domain="${currentCredential?.domain || 'your-domain.com'}"
      apiKey="your-api-key"
      apiUrl="https://api.adaptive.fyi"
      identity={{ email: "user@example.com" }}
    >
      <YourAppComponents />
    </AdaptiveProvider>
  );
}

// Use the hook in your components
function MyComponent() {
  const adaptive = useAdaptive();
  
  // Now you can use adaptive features
  const handleAnalytics = () => {
    adaptive.track('user_action', { action: 'button_click' });
  };

  return <button onClick={handleAnalytics}>Track Event</button>;
}`;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <CredentialSelector />
      </div>

      <div className="grid gap-6">
        {/* Installation Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Installation & Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">1. Install Adaptive Engine</h3>
              <p className="text-muted-foreground mb-3">
                First, install the adaptive-engine package in your project:
              </p>
              <CodeBlock
                language="bash"
                code={installCode}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">2. Create the Adaptive Provider</h3>
              <p className="text-muted-foreground mb-3">
                Create a provider component to wrap your application:
              </p>
              <CodeBlock
                title="lib/adaptive-provider.tsx"
                language="typescript"
                code={providerCode}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">3. Use in Your Application</h3>
              <p className="text-muted-foreground mb-3">
                Wrap your app with the provider and use the hook in your components:
              </p>
              <CodeBlock
                title="Example Usage"
                language="typescript"
                code={usageCode}
              />
            </div>
          </CardContent>
        </Card>

        {/* API Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              API Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Domain</label>
                <code className="block mt-1 p-2 bg-muted rounded text-sm">
                  {currentCredential?.domain || 'Not configured'}
                </code>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">API URL</label>
                <code className="block mt-1 p-2 bg-muted rounded text-sm">
                  https://api.adaptive.fyi
                </code>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Documentation
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                API Reference
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Credential Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Credential Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Title</label>
                <p className="mt-1">{currentCredential?.title || 'Unknown'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1 text-muted-foreground">
                  {currentCredential?.description || 'No description provided'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Scopes</label>
                <div className="mt-1 flex gap-2">
                  {currentCredential?.scopes?.map((scope) => (
                    <Badge key={scope} variant="secondary">
                      {scope}
                    </Badge>
                  )) || <span className="text-muted-foreground">No scopes</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}