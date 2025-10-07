import { confirmResetPassword } from "@/lib/aws-smplify/amplify-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetPasswordSchema, ResetPassword, LoginError } from "./auth.types";
import { isAuthenticatedQueryKey } from "./use-is-authenticated.query";
import { AuthError } from "aws-amplify/auth";

export const useResetPasswordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, LoginError, ResetPassword>({
    mutationFn: async (data: ResetPassword) => {
      // Validate input against schema before API call
      resetPasswordSchema.parse(data);
      
      try {
        await confirmResetPassword(
          data.email,
          data.confirmationCode,
          data.newPassword
        );
      } catch (error) {
        // Handle different types of authentication errors
        if (error instanceof AuthError) {
          const errorName = error.name;
          const errorMessage = error.message.toLowerCase();
          
          // Handle specific error cases
          if (errorName === 'CodeMismatchException' || 
              errorMessage.includes('invalid verification code') ||
              errorMessage.includes('code mismatch')) {
            throw {
              message: 'Invalid confirmation code. Please check your email and try again.',
              code: errorName,
              type: 'invalid_credentials'
            };
          }
          
          if (errorName === 'ExpiredCodeException' || 
              errorMessage.includes('code expired') ||
              errorMessage.includes('expired code')) {
            throw {
              message: 'Confirmation code has expired. Please request a new password reset.',
              code: errorName,
              type: 'invalid_credentials'
            };
          }
          
          if (errorName === 'UserNotFoundException' || 
              errorMessage.includes('user does not exist') ||
              errorMessage.includes('username/client id combination not found')) {
            throw {
              message: 'No account found with this email address.',
              code: errorName,
              type: 'user_not_found'
            };
          }
          
          if (errorName === 'InvalidParameterException' || 
              errorMessage.includes('invalid password') ||
              errorMessage.includes('password did not conform with policy')) {
            throw {
              message: 'New password does not meet requirements. Please choose a stronger password.',
              code: errorName,
              type: 'invalid_credentials'
            };
          }
          
          if (errorName === 'TooManyRequestsException' || 
              errorMessage.includes('too many requests') ||
              errorMessage.includes('attempt limit exceeded')) {
            throw {
              message: 'Too many reset attempts. Please try again later.',
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
            message: 'Failed to reset password. Please try again.',
            code: errorName,
            type: 'unknown'
          };
        }
        
        // Handle non-AuthError exceptions
        throw {
          message: 'An unexpected error occurred. Please try again.',
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
