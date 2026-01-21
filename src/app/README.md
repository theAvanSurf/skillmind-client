# app

This folder contains the main application structure, including pages, layouts, and global styles. Use this for Next.js app directory routing and UI composition.

## Example: Basic Layout

Create a `layout.tsx` file:

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
```

This sets up the root layout for your app.