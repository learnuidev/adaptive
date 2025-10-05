import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CredentialSelector } from "@/components/credentials/credential-selector";
import { NoCredentialsMessage } from "@/components/credentials/no-credentials-message";
import { CodeBlock } from "@/components/ui/code-block";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useListUserCredentialsQuery } from "@/modules/user-credentials/use-list-user-credentials-query";
import { Terminal, Book, ExternalLink, Eye, EyeOff, Info } from "lucide-react";
import { possibleScopes } from "@/modules/user-credentials/use-add-user-credential-mutation";

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────

type SectionHeaderProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
};

type InfoFieldProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

type CodeStepProps = {
  stepNumber: number;
  title: string;
  children: React.ReactNode;
};

type ApiSecretFieldProps = {
  showSecret: boolean;
  onToggle: () => void;
  value: string | undefined;
};

type ScopesDisplayProps = {
  scopes?: string[];
};

type ExternalLinkButtonsProps = {
  onViewDocs?: () => void;
  onViewApiRef?: () => void;
};

type InstallCode = string;
type ProviderCode = string;
type UsageCode = string;

// ──────────────────────────────────────────────────────────────
// CONSTANTS
// ──────────────────────────────────────────────────────────────

const INSTALL_CODE: InstallCode = `npm install adaptive-engine@latest`;

const PROVIDER_CODE: ProviderCode = `import React, { createContext, useContext } from "react";
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

const buildUsageCode = (
  domain: string,
  apiKey: string,
  apiUrl: string
): UsageCode =>
  `import { AdaptiveProvider, useAdaptive } from './lib/adaptive-provider';

// Wrap your app with the provider
function App() {
  return (
    <AdaptiveProvider
      domain="${domain}"
      apiKey="${apiKey}"
      apiUrl="${apiUrl}"
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

// ──────────────────────────────────────────────────────────────
// REUSABLE COMPONENTS
// ──────────────────────────────────────────────────────────────

const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  subtitle,
}) => (
  <div className="flex items-center gap-3 mb-8">
    <div className="p-3 bg-gradient-primary rounded-2xl shadow-emerald">
      {icon}
    </div>
    <div>
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      <p className="text-muted-foreground mt-1">{subtitle}</p>
    </div>
  </div>
);

const InfoField: React.FC<InfoFieldProps> = ({
  label,
  children,
  className = "",
}) => (
  <div className={`group ${className}`}>
    <label className="text-sm font-semibold text-foreground mb-3 block uppercase tracking-wide">
      {label}
    </label>
    <div className="bg-muted/50 rounded-xl px-4 py-3 transition-all duration-200 group-hover:bg-muted/70">
      {children}
    </div>
  </div>
);

const CodeStep: React.FC<CodeStepProps> = ({ stepNumber, title, children }) => (
  <div className="group">
    <label className="text-sm font-semibold text-foreground mb-3 block uppercase tracking-wide">
      Step {stepNumber} – {title}
    </label>
    {children}
  </div>
);

const ApiSecretField: React.FC<ApiSecretFieldProps> = ({
  showSecret,
  onToggle,
  value,
}) => (
  <div className="lg:col-span-2 group">
    <div className="flex items-center gap-3 mb-3">
      <label className="text-sm font-semibold text-foreground uppercase tracking-wide">
        API Secret
      </label>
      <Tooltip delayDuration={100}>
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
        <p className="break-all">
          <code className="text-sm font-mono text-foreground">
            {showSecret
              ? value || "Not configured"
              : "•••••••••••••••••••••••••••••••••••••••"}
          </code>
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="shrink-0 h-12 w-12 rounded-xl hover:bg-primary/5 transition-all duration-200"
      >
        {showSecret ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  </div>
);

const ScopesDisplay: React.FC<ScopesDisplayProps> = ({ scopes }) => (
  <div className="flex flex-wrap gap-2">
    {scopes?.length ? (
      scopes.map((scope) => {
        const scopeItem = possibleScopes?.find((s) => s.value === scope);
        return (
          <Badge
            key={scope}
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
          >
            {scopeItem?.name || scope}
          </Badge>
        );
      })
    ) : (
      <span className="text-sm text-muted-foreground">
        No scopes configured
      </span>
    )}
  </div>
);

const ExternalLinkButtons: React.FC<ExternalLinkButtonsProps> = ({
  onViewDocs,
  onViewApiRef,
}) => (
  <div className="flex gap-3 mt-8 pt-6 border-t border-border/20">
    <Button
      variant="outline"
      size="sm"
      className="rounded-xl hover:bg-primary/5 transition-all duration-200"
      onClick={onViewDocs}
    >
      <ExternalLink className="h-4 w-4 mr-2" />
      View Documentation
    </Button>
    <Button
      variant="outline"
      size="sm"
      className="rounded-xl hover:bg-primary/5 transition-all duration-200"
      onClick={onViewApiRef}
    >
      <ExternalLink className="h-4 w-4 mr-2" />
      API Reference
    </Button>
  </div>
);

// ──────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────

export default function Settings() {
  const params = useParams({ strict: false }) as { credentialId?: string };
  const credentialId = params?.credentialId;
  const { data: credentials } = useListUserCredentialsQuery();
  const [showApiSecret, setShowApiSecret] = useState(false);

  if (!credentialId) return <NoCredentialsMessage />;

  const currentCredential = credentials?.find((c) => c.id === credentialId);
  const usageCode = buildUsageCode(
    currentCredential?.domain || "your-domain.com",
    currentCredential?.apiKey || "your-api-key",
    currentCredential?.urlEndpoint || "https://api.adaptive.fyi"
  );

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
            <div
              className="glass-strong rounded-3xl p-8 animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <SectionHeader
                icon={<Terminal className="h-6 w-6 text-white" />}
                title="Installation & Setup"
                subtitle="Get started with the Adaptive Engine"
              />

              <div className="grid grid-cols-1 gap-6 mb-12">
                <CodeStep stepNumber={1} title="Install Package">
                  <CodeBlock language="bash" code={INSTALL_CODE} />
                </CodeStep>
              </div>

              <div className="grid grid-cols-1 gap-6 mb-12">
                <CodeStep stepNumber={2} title="Provider File">
                  <CodeBlock
                    title="lib/adaptive-provider.tsx"
                    language="typescript"
                    code={PROVIDER_CODE}
                  />
                </CodeStep>
              </div>

              <div className="grid grid-cols-1 gap-6 mb-12">
                <CodeStep stepNumber={3} title="Usage Example">
                  <CodeBlock
                    title="Example Usage"
                    language="typescript"
                    code={usageCode}
                  />
                </CodeStep>
              </div>

              <ExternalLinkButtons />
            </div>

            {/* API Configuration Section */}
            <div
              className="glass-strong rounded-3xl p-8 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <SectionHeader
                icon={<Book className="h-6 w-6 text-white" />}
                title="API Configuration"
                subtitle="Your API endpoint and authentication details"
              />

              <div className="grid grid-cols-1 gap-6">
                <InfoField label="Domain">
                  <code className="text-sm font-mono text-foreground">
                    {currentCredential?.domain || "Not configured"}
                  </code>
                </InfoField>

                <InfoField label="API URL">
                  <code className="text-sm font-mono text-foreground">
                    {currentCredential?.urlEndpoint || "Not configured"}
                  </code>
                </InfoField>

                <ApiSecretField
                  showSecret={showApiSecret}
                  onToggle={() => setShowApiSecret((s) => !s)}
                  value={currentCredential?.apiSecret}
                />
              </div>
            </div>

            {/* Credential Details Section */}
            <div
              className="glass-strong rounded-3xl p-8 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Credential Details
                </h2>
                <p className="text-muted-foreground">
                  Information about your current credential configuration
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Title">
                  <p className="text-sm text-foreground font-medium">
                    {currentCredential?.title || "Unknown"}
                  </p>
                </InfoField>

                <InfoField label="Description">
                  <p className="text-sm text-muted-foreground">
                    {currentCredential?.description ||
                      "No description provided"}
                  </p>
                </InfoField>

                <InfoField label="Scopes" className="md:col-span-2">
                  <ScopesDisplay scopes={currentCredential?.scopes} />
                </InfoField>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

const newWebsite = {
  websiteId: "68d852dc00505c5494663311",
  domain: "www.mandarino.io",
};

const updatedWebsite = {
  websiteId: "68d852dc00505c5494663311",
  domain: "www.mandarino.io",
};
