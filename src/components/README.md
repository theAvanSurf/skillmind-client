# components

This folder is for reusable React components. Place all UI elements and presentational components here to keep your code modular and maintainable.

## Example: Button Component

```tsx
// src/components/Button.tsx
import React from 'react';

type ButtonProps = {
	children: React.ReactNode;
	onClick?: () => void;
};

export function Button({ children, onClick }: ButtonProps) {
	return (
		<button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white rounded">
			{children}
		</button>
	);
}
```