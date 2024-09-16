import { z } from 'zod';

const schema = z.object({
  HOSTNAME: z.string().optional(),
  PORT: z.coerce.number().optional(),
});

const env = schema.parse(Bun.env);

export default env;
