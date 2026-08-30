import { z } from 'zod'

export const setActiveSchema = z.object({
  isActive: z.boolean(),
})
