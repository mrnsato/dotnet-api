import { z } from 'zod';

export const technologySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome deve ter no máximo 50 caracteres'),
});

export type TechnologyFormData = z.infer<typeof technologySchema>;
