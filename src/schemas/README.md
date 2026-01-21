# schemas

This folder is for data validation schemas, TypeScript types, and interfaces. Place all schema definitions and type-related files here.

## Example: Zod User Schema

```ts
// src/schemas/userSchema.ts
import { z } from 'zod';

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
});
```