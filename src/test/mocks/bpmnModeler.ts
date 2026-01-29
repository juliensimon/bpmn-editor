import { vi } from 'vitest';

export function createMockModeler() {
  const commandStackChangedHandlers: Array<() => void> = [];

  const mockCommandStack = {
    undo: vi.fn(),
    redo: vi.fn(),
    canUndo: vi.fn().mockReturnValue(false),
    canRedo: vi.fn().mockReturnValue(false),
  };

  const mockModeler = {
    importXML: vi.fn().mockResolvedValue({}),
    saveXML: vi.fn().mockResolvedValue({ xml: '<exported />' }),
    saveSVG: vi.fn().mockResolvedValue({ svg: '<svg />' }),
    destroy: vi.fn(),
    on: vi.fn((event: string, handler: () => void) => {
      if (event === 'commandStack.changed') {
        commandStackChangedHandlers.push(handler);
      }
    }),
    get: vi.fn((name: string) => {
      if (name === 'commandStack') return mockCommandStack;
      return null;
    }),
  };

  return {
    mockModeler,
    mockCommandStack,
    fireCommandStackChanged: () => {
      commandStackChangedHandlers.forEach((h) => h());
    },
  };
}
