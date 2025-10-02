import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChartNote {
  id: string;
  chartKey: string;
  dataPoint: string;
  note: string;
  timestamp: number;
  credentialId?: string;
}

interface ChartNotesStore {
  notes: ChartNote[];
  addNote: (note: Omit<ChartNote, 'id' | 'timestamp'>) => void;
  updateNote: (id: string, note: string) => void;
  deleteNote: (id: string) => void;
  getNoteForPoint: (chartKey: string, dataPoint: string) => ChartNote | undefined;
  getNotesForChart: (chartKey: string) => ChartNote[];
}

export const useChartNotesStore = create<ChartNotesStore>()(
  persist(
    (set, get) => ({
      notes: [],
      addNote: (note) => {
        const newNote: ChartNote = {
          ...note,
          id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
        };
        set((state) => ({ notes: [...state.notes, newNote] }));
      },
      updateNote: (id, note) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, note, timestamp: Date.now() } : n
          ),
        }));
      },
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }));
      },
      getNoteForPoint: (chartKey, dataPoint) => {
        return get().notes.find(
          (n) => n.chartKey === chartKey && n.dataPoint === dataPoint
        );
      },
      getNotesForChart: (chartKey) => {
        return get().notes.filter((n) => n.chartKey === chartKey);
      },
    }),
    {
      name: 'chart-notes-storage',
    }
  )
);
