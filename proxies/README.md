# Proxies
Currently, the API does not have any [CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS) headers set. That means browsers will refuse to connect to it.

As a workaround, they call a proxy server. The proxy server then contacts the real API server and passes the response back to its caller.

We offer two implementations for proxy servers, one for Deno and one for PHP.

## Deno
The Deno implementation is meant to be used locally, since it can be started with npm:

```sh
npm run proxy-server
```

It is also automatically started when you start the development server using:

```sh
npm run start
```

## PHP
The PHP implementation is meant to be used on the server where the tool is deployed (https://tools.onofficeweb.com/api-client/).