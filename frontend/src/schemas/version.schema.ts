import { z } from 'zod';

export const versionSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome deve ter no máximo 50 caracteres'),
  technologiesId: z.number().int().positive('Selecione uma tecnologia válida'),
  standard: z.boolean().default(false),
  fullName: z.string().min(1, 'Nome completo é obrigatório'),
  eos: z.string().nullable().optional(),
  eol: z.string().nullable().optional(),
});

export type VersionFormData = z.infer<typeof versionSchema>;
