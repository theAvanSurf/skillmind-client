# store

This folder is for state management logic, such as Redux, Zustand, or other state libraries. Place your global or shared state logic here.

## Example: Zustand Store

```ts
// src/store/useUserStore.ts
import { create } from 'zustand';

type UserState = {
	name: string;
	setName: (name: string) => void;
};

export const useUserStore = create<UserState>((set) => ({
	name: '',
	setName: (name) => set({ name }),
}));
```