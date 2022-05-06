import md5 from "md5";

export async function callApi(
  token: string,
  secret: string,
  call: string,
): Promise<object | null> {
  const query = JSON.parse(call);

  if (Array.isArray(query.parameters.data)) {
    // We need to sort the data for the HMAC.
    query.parameters.data.sort();
  }

  const rawData = JSON.stringify(query.parameters);

  // Escape special chars. Otherwise Umlaute, like in "Nürnberg", will not get recognized correctly in enterprise.
  const toEscape = /[\u00C0-\u00FF]/g; // Latin-1 Supplement, see https://en.wikipedia.org/wiki/List_of_Unicode_characters#Latin-1_Supplement
  const escapedData = rawData.replace(
    toEscape,
    (c) => `\\u${("0000" + c.charCodeAt(0).toString(16)).slice(-4)}`,
  );

  const timestamp = Math.round(new Date().getTime() / 1000);

  const hmacparameters =
    `${escapedData},${token},${query.actionid},${query.identifier},${query.resourceid},${secret},${timestamp},${query.resourcetype}`;
  const hmac = md5(secret + md5(hmacparameters));

  const request =
    `{"token":"${token}","request":{"actions":[{"actionid":"${query.actionid}","resourceid":"${query.resourceid}","resourcetype":"${query.resourcetype}","identifier":"${query.identifier}","timestamp":${timestamp},"hmac":"${hmac}","parameters":${escapedData}}]}}`;

  return fetch("http://localhost:8080", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: request,
  }).then(async (response) => response.json());
}
