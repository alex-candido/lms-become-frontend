import { z } from "zod";

const CONFIG_ENV_SCHEMA = z.object({
  DATABASE_URL: z.string(),
  NEXT_BASE_URL_API: z.string(),
  NEXTAUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
})

export const env = CONFIG_ENV_SCHEMA.parse(process.env)
