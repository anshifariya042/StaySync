import { create } from 'zustand'

interface SidebarState {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    toggle: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
    isOpen: false,
    setIsOpen: (open: boolean) => set({ isOpen: open }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))
