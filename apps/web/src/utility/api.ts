import * as API from 'server'
import { ClientResponse, hc } from 'hono/client'
import env from './env';

const { api } = hc<API.Routes>(env.VITE_BACKEND || location.origin);

export default api;