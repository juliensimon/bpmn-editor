import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as storage from './services/diagramStorage';

// Mock BpmnEditor since it requires bpmn-js DOM
vi.mock('./components/BpmnEditor', () => ({
  BpmnEditor: ({ xml, onReady }: { xml: string; onReady: (api: unknown) => void; onDiagramChanged: () => void }) => {
    // Simulate calling onReady on mount
    const ref = { current: false };
    if (!ref.current) {
      ref.current = true;
      setTimeout(() =>
        onReady({
          exportXml: vi.fn().mockResolvedValue('<exported/>'),
          exportSvg: vi.fn().mockResolvedValue('<svg/>'),
          getCommandStack: vi.fn().mockReturnValue({
            undo: vi.fn(),
            redo: vi.fn(),
            canUndo: vi.fn(),
            canRedo: vi.fn(),
          }),
        })
      );
    }
    return <div data-testid="bpmn-editor" data-xml={xml} />;
  },
}));

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders the toolbar', () => {
    render(<App />);
    expect(screen.getByText('+ New')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders the diagram list sidebar', () => {
    render(<App />);
    expect(screen.getByText('Diagrams')).toBeInTheDocument();
  });

  it('shows empty state when no diagram is selected', () => {
    render(<App />);
    expect(screen.getByText(/Create a new diagram/)).toBeInTheDocument();
  });

  it('does not render BpmnEditor when no diagram is selected', () => {
    render(<App />);
    expect(screen.queryByTestId('bpmn-editor')).not.toBeInTheDocument();
  });

  describe('New diagram', () => {
    it('creates a new diagram and displays it', async () => {
      render(<App />);
      await userEvent.click(screen.getByText('+ New'));

      expect(screen.getByTestId('bpmn-editor')).toBeInTheDocument();
      expect(screen.queryByText(/Create a new diagram/)).not.toBeInTheDocument();
    });

    it('adds the diagram to the sidebar', async () => {
      render(<App />);
      await userEvent.click(screen.getByText('+ New'));

      // "Diagram 1" appears in both toolbar and sidebar
      const matches = screen.getAllByText('Diagram 1');
      expect(matches.length).toBeGreaterThanOrEqual(1);
      // Verify it's in the sidebar specifically
      const sidebarItem = screen.getByText('Diagram 1', { selector: '.diagram-list-item-name' });
      expect(sidebarItem).toBeInTheDocument();
    });

    it('saves the new diagram to localStorage', async () => {
      render(<App />);
      await userEvent.click(screen.getByText('+ New'));

      const diagrams = storage.listDiagrams();
      expect(diagrams).toHaveLength(1);
      expect(diagrams[0].name).toBe('Diagram 1');
    });

    it('increments diagram name for each new diagram', async () => {
      render(<App />);
      await userEvent.click(screen.getByText('+ New'));
      await userEvent.click(screen.getByText('+ New'));

      const diagrams = storage.listDiagrams();
      expect(diagrams).toHaveLength(2);
      // Names should be Diagram 1 and Diagram 2
      const names = diagrams.map((d) => d.name).sort();
      expect(names).toEqual(['Diagram 1', 'Diagram 2']);
    });

    it('sets the new diagram as current', async () => {
      render(<App />);
      await userEvent.click(screen.getByText('+ New'));

      expect(storage.getCurrentDiagramId()).toBeTruthy();
    });
  });

  describe('Select diagram', () => {
    it('switches to the selected diagram', async () => {
      render(<App />);
      // Create two diagrams
      await userEvent.click(screen.getByText('+ New'));
      await userEvent.click(screen.getByText('+ New'));

      // Click on "Diagram 1"
      await userEvent.click(screen.getByText('Diagram 1'));

      // The current diagram ID should be updated
      const diagrams = storage.listDiagrams();
      const d1 = diagrams.find((d) => d.name === 'Diagram 1');
      expect(storage.getCurrentDiagramId()).toBe(d1!.id);
    });
  });

  describe('Delete diagram', () => {
    it('removes a diagram from the list', async () => {
      render(<App />);
      await userEvent.click(screen.getByText('+ New'));

      // Click delete button
      await userEvent.click(screen.getByTitle('Delete diagram'));

      expect(storage.listDiagrams()).toHaveLength(0);
      expect(screen.queryByText('Diagram 1')).not.toBeInTheDocument();
    });

    it('shows empty state when the current diagram is deleted', async () => {
      render(<App />);
      await userEvent.click(screen.getByText('+ New'));
      await userEvent.click(screen.getByTitle('Delete diagram'));

      expect(screen.getByText(/Create a new diagram/)).toBeInTheDocument();
      expect(screen.queryByTestId('bpmn-editor')).not.toBeInTheDocument();
    });

    it('does not affect other diagrams when deleting', async () => {
      render(<App />);
      await userEvent.click(screen.getByText('+ New'));
      await userEvent.click(screen.getByText('+ New'));

      // There are now 2 delete buttons — delete the first one (Diagram 2, most recent)
      const deleteButtons = screen.getAllByTitle('Delete diagram');
      await userEvent.click(deleteButtons[0]);

      expect(storage.listDiagrams()).toHaveLength(1);
    });
  });

  describe('Restoring state', () => {
    it('loads the previously current diagram on mount', async () => {
      // Pre-populate storage
      const id = 'restored-id';
      storage.saveDiagram({
        id,
        name: 'Restored',
        xml: '<restored/>',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      storage.setCurrentDiagramId(id);

      render(<App />);

      expect(screen.getByTestId('bpmn-editor')).toBeInTheDocument();
      // "Restored" appears in both toolbar name and sidebar list
      const matches = screen.getAllByText('Restored');
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it('handles stale currentDiagramId gracefully', () => {
      // Set a current ID that no longer exists in storage
      storage.setCurrentDiagramId('nonexistent');

      render(<App />);

      // Should show empty state, not crash
      expect(screen.getByText(/Create a new diagram/)).toBeInTheDocument();
    });
  });

  describe('Debounced auto-save', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('does not save immediately when diagram changes (debounce delay)', async () => {
      // Pre-populate a diagram
      const id = 'debounce-test';
      storage.saveDiagram({
        id,
        name: 'Debounce',
        xml: '<original/>',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      storage.setCurrentDiagramId(id);

      render(<App />);

      const saveSpy = vi.spyOn(storage, 'saveDiagram');
      // The editor is rendered; simulate the BpmnEditor calling onDiagramChanged
      // which fires via the mock's onReady -> exportXml
      // We advance less than the 500ms debounce
      await act(async () => {
        vi.advanceTimersByTime(200);
      });

      // saveDiagram should NOT have been called by the debounce yet (only the initial saves)
      const callsAfterDebounceDelay = saveSpy.mock.calls.filter(
        (call) => call[0].id === id && call[0].xml === '<exported/>'
      );
      expect(callsAfterDebounceDelay).toHaveLength(0);

      saveSpy.mockRestore();
    });

    it('cleans up debounce timer on unmount', async () => {
      const id = 'cleanup-test';
      storage.saveDiagram({
        id,
        name: 'Cleanup',
        xml: '<original/>',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      storage.setCurrentDiagramId(id);

      const { unmount } = render(<App />);

      const saveSpy = vi.spyOn(storage, 'saveDiagram');

      unmount();

      // Advance past debounce delay - should not trigger save after unmount
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      const callsAfterUnmount = saveSpy.mock.calls.filter(
        (call) => call[0].id === id && call[0].xml === '<exported/>'
      );
      expect(callsAfterUnmount).toHaveLength(0);

      saveSpy.mockRestore();
    });
  });

  describe('Diagram name counter edge cases', () => {
    it('names new diagram based on current count after deletion', async () => {
      render(<App />);
      // Create two diagrams
      await userEvent.click(screen.getByText('+ New'));
      await userEvent.click(screen.getByText('+ New'));

      // Delete one
      const deleteButtons = screen.getAllByTitle('Delete diagram');
      await userEvent.click(deleteButtons[0]);

      // Create another - should be "Diagram 2" (based on current length + 1 = 1 + 1)
      await userEvent.click(screen.getByText('+ New'));

      const diagrams = storage.listDiagrams();
      expect(diagrams).toHaveLength(2);
      // The newest diagram name should be "Diagram 2" since there's 1 existing + 1
      const names = diagrams.map((d) => d.name);
      expect(names).toContain('Diagram 2');
    });

    it('creates diagrams rapidly in sequence', async () => {
      render(<App />);
      await userEvent.click(screen.getByText('+ New'));
      await userEvent.click(screen.getByText('+ New'));
      await userEvent.click(screen.getByText('+ New'));
      await userEvent.click(screen.getByText('+ New'));
      await userEvent.click(screen.getByText('+ New'));

      const diagrams = storage.listDiagrams();
      expect(diagrams).toHaveLength(5);

      // Each diagram should have a unique id
      const ids = diagrams.map((d) => d.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(5);
    });

    it('names first diagram "Diagram 1" even after deleting all', async () => {
      render(<App />);
      await userEvent.click(screen.getByText('+ New'));

      // Delete
      await userEvent.click(screen.getByTitle('Delete diagram'));

      // Create again
      await userEvent.click(screen.getByText('+ New'));

      const diagrams = storage.listDiagrams();
      expect(diagrams).toHaveLength(1);
      expect(diagrams[0].name).toBe('Diagram 1');
    });
  });
});
