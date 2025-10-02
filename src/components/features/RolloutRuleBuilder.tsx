import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Info } from "lucide-react";
import { useListMetadatasByWebsiteIdQuery } from "@/modules/analytics/list-metadatas-by-website-id.query";
import { useListAttributeValuesByAttributeKeyQuery } from "@/modules/analytics/list-attribute-values.query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RolloutRuleGroup } from "@/pages/AddFeatureVersion";
import { MultiSelectWithInput } from "@/components/ui/multi-select-with-input";

interface RolloutRuleBuilderProps {
  rules: RolloutRuleGroup[];
  onChange: (rules: RolloutRuleGroup[]) => void;
  websiteId: string;
}

const OPERATORS = [
  { value: "=", label: "Equals (=)" },
  { value: "!=", label: "Not Equals (!=)" },
  { value: ">", label: "Greater Than (>)" },
  { value: "<", label: "Less Than (<)" },
  { value: ">=", label: "Greater or Equal (>=)" },
  { value: "<=", label: "Less or Equal (<=)" },
  { value: "LIKE", label: "Like (LIKE)" },
  { value: "NOT LIKE", label: "Not Like (NOT LIKE)" },
  { value: "IN", label: "In (IN)" },
  { value: "NOT IN", label: "Not In (NOT IN)" },
];

const EVENT_FIELDS = [
  "event_name",
  "type",
  "country",
  "region",
  "city",
  "os_name",
  "os_version",
  "browser_name",
  "browser_version",
  "device_vendor",
  "device_model",
  "email",
  "domain",
  "href",
];

export function RolloutRuleBuilder({
  rules,
  onChange,
  websiteId,
}: RolloutRuleBuilderProps) {
  const { data: metadatas } = useListMetadatasByWebsiteIdQuery({ websiteId });

  const addRuleGroup = () => {
    onChange([
      ...rules,
      {
        type: "and",
        fields: [{ field: "event_name", op: "=", value: "" }],
      },
    ]);
  };

  const removeRuleGroup = (groupIndex: number) => {
    onChange(rules.filter((_, i) => i !== groupIndex));
  };

  const updateRuleGroupType = (groupIndex: number, type: "and" | "or") => {
    const newRules = [...rules];
    newRules[groupIndex].type = type;
    onChange(newRules);
  };

  const addFieldToGroup = (groupIndex: number) => {
    const newRules = [...rules];
    newRules[groupIndex].fields.push({
      field: "event_name",
      op: "=",
      value: "",
    });
    onChange(newRules);
  };

  const removeFieldFromGroup = (groupIndex: number, fieldIndex: number) => {
    const newRules = [...rules];
    newRules[groupIndex].fields = newRules[groupIndex].fields.filter(
      (_, i) => i !== fieldIndex
    );
    onChange(newRules);
  };

  const updateField = (
    groupIndex: number,
    fieldIndex: number,
    key: "field" | "op" | "value",
    value: string | string[]
  ) => {
    const newRules = [...rules];
    newRules[groupIndex].fields[fieldIndex][key] = value as any;
    onChange(newRules);
  };

  const updateFieldAttribute = (
    groupIndex: number,
    fieldIndex: number,
    field: string
  ) => {
    const newRules = [...rules];
    newRules[groupIndex].fields[fieldIndex].field = field;
    // Reset value when field changes
    newRules[groupIndex].fields[fieldIndex].value = "";
    onChange(newRules);
  };

  const allFields = [
    ...EVENT_FIELDS,
    ...(metadatas?.map((m) => `metadata.${m.key}`) || []),
  ];

  return (
    <div className="space-y-3">
      {rules.map((group, groupIndex) => (
        <Card key={groupIndex} className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                Rule Group {groupIndex + 1}
              </span>
              <Select
                value={group.type}
                onValueChange={(value: "and" | "or") =>
                  updateRuleGroupType(groupIndex, value)
                }
              >
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="and">AND</SelectItem>
                  <SelectItem value="or">OR</SelectItem>
                </SelectContent>
              </Select>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {group.type === "and"
                        ? "All conditions must be true"
                        : "Any condition can be true"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeRuleGroup(groupIndex)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Fields */}
          <div className="space-y-2 pl-4 border-l-2 border-border">
            {group.fields.map((field, fieldIndex) => (
              <FieldRow
                key={fieldIndex}
                field={field}
                groupIndex={groupIndex}
                fieldIndex={fieldIndex}
                websiteId={websiteId}
                allFields={allFields}
                metadatas={metadatas || []}
                onUpdateField={updateField}
                onUpdateFieldAttribute={updateFieldAttribute}
                onRemove={() => removeFieldFromGroup(groupIndex, fieldIndex)}
                disabled={group.fields.length === 1}
              />
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => addFieldToGroup(groupIndex)}
              className="mt-2"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Condition
            </Button>
          </div>
        </Card>
      ))}

      <Button variant="outline" onClick={addRuleGroup} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Rule Group
      </Button>
    </div>
  );
}

interface FieldRowProps {
  field: { field: string; op: string; value: string | string[] };
  groupIndex: number;
  fieldIndex: number;
  websiteId: string;
  allFields: string[];
  metadatas: Array<{ key: string }>;
  onUpdateField: (
    groupIndex: number,
    fieldIndex: number,
    key: "field" | "op" | "value",
    value: string | string[]
  ) => void;
  onUpdateFieldAttribute: (
    groupIndex: number,
    fieldIndex: number,
    field: string
  ) => void;
  onRemove: () => void;
  disabled: boolean;
}

function FieldRow({
  field,
  groupIndex,
  fieldIndex,
  websiteId,
  metadatas,
  onUpdateField,
  onUpdateFieldAttribute,
  onRemove,
  disabled,
}: FieldRowProps) {
  const [attributeKey, setAttributeKey] = useState<string>("");

  // Extract attribute key from field
  useEffect(() => {
    if (field.field) {
      setAttributeKey(field.field);
    }
  }, [field.field]);

  const { data: attributeValues, isLoading: isLoadingValues } =
    useListAttributeValuesByAttributeKeyQuery({
      websiteId,
      attributeKey,
    });

  // Convert value to array format for multi-select
  const valueArray = Array.isArray(field.value)
    ? field.value
    : field.value
    ? [field.value]
    : [];

  const handleValueChange = (values: string[]) => {
    // Store as comma-separated string or array based on operator
    if (field.op === "IN" || field.op === "NOT IN") {
      onUpdateField(groupIndex, fieldIndex, "value", values);
    } else {
      onUpdateField(groupIndex, fieldIndex, "value", values.join(", "));
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Field */}
      <Select
        value={field.field}
        onValueChange={(value) =>
          onUpdateFieldAttribute(groupIndex, fieldIndex, value)
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-popover z-50">
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Event Fields
          </div>
          {EVENT_FIELDS.map((f) => (
            <SelectItem key={f} value={f}>
              {f}
            </SelectItem>
          ))}
          {metadatas && metadatas.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1">
                Metadata Fields
              </div>
              {metadatas.map((m) => (
                <SelectItem key={m.key} value={`metadata.${m.key}`}>
                  metadata.{m.key}
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>

      {/* Operator */}
      <Select
        value={field.op}
        onValueChange={(value) => onUpdateField(groupIndex, fieldIndex, "op", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-popover z-50">
          {OPERATORS.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Value - Multi-select with custom input */}
      <div className="flex-1">
        <MultiSelectWithInput
          values={valueArray}
          onChange={handleValueChange}
          options={attributeValues || []}
          placeholder="Select or type values..."
          isLoading={isLoadingValues}
        />
      </div>

      {/* Remove field */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={disabled}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
