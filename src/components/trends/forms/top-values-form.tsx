import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, List, Check } from "lucide-react";
import { TopMetadataValuesForm, TIME_RANGE_OPTIONS } from "@/modules/trends/trends.types";

interface TopValuesFormProps {
  onSubmit: (data: TopMetadataValuesForm) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const steps = [
  { id: "field", title: "Metadata Field", subtitle: "What field do you want to analyze?" },
  { id: "count", title: "Number of Values", subtitle: "How many top values to show?" },
  { id: "time", title: "Time Range", subtitle: "What time period to analyze?" },
  { id: "review", title: "Review", subtitle: "Confirm your settings" },
];

export const TopValuesForm = ({ onSubmit, onCancel, isLoading }: TopValuesFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<TopMetadataValuesForm>({
    metadataField: "",
    topN: 10,
    timeRange: "7d",
  });

  const updateField = (field: keyof TopMetadataValuesForm, value: any) => {
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
              Enter the metadata field to find top values for
            </p>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <Input
              type="number"
              min={1}
              max={100}
              placeholder="10"
              value={formData.topN}
              onChange={(e) => updateField("topN", parseInt(e.target.value) || 10)}
              className="text-lg p-6 text-center"
              autoFocus
            />
            <p className="text-sm text-muted-foreground text-center">
              How many top values to return (1-100)
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
          <div className="space-y-6">
            <div className="bg-muted/30 rounded-lg p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metadata Field:</span>
                <span className="font-medium">{formData.metadataField}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Top Values Count:</span>
                <span className="font-medium">{formData.topN}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Range:</span>
                <span className="font-medium">
                  {TIME_RANGE_OPTIONS.find(o => o.value === formData.timeRange)?.label}
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
          <List className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Top N Metadata Values</h2>
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