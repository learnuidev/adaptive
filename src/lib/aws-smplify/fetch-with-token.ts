import { getAmplifyAuthToken } from "./amplify-auth";

export type FetchParams = [
  ...Parameters<typeof fetch>,

  ...[allowNoToken?: boolean],

  ...[isKsWizard?: boolean],
];

export async function fetchWithToken(...args: FetchParams) {
  const [input, init] = args;

  const authToken = await getAmplifyAuthToken();

  if (!authToken) {
    throw new Error("AuthToken is missing.");
  }

  const headers: RequestInit["headers"] = authToken
    ? {
        ...init?.headers,
        Authorization: `Bearer ${authToken}`,
      }
    : init?.headers;

  let resp = null;

  try {
    resp = await fetch(input, {
      ...init,
      headers,
    });
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw e;
    }

    const errMsg = e instanceof Error ? `${e.name} ${e.message}` : `${e}`;
    throw new Error(`Request rejected ${errMsg}`);
  }

  if (resp && !resp.ok) {
    throw new Error(
      `Request failed with status: ${resp.status}. Message: ${resp.statusText}`
    );
  }

  return resp;
}
