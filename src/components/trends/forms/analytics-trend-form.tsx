import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, BarChart3, Check } from "lucide-react";
import { 
  AnalyticsMetadataTrendForm, 
  TREND_TYPE_OPTIONS, 
  TIME_RANGE_OPTIONS, 
  GROUP_BY_TIME_OPTIONS 
} from "@/modules/trends/trends.types";

interface AnalyticsTrendFormProps {
  onSubmit: (data: AnalyticsMetadataTrendForm) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const steps = [
  { id: "field", title: "Metadata Field", subtitle: "What field do you want to analyze?" },
  { id: "event", title: "Event Type", subtitle: "Filter by specific events (optional)" },
  { id: "trend", title: "Trend Type", subtitle: "How do you want to measure the trend?" },
  { id: "time", title: "Time Range", subtitle: "What time period to analyze?" },
  { id: "group", title: "Time Grouping", subtitle: "How to group the time periods?" },
  { id: "limit", title: "Result Limit", subtitle: "How many results to show?" },
  { id: "review", title: "Review", subtitle: "Confirm your settings" },
];

export const AnalyticsTrendForm = ({ onSubmit, onCancel, isLoading }: AnalyticsTrendFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<AnalyticsMetadataTrendForm>({
    metadataField: "",
    trendType: "count",
    timeRange: "7d",
    eventType: "",
    groupByTime: "day",
    limit: 50,
  });

  const updateField = (field: keyof AnalyticsMetadataTrendForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canContinue = () => {
    switch (currentStep) {
      case 0: return formData.metadataField.trim() !== "";
      default: return true;
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Input
              placeholder="e.g., contentid, category, userId"
              value={formData.metadataField}
              onChange={(e) => updateField("metadataField", e.target.value)}
              className="text-lg p-6 text-center"
              autoFocus
            />
            <p className="text-sm text-muted-foreground text-center">
              Enter the metadata field you want to analyze trends for
            </p>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <Input
              placeholder="e.g., pageview, click, purchase (leave empty for all events)"
              value={formData.eventType}
              onChange={(e) => updateField("eventType", e.target.value)}
              className="text-lg p-6 text-center"
              autoFocus
            />
            <p className="text-sm text-muted-foreground text-center">
              Optionally filter by a specific event type
            </p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Select 
              value={formData.trendType} 
              onValueChange={(value) => updateField("trendType", value)}
            >
              <SelectTrigger className="text-lg p-6">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TREND_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="p-4">
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Select 
              value={formData.timeRange} 
              onValueChange={(value) => updateField("timeRange", value)}
            >
              <SelectTrigger className="text-lg p-6">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_RANGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="p-3">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Select 
              value={formData.groupByTime} 
              onValueChange={(value) => updateField("groupByTime", value)}
            >
              <SelectTrigger className="text-lg p-6">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GROUP_BY_TIME_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="p-3">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Input
              type="number"
              min={1}
              max={1000}
              placeholder="50"
              value={formData.limit}
              onChange={(e) => updateField("limit", parseInt(e.target.value) || 50)}
              className="text-lg p-6 text-center"
              autoFocus
            />
            <p className="text-sm text-muted-foreground text-center">
              Maximum number of results (1-1000)
            </p>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-muted/30 rounded-lg p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metadata Field:</span>
                <span className="font-medium">{formData.metadataField}</span>
              </div>
              {formData.eventType && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event Type:</span>
                  <span className="font-medium">{formData.eventType}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trend Type:</span>
                <span className="font-medium">
                  {TREND_TYPE_OPTIONS.find(o => o.value === formData.trendType)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Range:</span>
                <span className="font-medium">
                  {TIME_RANGE_OPTIONS.find(o => o.value === formData.timeRange)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Group By:</span>
                <span className="font-medium">
                  {GROUP_BY_TIME_OPTIONS.find(o => o.value === formData.groupByTime)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Result Limit:</span>
                <span className="font-medium">{formData.limit}</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Analytics Metadata Trend</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Step */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-center mb-2">
          {steps[currentStep].title}
        </h3>
        <p className="text-muted-foreground text-center mb-6">
          {steps[currentStep].subtitle}
        </p>
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={currentStep === 0 ? onCancel : prevStep}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {currentStep === 0 ? "Cancel" : "Back"}
        </Button>

        {currentStep === steps.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            {isLoading ? "Creating..." : "Create Trend"}
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={!canContinue()}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};