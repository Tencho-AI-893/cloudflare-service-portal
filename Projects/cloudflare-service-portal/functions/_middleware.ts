// Cloudflare Pages middleware configuration
// This file is optional for static export
// Uncomment and configure as needed for Cloudflare Workers integration

/*
export interface Env {
  DB?: any;
  KV?: any;
  DURABLE_OBJECT?: any;
}

export async function onRequest(context: any) {
  const { request, next } = context;
  const response = await next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  return response;
}
*/

export default {
  async fetch(request: Request) {
    return fetch(request);
  }
};
