import { z } from "zod";
const appConfigSchema = z.object({
  cognitoUserPoolId: z.string().min(1, "Cognito User Pool ID is required"),
  cognitoClientId: z.string().min(1, "Cognito Client ID is required"),
  apiUrl: z.string().min(1, "API URL is required"),
});

export const appConfig = appConfigSchema.parse({
  cognitoUserPoolId: import.meta.env.VITE_AWS_COGNITO_USERPOOL_ID || "",
  cognitoClientId: import.meta.env.VITE_AWS_COGNITO_WEBCLIENT_ID || "",

  apiUrl: import.meta.env.VITE_API_URL || "",
});

// Export the type inferred from the schema
export type AppConfig = z.infer<typeof appConfigSchema>;
