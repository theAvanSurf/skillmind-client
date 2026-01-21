# features

This folder is for feature-specific components. Place components that are tightly coupled to a particular feature or page of your application here. This helps keep your code organized by domain or functionality.

## Example 1: Feature Component

```tsx
// src/components/features/UserProfile.tsx
import React from 'react';

export function UserProfile({ name }: { name: string }) {
  return <div>User: {name}</div>;
}
```

## Example 2: Feature Folder Structure


You can organize feature code in subfolders for each feature, following a feature-sliced (modular) architecture:

```
features/
  user/
    components/
      UserProfile.tsx
      UserSettings.tsx
    hooks/
      useUser.ts
      useUserSettings.ts
    store/
      userStore.ts
    utils/
      formatUserName.ts
    index.ts
  dashboard/
    components/
      DashboardHeader.tsx
      DashboardStats.tsx
    hooks/
      useDashboardStats.ts
    store/
      dashboardStore.ts
    utils/
      calculateStats.ts
    index.ts
```

### Example: user feature

#### components/UserProfile.tsx
```tsx
import React from 'react';
import { useUser } from '../hooks/useUser';

export function UserProfile() {
  const user = useUser();
  return <div>User: {user.name}</div>;
}
```

#### hooks/useUser.ts
```ts
import { useStore } from '../store/userStore';

export function useUser() {
  return useStore((state) => state.user);
}
```

#### store/userStore.ts
```ts
import { create } from 'zustand';

type User = { name: string; email: string };
type UserState = { user: User; setUser: (user: User) => void };

export const useStore = create<UserState>((set) => ({
  user: { name: '', email: '' },
  setUser: (user) => set({ user }),
}));
```

#### utils/formatUserName.ts
```ts
export function formatUserName(name: string) {
  return name.trim().toUpperCase();
}
```

This structure keeps all logic, UI, and state for a feature together, making your codebase scalable and maintainable.

## Example 3: Feature with Local State and API

```tsx
// src/components/features/user/UserSettings.tsx
import React, { useState } from 'react';

export function UserSettings() {
  const [email, setEmail] = useState('');

  const handleSave = async () => {
    // Example API call
    await fetch('/api/user/settings', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    });
  };

  return (
    <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Save</button>
    </form>
  );
}
```
