export interface ApiResponse {
  status: {
    code: number;
    errorcode: number;
  };
  response: object;
}

export async function callApi(
  token: string,
  secret: string,
  call: string
): Promise<ApiResponse | null> {
  let query;
  try {
    query = JSON.parse(call);
  } catch (e) {
    console.error("Error parsing call parameter:", e);
    return null;
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const hmac = await generateHmac(
    token,
    secret,
    timestamp,
    query.resourcetype,
    query.actionid
  );

  const parameters = JSON.stringify(query.parameters);

  const request = `{"token":"${token}","request":{"actions":[{"actionid":"${query.actionid}","resourceid":"${query.resourceid}","resourcetype":"${query.resourcetype}","identifier":"${query.identifier}","timestamp":${timestamp},"hmac_version":"2","hmac":"${hmac}","parameters":${parameters}}]}}`;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-extra-non-null-assertion
  return fetch(import.meta.env.VITE_API_SERVER_URL!! as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: request,
  }).then(async (response) => {
    if (!response.ok) {
      console.error("Server responded with an error:", response.statusText);
      return null;
    }
    return response.json() as Promise<ApiResponse>;
  });
}

async function generateHmac(
  token: string,
  secret: string,
  timestamp: number,
  resourceType: string,
  actionId: string
): Promise<string> {
  const hmacData = timestamp + token + resourceType + actionId;

  const encoder = new TextEncoder();
  const key = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );
  const signed = await window.crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(hmacData)
  );
  return btoa(String.fromCharCode(...new Uint8Array(signed)));
}
