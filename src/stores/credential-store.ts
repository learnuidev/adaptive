import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CredentialStore {
  selectedCredentialId: string | null;
  setSelectedCredential: (credentialId: string) => void;
  clearSelectedCredential: () => void;
}

export const useCredentialStore = create<CredentialStore>()(
  persist(
    (set) => ({
      selectedCredentialId: null,
      setSelectedCredential: (credentialId: string) =>
        set({ selectedCredentialId: credentialId }),
      clearSelectedCredential: () => set({ selectedCredentialId: null }),
    }),
    {
      name: 'selected-credential',
    }
  )
);