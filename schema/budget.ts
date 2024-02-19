import { z } from 'zod'

export const budgetSchema = z.object({
  id: z.any().optional(),
  limit: z.coerce.number().min(1, 'Limit is required!'),
  month: z.date(),  
})

export type BudgetSchema = z.infer<typeof budgetSchema>
