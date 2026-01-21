# hooks

This folder is for custom React hooks. Place all reusable logic that leverages React hooks here to keep your code DRY and organized.

## Example: useToggle Hook

```ts
// src/hooks/useToggle.ts
import { useState } from 'react';

export function useToggle(initial = false) {
	const [value, setValue] = useState(initial);
	const toggle = () => setValue((v) => !v);
	return [value, toggle] as const;
}
```