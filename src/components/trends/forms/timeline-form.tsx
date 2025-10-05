import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Clock, Check } from "lucide-react";
import { MetadataTimelineForm, TIME_RANGE_OPTIONS, GROUP_BY_TIME_OPTIONS } from "@/modules/trends/trends.types";

interface TimelineFormProps {
  onSubmit: (data: MetadataTimelineForm) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const steps = [
  { id: "field", title: "Metadata Field", subtitle: "What field do you want to track?" },
  { id: "value", title: "Metadata Value", subtitle: "What specific value to analyze?" },
  { id: "time", title: "Time Range", subtitle: "What time period to analyze?" },
  { id: "group", title: "Time Grouping", subtitle: "How to group the timeline?" },
  { id: "review", title: "Review", subtitle: "Confirm your settings" },
];

export const TimelineForm = ({ onSubmit, onCancel, isLoading }: TimelineFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<MetadataTimelineForm>({
    metadataField: "",
    metadataValue: "",
    timeRange: "30d",
    groupByTime: "day",
  });

  const updateField = (field: keyof MetadataTimelineForm, value: any) => {
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
      case 1: return formData.metadataValue.trim() !== "";
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
              Enter the metadata field you want to create a timeline for
            </p>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <Input
              placeholder="e.g., specific content ID or category name"
              value={formData.metadataValue}
              onChange={(e) => updateField("metadataValue", e.target.value)}
              className="text-lg p-6 text-center"
              autoFocus
            />
            <p className="text-sm text-muted-foreground text-center">
              Enter the specific value to track over time
            </p>
          </div>
        );

      case 2:
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

      case 3:
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

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-muted/30 rounded-lg p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metadata Field:</span>
                <span className="font-medium">{formData.metadataField}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metadata Value:</span>
                <span className="font-medium">{formData.metadataValue}</span>
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
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Metadata Timeline</h2>
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
            {isLoading ? "Creating..." : "Create Timeline"}
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