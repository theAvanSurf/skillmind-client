# libs

This folder is for utility libraries and helper functions that are used across the project. Store shared logic that doesn't fit into components or hooks here.

## Example: String Capitalize Utility

```ts
// src/libs/capitalize.ts
export function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
```