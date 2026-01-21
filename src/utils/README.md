# utils

This folder is for utility functions and helpers that are used throughout the project. Store generic, reusable code here.

## Example: Debounce Function

```ts
// src/utils/debounce.ts
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
	let timer: NodeJS.Timeout;
	return (...args: Parameters<T>) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), delay);
	};
}
```