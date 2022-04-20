import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

const port = 8080;

const handler = async (request: Request): Promise<Response> => {
  return fetch("https://api.onoffice.de/api/latest/api.php", {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
};

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
