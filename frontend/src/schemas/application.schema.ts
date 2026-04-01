import { z } from 'zod';

export const applicationSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  active: z.boolean().default(false),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
