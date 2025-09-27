import { fetchAuthSession, getCurrentUser } from "@aws-amplify/auth";

// import { isDevMode } from '../utils/is-dev-mode';

import { cognitoUserPoolsTokenProvider } from "@aws-amplify/auth/cognito";

import {
  signIn as signInAmplify,
  signInWithRedirect as signInWithRedirectAmplify,
  signOut as signOutAmplify,
  signUp as signUpAmplify,
  confirmSignUp as confirmSignUpAmplify,
  AuthError,
} from "aws-amplify/auth";

export async function getAmplifyIsAuthenticated() {
  try {
    const authUser = await getCurrentUser();

    return !!authUser;
  } catch (error) {
    console.error(error);
  }

  return false;
}

async function getAuthSession() {
  try {
    return await fetchAuthSession();
  } catch (error) {
    console.error(error);
  }

  return null;
}

export async function getAmplifyAuthToken() {
  const tokens = await getAuthSession();

  const authToken = tokens?.tokens?.idToken?.toString();

  if (authToken) {
    return authToken;
  } else {
    return null;
  }
}

export async function signIn(...input: Parameters<typeof signInAmplify>) {
  const result = await signInAmplify(...input);

  try {
    const tokens =
      await cognitoUserPoolsTokenProvider.authTokenStore.loadTokens();

    if (tokens) {
      const { signInDetails, ...tokensNoSignIn } = tokens;

      cognitoUserPoolsTokenProvider.authTokenStore.storeTokens(tokensNoSignIn);
    }
  } catch (error) {
    console.error("Error removing signInDetails from cookies", error);
  }

  return result;
}

export async function signUp(...input: Parameters<typeof signUpAmplify>) {
  try {
    const result = await signUpAmplify(...input);
    return result;
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
}

export async function confirmSignUp(
  ...input: Parameters<typeof confirmSignUpAmplify>
) {
  try {
    const result = await confirmSignUpAmplify(...input);
    return result;
  } catch (error) {
    console.error("Error during sign up confirmation:", error);
    throw error;
  }
}

export async function signOut(...input: Parameters<typeof signOutAmplify>) {
  return signOutAmplify(...input);
}
