# shared

This folder is for shared UI components. Place components that are reused across multiple features or pages here, such as buttons, modals, or form elements.

## Example: Shared Component

```tsx
// src/components/shared/Modal.tsx
import React from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <button onClick={onClose} className="float-right">Close</button>
        {children}
      </div>
    </div>
  );
}
```
