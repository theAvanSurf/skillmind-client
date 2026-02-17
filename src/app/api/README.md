# api

This folder is for API route handlers and server-side logic. Place all Next.js API routes and backend-related code here.

## Example: Simple API Route

Create a file like `hello.ts` in this folder:

```ts
// src/api/hello.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	return NextResponse.json({ message: 'Hello from the API!' });
}
```

This will expose an endpoint at `/api/hello`.