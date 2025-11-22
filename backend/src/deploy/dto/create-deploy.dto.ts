import { z } from "zod";

export const createDeployDto = z.object({
  repoUrl: z.url(),
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters long")
    .max(63, "Subdomain must be at most 63 characters long")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "Subdomain can only contain alphanumeric characters and hyphens"
    )
    .refine(
      (value) => !value.startsWith("-") && !value.endsWith("-"),
      "Subdomain cannot start or end with a hyphen"
    ),
  description: z
    .string()
    .max(255, "Description must be at most 255 characters long")
    .optional(),
});

export type CreateDeployDto = z.infer<typeof createDeployDto>;
