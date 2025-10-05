import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WebsiteStore {
  selectedWebsiteId: string | null;
  setSelectedWebsite: (websiteId: string) => void;
  clearSelectedCredential: () => void;
}

export const useWebsiteStore = create<WebsiteStore>()(
  persist(
    (set) => ({
      selectedWebsiteId: null,
      setSelectedWebsite: (websiteId: string) =>
        set({ selectedWebsiteId: websiteId }),
      clearSelectedCredential: () => set({ selectedWebsiteId: null }),
    }),
    {
      name: "selected-website",
    }
  )
);
