import { resetPassword } from "@/lib/aws-smplify/amplify-auth";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordSchema, ForgotPassword, LoginError } from "./auth.types";
import { AuthError } from "aws-amplify/auth";

export const useForgotPasswordMutation = () => {
  return useMutation<void, LoginError, ForgotPassword>({
    mutationFn: async (data: ForgotPassword) => {
      // Validate input against schema before API call
      forgotPasswordSchema.parse(data);
      
      try {
        await resetPassword(data.email);
      } catch (error) {
        // Handle different types of authentication errors
        if (error instanceof AuthError) {
          const errorName = error.name;
          const errorMessage = error.message.toLowerCase();
          
          // Handle specific error cases
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
              errorMessage.includes('invalid email') ||
              errorMessage.includes('invalid parameter')) {
            throw {
              message: 'Invalid email address format.',
              code: errorName,
              type: 'invalid_credentials'
            };
          }
          
          if (errorName === 'TooManyRequestsException' || 
              errorMessage.includes('too many requests') ||
              errorMessage.includes('attempt limit exceeded')) {
            throw {
              message: 'Too many password reset attempts. Please try again later.',
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
            message: 'Failed to send password reset code. Please try again.',
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
  });
};
