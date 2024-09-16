import { z } from 'zod'

const schema = z.object({
  VITE_BACKEND: z.string().optional()
});

const env = schema.parse(import.meta.env);

export default env