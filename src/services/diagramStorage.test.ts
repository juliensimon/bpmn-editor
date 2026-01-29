import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  listDiagrams,
  getDiagram,
  saveDiagram,
  deleteDiagram,
  getCurrentDiagramId,
  setCurrentDiagramId,
  type SavedDiagram,
} from './diagramStorage';

function makeDiagram(overrides: Partial<SavedDiagram> = {}): SavedDiagram {
  return {
    id: 'test-id',
    name: 'Test Diagram',
    xml: '<xml/>',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('diagramStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('listDiagrams', () => {
    it('returns empty array when no diagrams stored', () => {
      expect(listDiagrams()).toEqual([]);
    });

    it('returns all saved diagrams', () => {
      saveDiagram(makeDiagram({ id: 'a' }));
      saveDiagram(makeDiagram({ id: 'b' }));
      expect(listDiagrams()).toHaveLength(2);
    });

    it('sorts diagrams by updatedAt descending (newest first)', () => {
      saveDiagram(makeDiagram({ id: 'old', updatedAt: '2024-01-01T00:00:00.000Z' }));
      saveDiagram(makeDiagram({ id: 'new', updatedAt: '2024-06-01T00:00:00.000Z' }));
      const list = listDiagrams();
      expect(list[0].id).toBe('new');
      expect(list[1].id).toBe('old');
    });

    it('returns empty array when localStorage has invalid JSON', () => {
      localStorage.setItem('bpmn-diagrams', 'not-json');
      expect(listDiagrams()).toEqual([]);
    });
  });

  describe('getDiagram', () => {
    it('returns undefined for non-existent diagram', () => {
      expect(getDiagram('nonexistent')).toBeUndefined();
    });

    it('returns the diagram with matching id', () => {
      const d = makeDiagram({ id: 'find-me', name: 'Found' });
      saveDiagram(d);
      expect(getDiagram('find-me')).toEqual(d);
    });

    it('does not return a different diagram', () => {
      saveDiagram(makeDiagram({ id: 'other' }));
      expect(getDiagram('nonexistent')).toBeUndefined();
    });
  });

  describe('saveDiagram', () => {
    it('creates a new diagram', () => {
      const d = makeDiagram({ id: 'new-one' });
      saveDiagram(d);
      expect(getDiagram('new-one')).toEqual(d);
    });

    it('updates an existing diagram with the same id', () => {
      saveDiagram(makeDiagram({ id: 'update-me', name: 'Original' }));
      saveDiagram(makeDiagram({ id: 'update-me', name: 'Updated' }));
      expect(getDiagram('update-me')?.name).toBe('Updated');
      expect(listDiagrams()).toHaveLength(1);
    });

    it('does not affect other diagrams when updating', () => {
      saveDiagram(makeDiagram({ id: 'keep-me', name: 'Keep' }));
      saveDiagram(makeDiagram({ id: 'update-me', name: 'Original' }));
      saveDiagram(makeDiagram({ id: 'update-me', name: 'Updated' }));
      expect(getDiagram('keep-me')?.name).toBe('Keep');
    });

    it('persists data to localStorage', () => {
      saveDiagram(makeDiagram({ id: 'persisted' }));
      const raw = localStorage.getItem('bpmn-diagrams');
      expect(raw).toBeTruthy();
      const parsed = JSON.parse(raw!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].id).toBe('persisted');
    });
  });

  describe('deleteDiagram', () => {
    it('removes the diagram by id', () => {
      saveDiagram(makeDiagram({ id: 'delete-me' }));
      deleteDiagram('delete-me');
      expect(getDiagram('delete-me')).toBeUndefined();
      expect(listDiagrams()).toHaveLength(0);
    });

    it('does not affect other diagrams', () => {
      saveDiagram(makeDiagram({ id: 'keep' }));
      saveDiagram(makeDiagram({ id: 'delete' }));
      deleteDiagram('delete');
      expect(getDiagram('keep')).toBeDefined();
      expect(listDiagrams()).toHaveLength(1);
    });

    it('clears currentDiagramId if the deleted diagram was current', () => {
      saveDiagram(makeDiagram({ id: 'current' }));
      setCurrentDiagramId('current');
      deleteDiagram('current');
      expect(getCurrentDiagramId()).toBeNull();
    });

    it('does not clear currentDiagramId if a different diagram is deleted', () => {
      saveDiagram(makeDiagram({ id: 'current' }));
      saveDiagram(makeDiagram({ id: 'other' }));
      setCurrentDiagramId('current');
      deleteDiagram('other');
      expect(getCurrentDiagramId()).toBe('current');
    });

    it('is a no-op for non-existent id', () => {
      saveDiagram(makeDiagram({ id: 'existing' }));
      deleteDiagram('nonexistent');
      expect(listDiagrams()).toHaveLength(1);
    });
  });

  describe('getCurrentDiagramId / setCurrentDiagramId', () => {
    it('returns null when nothing is set', () => {
      expect(getCurrentDiagramId()).toBeNull();
    });

    it('stores and retrieves the current diagram id', () => {
      setCurrentDiagramId('abc');
      expect(getCurrentDiagramId()).toBe('abc');
    });

    it('updates the current diagram id', () => {
      setCurrentDiagramId('first');
      setCurrentDiagramId('second');
      expect(getCurrentDiagramId()).toBe('second');
    });

    it('clears the current diagram id when set to null', () => {
      setCurrentDiagramId('something');
      setCurrentDiagramId(null);
      expect(getCurrentDiagramId()).toBeNull();
    });

    it('persists to localStorage under the correct key', () => {
      setCurrentDiagramId('stored');
      expect(localStorage.getItem('bpmn-current-diagram-id')).toBe('stored');
    });

    it('removes the key from localStorage when set to null', () => {
      setCurrentDiagramId('temp');
      setCurrentDiagramId(null);
      expect(localStorage.getItem('bpmn-current-diagram-id')).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('handles localStorage quota exceeded on saveDiagram', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      });

      expect(() => saveDiagram(makeDiagram({ id: 'quota' }))).toThrow();

      localStorage.setItem = originalSetItem;
    });

    it('handles localStorage quota exceeded on setCurrentDiagramId', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      });

      expect(() => setCurrentDiagramId('some-id')).toThrow();

      localStorage.setItem = originalSetItem;
    });

    it('concurrent save and delete preserves remaining diagrams', () => {
      saveDiagram(makeDiagram({ id: 'a', name: 'A' }));
      saveDiagram(makeDiagram({ id: 'b', name: 'B' }));
      saveDiagram(makeDiagram({ id: 'c', name: 'C' }));
      deleteDiagram('b');
      saveDiagram(makeDiagram({ id: 'a', name: 'A-Updated' }));

      expect(listDiagrams()).toHaveLength(2);
      expect(getDiagram('a')?.name).toBe('A-Updated');
      expect(getDiagram('b')).toBeUndefined();
      expect(getDiagram('c')?.name).toBe('C');
    });

    it('saves and retrieves a diagram with empty string fields', () => {
      const d = makeDiagram({ id: 'empty-fields', name: '', xml: '' });
      saveDiagram(d);
      const retrieved = getDiagram('empty-fields');
      expect(retrieved).toEqual(d);
      expect(retrieved?.name).toBe('');
      expect(retrieved?.xml).toBe('');
    });

    it('saves and retrieves a very large XML string', () => {
      const largeXml = '<xml>' + 'a'.repeat(100_000) + '</xml>';
      const d = makeDiagram({ id: 'large-xml', xml: largeXml });
      saveDiagram(d);
      const retrieved = getDiagram('large-xml');
      expect(retrieved?.xml).toBe(largeXml);
      expect(retrieved?.xml.length).toBe(largeXml.length);
    });

    it('saves and retrieves a diagram with special characters in name', () => {
      const specialName = 'Diagramm <>&"\'éàü 日本語 🚀';
      const d = makeDiagram({ id: 'special-chars', name: specialName });
      saveDiagram(d);
      expect(getDiagram('special-chars')?.name).toBe(specialName);
    });

    it('saves and retrieves a diagram with XML containing special characters', () => {
      const specialXml = '<xml attr="value&amp;more">Ünïcödé &lt;content&gt;</xml>';
      const d = makeDiagram({ id: 'special-xml', xml: specialXml });
      saveDiagram(d);
      expect(getDiagram('special-xml')?.xml).toBe(specialXml);
    });

    it('handles saving many diagrams sequentially', () => {
      for (let i = 0; i < 50; i++) {
        saveDiagram(makeDiagram({ id: `batch-${i}`, name: `Diagram ${i}` }));
      }
      expect(listDiagrams()).toHaveLength(50);
      expect(getDiagram('batch-0')?.name).toBe('Diagram 0');
      expect(getDiagram('batch-49')?.name).toBe('Diagram 49');
    });

    it('handles deleting all diagrams one by one', () => {
      saveDiagram(makeDiagram({ id: 'x' }));
      saveDiagram(makeDiagram({ id: 'y' }));
      saveDiagram(makeDiagram({ id: 'z' }));
      deleteDiagram('x');
      deleteDiagram('y');
      deleteDiagram('z');
      expect(listDiagrams()).toHaveLength(0);
    });

    it('returns empty array when localStorage has empty string', () => {
      localStorage.setItem('bpmn-diagrams', '');
      expect(listDiagrams()).toEqual([]);
    });

    it('returns empty array and logs error when localStorage contains JSON null', () => {
      localStorage.setItem('bpmn-diagrams', 'null');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(listDiagrams()).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Diagram storage is corrupted: expected an array');
      consoleSpy.mockRestore();
    });

    it('handles rapid save-update cycles on the same diagram', () => {
      for (let i = 0; i < 20; i++) {
        saveDiagram(makeDiagram({ id: 'rapid', name: `Version ${i}`, updatedAt: new Date(2024, 0, 1, 0, 0, i).toISOString() }));
      }
      expect(listDiagrams()).toHaveLength(1);
      expect(getDiagram('rapid')?.name).toBe('Version 19');
    });

    it('sorts diagrams correctly when timestamps are identical', () => {
      const sameTime = '2024-03-15T12:00:00.000Z';
      saveDiagram(makeDiagram({ id: 'same-1', name: 'First', updatedAt: sameTime }));
      saveDiagram(makeDiagram({ id: 'same-2', name: 'Second', updatedAt: sameTime }));
      const list = listDiagrams();
      expect(list).toHaveLength(2);
      // Both should be present, order is stable but not guaranteed
      const ids = list.map((d) => d.id);
      expect(ids).toContain('same-1');
      expect(ids).toContain('same-2');
    });
  });
});
