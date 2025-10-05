import { signIn } from "@/lib/aws-smplify/amplify-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAuthenticatedQueryKey } from "./use-is-authenticated.query";
import { loginCredentialsSchema, LoginCredentials, LoginError } from "./auth.types";
import { AuthError } from "aws-amplify/auth";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, LoginError, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      // Validate input against schema before API call
      loginCredentialsSchema.parse(credentials);
      
      try {
        await signIn({
          username: credentials.email,
          password: credentials.password,
        });
      } catch (error) {
        // Handle different types of authentication errors
        if (error instanceof AuthError) {
          const errorName = error.name;
          const errorMessage = error.message.toLowerCase();
          
          // Handle specific error cases
          if (errorName === 'NotAuthorizedException' || 
              errorMessage.includes('incorrect username or password') ||
              errorMessage.includes('invalid credentials')) {
            throw {
              message: 'Invalid email or password. Please check your credentials and try again.',
              code: errorName,
              type: 'invalid_credentials'
            };
          }
          
          if (errorName === 'UserNotFoundException' || 
              errorMessage.includes('user does not exist')) {
            throw {
              message: 'No account found with this email address.',
              code: errorName,
              type: 'user_not_found'
            };
          }
          
          if (errorName === 'UserNotConfirmedException' || 
              errorMessage.includes('user is not confirmed')) {
            throw {
              message: 'Please confirm your email address before signing in. Check your inbox for a confirmation code.',
              code: errorName,
              type: 'user_not_confirmed'
            };
          }
          
          if (errorName === 'TooManyRequestsException' || 
              errorMessage.includes('too many requests') ||
              errorMessage.includes('attempt limit')) {
            throw {
              message: 'Too many failed login attempts. Please try again later or reset your password.',
              code: errorName,
              type: 'too_many_attempts'
            };
          }
          
          if (errorName === 'NetworkError' || 
              errorMessage.includes('network') ||
              errorMessage.includes('connection')) {
            throw {
              message: 'Network error. Please check your internet connection and try again.',
              code: errorName,
              type: 'network'
            };
          }
          
          // Fallback for other AWS Cognito errors
          throw {
            message: 'Authentication failed. Please try again.',
            code: errorName,
            type: 'unknown'
          };
        }
        
        // Handle non-AuthError exceptions
        throw {
          message: 'An unexpected error occurred during login. Please try again.',
          type: 'unknown'
        };
      }
    },
    onSuccess: () => {
      // Invalidate and refetch the authentication status
      queryClient.invalidateQueries({ queryKey: [isAuthenticatedQueryKey] });
    },
  });
};
