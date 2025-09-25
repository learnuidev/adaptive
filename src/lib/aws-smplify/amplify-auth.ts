import { fetchAuthSession, getCurrentUser } from "@aws-amplify/auth";

// import { isDevMode } from '../utils/is-dev-mode';

import { cognitoUserPoolsTokenProvider } from "@aws-amplify/auth/cognito";

import {
  signIn as signInAmplify,
  signInWithRedirect as signInWithRedirectAmplify,
  signOut as signOutAmplify,
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
  const authToken = (await getAuthSession())?.tokens?.accessToken?.toString();

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

export async function signOut(...input: Parameters<typeof signOutAmplify>) {
  return signOutAmplify(...input);
}
