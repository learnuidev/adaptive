import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CredentialSelector } from "@/components/credentials/CredentialSelector";
import { NoCredentialsMessage } from "@/components/credentials/NoCredentialsMessage";
import { CodeBlock } from "@/components/ui/code-block";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useListUserCredentialsQuery } from "@/modules/user-credentials/use-list-user-credentials-query";
import { Terminal, Book, ExternalLink, Eye, EyeOff, Info } from "lucide-react";

export default function Settings() {
  // Use strict: false to handle cases where params might not exist
  const params = useParams({ strict: false }) as { credentialId?: string };
  const credentialId = params?.credentialId;
  const { data: credentials } = useListUserCredentialsQuery();
  const [showApiSecret, setShowApiSecret] = useState(false);

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
      apiKey="${currentCredential?.apiKey || 'your-api-key'}"
      apiUrl="${currentCredential?.urlEndpoint || 'https://api.adaptive.fyi'}"
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
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          {/* Header */}
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-2">
                  Settings
                </h1>
                <p className="text-lg text-muted-foreground">
                  Configure your API integration and manage credentials
                </p>
              </div>
              <div className="glass p-1 rounded-2xl">
                <CredentialSelector />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Installation Section */}
            <div className="glass-strong rounded-3xl p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-primary rounded-2xl shadow-emerald">
                  <Terminal className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Installation & Setup</h2>
                  <p className="text-muted-foreground mt-1">Get started with the Adaptive Engine</p>
                </div>
              </div>

              <div className="space-y-10">
                {/* Step 1 */}
                <div className="group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                      1
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Install Adaptive Engine</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 ml-12">
                    Add the adaptive-engine package to your project
                  </p>
                  <div className="ml-12">
                    <div className="bg-muted/50 rounded-xl p-6 transition-all duration-200 group-hover:bg-muted/70">
                      <CodeBlock
                        language="bash"
                        code={installCode}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                      2
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Create the Adaptive Provider</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 ml-12">
                    Set up the provider component to wrap your application
                  </p>
                  <div className="ml-12">
                    <div className="bg-muted/50 rounded-xl p-6 transition-all duration-200 group-hover:bg-muted/70">
                      <CodeBlock
                        title="lib/adaptive-provider.tsx"
                        language="typescript"
                        code={providerCode}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                      3
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Use in Your Application</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 ml-12">
                    Implement the provider and hook in your components
                  </p>
                  <div className="ml-12">
                    <div className="bg-muted/50 rounded-xl p-6 transition-all duration-200 group-hover:bg-muted/70">
                      <CodeBlock
                        title="Example Usage"
                        language="typescript"
                        code={usageCode}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* API Configuration Section */}
            <div className="glass-strong rounded-3xl p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-primary rounded-2xl shadow-emerald">
                  <Book className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">API Configuration</h2>
                  <p className="text-muted-foreground mt-1">Your API endpoint and authentication details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Domain */}
                <div className="group">
                  <label className="text-sm font-semibold text-foreground mb-3 block uppercase tracking-wide">
                    Domain
                  </label>
                  <div className="bg-muted/50 rounded-xl px-4 py-3 transition-all duration-200 group-hover:bg-muted/70">
                    <code className="text-sm font-mono text-foreground">
                      {currentCredential?.domain || 'Not configured'}
                    </code>
                  </div>
                </div>

                {/* API URL */}
                <div className="group">
                  <label className="text-sm font-semibold text-foreground mb-3 block uppercase tracking-wide">
                    API URL
                  </label>
                  <div className="bg-muted/50 rounded-xl px-4 py-3 transition-all duration-200 group-hover:bg-muted/70">
                    <code className="text-sm font-mono text-foreground">
                      {currentCredential?.urlEndpoint || 'Not configured'}
                    </code>
                  </div>
                </div>

                {/* API Secret */}
                <div className="lg:col-span-2 group">
                  <div className="flex items-center gap-3 mb-3">
                    <label className="text-sm font-semibold text-foreground uppercase tracking-wide">
                      API Secret
                    </label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="p-1 rounded-full hover:bg-muted/50 transition-colors cursor-help">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>With this you can make API calls but do keep it secret</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-muted/50 rounded-xl px-4 py-3 flex-1 transition-all duration-200 group-hover:bg-muted/70">
                      <code className="text-sm font-mono text-foreground">
                        {showApiSecret 
                          ? currentCredential?.apiSecret || 'Not configured'
                          : '••••••••••••••••••••••••••••••••••••••••••••••••••••'
                        }
                      </code>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiSecret(!showApiSecret)}
                      className="shrink-0 h-12 w-12 rounded-xl hover:bg-primary/5 transition-all duration-200"
                    >
                      {showApiSecret ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8 pt-6 border-t border-border/20">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-xl hover:bg-primary/5 transition-all duration-200"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Documentation
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-xl hover:bg-primary/5 transition-all duration-200"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  API Reference
                </Button>
              </div>
            </div>

            {/* Credential Details Section */}
            <div className="glass-strong rounded-3xl p-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-2">Credential Details</h2>
                <p className="text-muted-foreground">Information about your current credential configuration</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="group">
                  <label className="text-sm font-semibold text-foreground mb-3 block uppercase tracking-wide">
                    Title
                  </label>
                  <div className="bg-muted/50 rounded-xl px-4 py-3 transition-all duration-200 group-hover:bg-muted/70">
                    <p className="text-sm text-foreground font-medium">
                      {currentCredential?.title || 'Unknown'}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="group">
                  <label className="text-sm font-semibold text-foreground mb-3 block uppercase tracking-wide">
                    Description
                  </label>
                  <div className="bg-muted/50 rounded-xl px-4 py-3 transition-all duration-200 group-hover:bg-muted/70">
                    <p className="text-sm text-muted-foreground">
                      {currentCredential?.description || 'No description provided'}
                    </p>
                  </div>
                </div>

                {/* Scopes */}
                <div className="md:col-span-2 group">
                  <label className="text-sm font-semibold text-foreground mb-3 block uppercase tracking-wide">
                    Scopes
                  </label>
                  <div className="bg-muted/50 rounded-xl px-4 py-3 transition-all duration-200 group-hover:bg-muted/70">
                    <div className="flex flex-wrap gap-2">
                      {currentCredential?.scopes?.length ? (
                        currentCredential.scopes.map((scope) => (
                          <Badge 
                            key={scope} 
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
                          >
                            {scope}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No scopes configured</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}