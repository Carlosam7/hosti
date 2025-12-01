import { z } from "zod";

export const updateDeployDto = z.object({
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters long")
    .max(63, "Subdomain must be at most 63 characters long")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "Subdomain can only contain alphanumeric characters and hyphens"
    ),
  description: z
    .string()
    .max(255, "Description must be at most 255 characters long")
    .optional(),
});

export type UpdateDeployDto = z.infer<typeof updateDeployDto>;
