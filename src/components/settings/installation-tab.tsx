import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Book, ExternalLink, Terminal } from "lucide-react";
import { NoWebsiteMessage } from "@/components/websites/no-website-message";
import { CredentialSelector } from "@/components/websites/website-selector";
import { useListUserWebsitesQuery } from "@/modules/user-websites/use-list-user-websites-query";
import { useParams } from "@tanstack/react-router";

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────

type SectionHeaderProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
};

type CodeStepProps = {
  stepNumber: number;
  title: string;
  children: React.ReactNode;
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

const INSTALL_CODE: InstallCode = `npm install adaptive_engine@latest`;

const PROVIDER_CODE: ProviderCode = `import React, { createContext, useContext } from "react";
import { adaptive, IAdaptive, IAdaptiveInput } from "adaptive_engine";

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

const CodeStep: React.FC<CodeStepProps> = ({ stepNumber, title, children }) => (
  <div className="group">
    <label className="text-sm font-semibold text-foreground mb-3 block uppercase tracking-wide">
      Step {stepNumber} – {title}
    </label>
    {children}
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

export const InstallationTab: React.FC = () => {
  const params = useParams({ strict: false }) as { websiteId?: string };
  const websiteId = params?.websiteId;
  const { data: websites } = useListUserWebsitesQuery();

  if (!websiteId) {
    return <NoWebsiteMessage />;
  }

  const currentWebsite = websites?.find((c) => c.id === websiteId);
  const usageCode = buildUsageCode(
    currentWebsite?.domain || "your-domain.com",
    currentWebsite?.apiKey || "your-api-key",
    currentWebsite?.urlEndpoint || "https://api.adaptive.fyi"
  );

  return (
    <TooltipProvider>
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
            <div className="group">
              <label className="text-sm font-semibold text-foreground mb-3 block uppercase tracking-wide">
                Domain
              </label>
              <div className="bg-muted/50 rounded-xl px-4 py-3 transition-all duration-200 group-hover:bg-muted/70">
                <code className="text-sm font-mono text-foreground">
                  {currentWebsite?.domain || "Not configured"}
                </code>
              </div>
            </div>

            <div className="group">
              <label className="text-sm font-semibold text-foreground mb-3 block uppercase tracking-wide">
                API URL
              </label>
              <div className="bg-muted/50 rounded-xl px-4 py-3 transition-all duration-200 group-hover:bg-muted/70">
                <code className="text-sm font-mono text-foreground">
                  {currentWebsite?.urlEndpoint || "Not configured"}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
