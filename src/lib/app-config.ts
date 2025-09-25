import { z } from "zod";
const appConfigSchema = z.object({
  cognitoUserPoolId: z.string().min(1, "Cognito User Pool ID is required"),
  cognitoClientId: z.string().min(1, "Cognito Client ID is required"),
  graphqlEndpoint: z.string().url("GraphQL endpoint must be a valid URL"),
  graphqlRegion: z.string().min(1, "AWS region is required"),
});

export const appConfig = appConfigSchema.parse({
  cognitoUserPoolId: import.meta.env.VITE_AWS_COGNITO_USERPOOL_ID || "",
  cognitoClientId: import.meta.env.VITE_AWS_COGNITO_WEBCLIENT_ID || "",
  graphqlEndpoint: import.meta.env.VITE_AWS_APPSYNC_GRAPHQL_ENDPOINT || "",
  graphqlRegion: import.meta.env.VITE_AWS_REGION || "",
});

// Export the type inferred from the schema
export type AppConfig = z.infer<typeof appConfigSchema>;
