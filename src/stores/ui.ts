import { create } from 'zustand';
import { ReadingStatus, SortOrder, ViewMode } from '../types';

interface UIStore {
  statusFilter: ReadingStatus | 'ALL';
  sortOrder: SortOrder;
  viewMode: ViewMode;
  kakaoApiKey: string;
  setStatusFilter: (filter: ReadingStatus | 'ALL') => void;
  setSortOrder: (order: SortOrder) => void;
  setViewMode: (mode: ViewMode) => void;
  setKakaoApiKey: (key: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  statusFilter: 'ALL',
  sortOrder: 'addedAt',
  viewMode: 'grid',
  kakaoApiKey: '',
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setViewMode: (viewMode) => set({ viewMode }),
  setKakaoApiKey: (kakaoApiKey) => set({ kakaoApiKey }),
}));
