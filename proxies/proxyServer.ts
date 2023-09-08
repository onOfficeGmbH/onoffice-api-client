import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

const port = 8080;

const handler = async (request: Request): Promise<Response> => {
  console.log(request);
  const response = await fetch("https://api.onoffice.de/api/latest/api.php", {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  return new Response(response.body, {
    ...response,
    headers: { ...response.headers, ...corsHeaders },
  });
};

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
