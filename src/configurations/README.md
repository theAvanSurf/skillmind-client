# configurations

This folder is for configuration files and settings used throughout the project. Store environment-specific or shared configuration logic here.

## Example: App Configuration

```ts
// src/configurations/appConfig.ts
export const appConfig = {
	apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
};
```