import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

/**
 * App State Interface
 * Define your global application state here
 */
export interface AppState {
  // Theme
  theme: "light" | "dark" | "system";

  // Sidebar state
  sidebarOpen: boolean;

  // User preferences
  preferences: {
    compactMode: boolean;
    notifications: boolean;
  };

  // Loading states
  isLoading: boolean;
}

/**
 * App Actions Interface
 * Define your state mutations here
 */
export interface AppActions {
  // Theme actions
  setTheme: (theme: AppState["theme"]) => void;

  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Preferences actions
  updatePreferences: (preferences: Partial<AppState["preferences"]>) => void;

  // Loading actions
  setLoading: (loading: boolean) => void;

  // Reset
  reset: () => void;
}

const initialState: AppState = {
  theme: "system",
  sidebarOpen: true,
  preferences: {
    compactMode: false,
    notifications: true,
  },
  isLoading: false,
};

/**
 * Main App Store
 *
 * Uses:
 * - immer: For immutable state updates with mutable syntax
 * - devtools: For Redux DevTools integration
 * - persist: For localStorage persistence
 */
export const useAppStore = create<AppState & AppActions>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        setTheme: (theme) =>
          set((state) => {
            state.theme = theme;
          }),

        toggleSidebar: () =>
          set((state) => {
            state.sidebarOpen = !state.sidebarOpen;
          }),

        setSidebarOpen: (open) =>
          set((state) => {
            state.sidebarOpen = open;
          }),

        updatePreferences: (preferences) =>
          set((state) => {
            state.preferences = { ...state.preferences, ...preferences };
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        reset: () => set(initialState),
      })),
      {
        name: "axle-truck-storage",
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
          preferences: state.preferences,
        }),
      }
    ),
    { name: "AppStore" }
  )
);
