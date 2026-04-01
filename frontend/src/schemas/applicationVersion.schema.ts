import { z } from 'zod';

export const applicationVersionSchema = z.object({
  applicationId: z.number().int().positive('Selecione uma aplicação válida'),
  versionId: z.number().int().positive('Selecione uma versão válida'),
});

export type ApplicationVersionFormData = z.infer<typeof applicationVersionSchema>;
