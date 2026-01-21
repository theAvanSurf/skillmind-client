# providers

This folder is for React context providers and global state management components. Use this to wrap your app with context or other providers.

## Example: ThemeProvider

```tsx
// src/providers/ThemeProvider.tsx
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', setTheme: (t: string) => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState('light');
	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	return useContext(ThemeContext);
}
```