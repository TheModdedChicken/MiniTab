import 'dotenv/config'

import { Hono } from 'hono'
import { trimTrailingSlash } from 'hono/trailing-slash'

import env from './utility/env'
import routes from './routes'

const app = new Hono().basePath('/api')

const api = app
  .use(trimTrailingSlash())
  .use((c, next) => {
    c.header("Access-Control-Allow-Origin", '*');
    c.header("Access-Control-Allow-Credentials", "true");
    c.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Content-Length, Accept-Encoding, Accept, Origin, Cache-Control"
    );
    c.header(
      "Access-Control-Allow-Methods",
      "GET, SEARCH, POST, OPTIONS"
    );

    return next();
  })
  .route('/', routes);

export default {
  port: env.PORT || 8000,
  fetch: app.fetch
}

export type Routes = typeof api

export * as Types from './utility/types'

console.log("Server is running!");