/** @format */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface TagView {
  path: string;
  title: string;
  name?: string;
  icon?: string;
  keepAlive?: boolean;
  locale?: string; // i18n key
}

interface TabsState {
  visitedViews: TagView[];
  cachedViews: string[];
  maxTabCount: number;
  addView: (view: TagView) => void;
  delView: (view: TagView) => void;
  delOthersViews: (view: TagView) => void;
  delAllViews: () => void;
}

export const useTabsStore = create<TabsState>()(
  persist(
    (set) => ({
      visitedViews: [],
      cachedViews: [],
      maxTabCount: 10,

      addView: (view) =>
        set((state) => {
          if (state.visitedViews.some((v) => v.path === view.path)) {
            // Update existing view (e.g. title might change?? usually not, but maybe)
            return state;
          }
          let newVisitedViews = [...state.visitedViews, view];
          if (newVisitedViews.length > state.maxTabCount) {
            newVisitedViews = newVisitedViews.slice(1);
          }

          // Handle KeepAlive caching
          let newCachedViews = state.cachedViews;
          if (view.keepAlive && view.name) {
            if (!state.cachedViews.includes(view.name)) {
              newCachedViews = [...state.cachedViews, view.name];
            }
          }

          return {
            visitedViews: newVisitedViews,
            cachedViews: newCachedViews,
          };
        }),

      delView: (view) =>
        set((state) => {
          const newVisitedViews = state.visitedViews.filter(
            (v) => v.path !== view.path
          );
          const newCachedViews = state.cachedViews.filter(
            (v) => v !== view.name
          );
          return {
            visitedViews: newVisitedViews,
            cachedViews: newCachedViews,
          };
        }),

      delOthersViews: (view) =>
        set((state) => {
          const newVisitedViews = state.visitedViews.filter(
            (v) => v.path === view.path || v.path === "/dashboard" // Always keep dashboard if needed, or modify logic
          );
          // Simple logic: keep current only
          // If dashboard is fixed, logic should be handled there.
          // For now, strict delete others.
          const newCachedViews = state.cachedViews.filter(
            (v) => v === view.name
          );
          return {
            visitedViews: newVisitedViews,
            cachedViews: newCachedViews,
          };
        }),

      delAllViews: () =>
        set(() => ({
          visitedViews: [],
          cachedViews: [],
        })),
    }),
    {
      name: "layout-tabs-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
