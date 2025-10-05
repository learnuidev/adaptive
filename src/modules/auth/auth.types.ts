import { z } from "zod";

// Authentication schemas
export const loginCredentialsSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;

export const signUpCredentialsSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export type SignUpCredentials = z.infer<typeof signUpCredentialsSchema>;

export const confirmRegistrationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  confirmationCode: z.string().min(1, "Confirmation code is required"),
});

export type ConfirmRegistration = z.infer<typeof confirmRegistrationSchema>;

// User profile types
export const userProfileSchema = z.object({
  sub: z.string(), // User ID
  email: z.string().email(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  email_verified: z.boolean().optional(),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  birthdate: z.string().optional(),
  gender: z.string().optional(),
  locale: z.string().optional(),
  middle_name: z.string().optional(),
  nickname: z.string().optional(),
  preferred_username: z.string().optional(),
  picture: z.string().optional(),
  profile: z.string().optional(),
  website: z.string().optional(),
  zoneinfo: z.string().optional(),
  updated_at: z.number().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// Authentication response types
export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: any;
}

export interface LoginResponse extends AuthResponse {
  requiresConfirmation?: boolean;
}

// Session types
export interface Session {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Error types
export interface LoginError {
  message: string;
  code?: string;
  type: 'invalid_credentials' | 'user_not_found' | 'user_not_confirmed' | 'too_many_attempts' | 'network' | 'unknown';
}
