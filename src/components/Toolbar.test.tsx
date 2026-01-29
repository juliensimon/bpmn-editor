import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toolbar } from './Toolbar';
import type { BpmnEditorApi } from './BpmnEditor';

function createMockApi(overrides: Partial<BpmnEditorApi> = {}): BpmnEditorApi {
  return {
    exportXml: vi.fn().mockResolvedValue('<xml/>'),
    exportSvg: vi.fn().mockResolvedValue('<svg/>'),
    getCommandStack: vi.fn().mockReturnValue({
      undo: vi.fn(),
      redo: vi.fn(),
      canUndo: vi.fn().mockReturnValue(true),
      canRedo: vi.fn().mockReturnValue(true),
    }),
    ...overrides,
  };
}

describe('Toolbar', () => {
  const defaultProps = {
    editorApi: null as BpmnEditorApi | null,
    currentDiagramName: null as string | null,
    onNew: vi.fn(),
    onSave: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all toolbar buttons', () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByText('+ New')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
    expect(screen.getByText('Undo')).toBeInTheDocument();
    expect(screen.getByText('Redo')).toBeInTheDocument();
  });

  it('does not display diagram name when null', () => {
    const { container } = render(<Toolbar {...defaultProps} currentDiagramName={null} />);
    expect(container.querySelector('.toolbar-diagram-name')).not.toBeInTheDocument();
  });

  it('displays diagram name when provided', () => {
    render(<Toolbar {...defaultProps} currentDiagramName="My Process" />);
    expect(screen.getByText('My Process')).toBeInTheDocument();
  });

  it('calls onNew when New button is clicked', async () => {
    const onNew = vi.fn();
    render(<Toolbar {...defaultProps} onNew={onNew} />);
    await userEvent.click(screen.getByText('+ New'));
    expect(onNew).toHaveBeenCalledOnce();
  });

  it('calls onSave when Save button is clicked', async () => {
    const onSave = vi.fn();
    render(<Toolbar {...defaultProps} onSave={onSave} />);
    await userEvent.click(screen.getByText('Save'));
    expect(onSave).toHaveBeenCalledOnce();
  });

  describe('Undo/Redo', () => {
    it('calls commandStack.undo when Undo is clicked', async () => {
      const api = createMockApi();
      render(<Toolbar {...defaultProps} editorApi={api} />);
      await userEvent.click(screen.getByText('Undo'));
      const cs = api.getCommandStack();
      expect(cs!.undo).toHaveBeenCalledOnce();
    });

    it('calls commandStack.redo when Redo is clicked', async () => {
      const api = createMockApi();
      render(<Toolbar {...defaultProps} editorApi={api} />);
      await userEvent.click(screen.getByText('Redo'));
      const cs = api.getCommandStack();
      expect(cs!.redo).toHaveBeenCalledOnce();
    });

    it('does not throw when editorApi is null and Undo is clicked', async () => {
      render(<Toolbar {...defaultProps} editorApi={null} />);
      await expect(userEvent.click(screen.getByText('Undo'))).resolves.not.toThrow();
    });

    it('does not throw when editorApi is null and Redo is clicked', async () => {
      render(<Toolbar {...defaultProps} editorApi={null} />);
      await expect(userEvent.click(screen.getByText('Redo'))).resolves.not.toThrow();
    });
  });

  describe('Download', () => {
    it('calls exportXml and creates download when clicked', async () => {
      const api = createMockApi();
      const createObjectURL = vi.fn().mockReturnValue('blob:test');
      const revokeObjectURL = vi.fn();
      vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });

      const clickSpy = vi.fn();
      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'a') {
          return { click: clickSpy, href: '', download: '' } as unknown as HTMLElement;
        }
        return document.createElementNS('http://www.w3.org/1999/xhtml', tag);
      });

      render(<Toolbar {...defaultProps} editorApi={api} currentDiagramName="MyDiagram" />);
      await userEvent.click(screen.getByText('Download'));

      expect(api.exportXml).toHaveBeenCalledOnce();
      expect(createObjectURL).toHaveBeenCalledOnce();
      expect(clickSpy).toHaveBeenCalledOnce();
      expect(revokeObjectURL).toHaveBeenCalledOnce();

      vi.restoreAllMocks();
    });

    it('does nothing when editorApi is null', async () => {
      render(<Toolbar {...defaultProps} editorApi={null} />);
      // Should not throw
      await expect(userEvent.click(screen.getByText('Download'))).resolves.not.toThrow();
    });

    it('does nothing when exportXml returns null', async () => {
      const api = createMockApi({ exportXml: vi.fn().mockResolvedValue(null) });
      const createObjectURL = vi.fn();
      vi.stubGlobal('URL', { createObjectURL, revokeObjectURL: vi.fn() });

      render(<Toolbar {...defaultProps} editorApi={api} />);
      await userEvent.click(screen.getByText('Download'));

      expect(createObjectURL).not.toHaveBeenCalled();
      vi.restoreAllMocks();
    });

    it('uses "diagram" as default filename when currentDiagramName is null', async () => {
      const api = createMockApi();
      vi.stubGlobal('URL', { createObjectURL: vi.fn().mockReturnValue('blob:x'), revokeObjectURL: vi.fn() });

      let downloadName = '';
      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'a') {
          const el = { click: vi.fn(), href: '', download: '' };
          Object.defineProperty(el, 'download', {
            set(v: string) { downloadName = v; },
            get() { return downloadName; },
          });
          return el as unknown as HTMLElement;
        }
        return document.createElementNS('http://www.w3.org/1999/xhtml', tag);
      });

      render(<Toolbar {...defaultProps} editorApi={api} currentDiagramName={null} />);
      await userEvent.click(screen.getByText('Download'));

      expect(downloadName).toBe('diagram.bpmn');
      vi.restoreAllMocks();
    });
  });

  it('buttons have correct title attributes for accessibility', () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByTitle('New Diagram')).toBeInTheDocument();
    expect(screen.getByTitle('Save Diagram')).toBeInTheDocument();
    expect(screen.getByTitle('Download .bpmn file')).toBeInTheDocument();
    expect(screen.getByTitle('Undo (Ctrl+Z)')).toBeInTheDocument();
    expect(screen.getByTitle('Redo (Ctrl+Shift+Z)')).toBeInTheDocument();
  });

  describe('Download with special characters', () => {
    it('uses diagram name with special characters as filename', async () => {
      const api = createMockApi();
      vi.stubGlobal('URL', { createObjectURL: vi.fn().mockReturnValue('blob:x'), revokeObjectURL: vi.fn() });

      let downloadName = '';
      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'a') {
          const el = { click: vi.fn(), href: '', download: '' };
          Object.defineProperty(el, 'download', {
            set(v: string) { downloadName = v; },
            get() { return downloadName; },
          });
          return el as unknown as HTMLElement;
        }
        return document.createElementNS('http://www.w3.org/1999/xhtml', tag);
      });

      render(<Toolbar {...defaultProps} editorApi={api} currentDiagramName="My Diagram <v2> & (final)" />);
      await userEvent.click(screen.getByText('Download'));

      expect(downloadName).toBe('My Diagram <v2> & (final).bpmn');
      vi.restoreAllMocks();
    });

    it('uses diagram name with unicode characters as filename', async () => {
      const api = createMockApi();
      vi.stubGlobal('URL', { createObjectURL: vi.fn().mockReturnValue('blob:x'), revokeObjectURL: vi.fn() });

      let downloadName = '';
      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'a') {
          const el = { click: vi.fn(), href: '', download: '' };
          Object.defineProperty(el, 'download', {
            set(v: string) { downloadName = v; },
            get() { return downloadName; },
          });
          return el as unknown as HTMLElement;
        }
        return document.createElementNS('http://www.w3.org/1999/xhtml', tag);
      });

      render(<Toolbar {...defaultProps} editorApi={api} currentDiagramName="Diagramm Ünïcödé" />);
      await userEvent.click(screen.getByText('Download'));

      expect(downloadName).toBe('Diagramm Ünïcödé.bpmn');
      vi.restoreAllMocks();
    });
  });

  describe('Multiple rapid clicks', () => {
    it('calls onNew multiple times for rapid clicks', async () => {
      const onNew = vi.fn();
      render(<Toolbar {...defaultProps} onNew={onNew} />);
      await userEvent.click(screen.getByText('+ New'));
      await userEvent.click(screen.getByText('+ New'));
      await userEvent.click(screen.getByText('+ New'));
      expect(onNew).toHaveBeenCalledTimes(3);
    });

    it('calls onSave multiple times for rapid clicks', async () => {
      const onSave = vi.fn();
      render(<Toolbar {...defaultProps} onSave={onSave} />);
      await userEvent.click(screen.getByText('Save'));
      await userEvent.click(screen.getByText('Save'));
      expect(onSave).toHaveBeenCalledTimes(2);
    });

    it('calls exportXml for each rapid download click', async () => {
      const api = createMockApi();
      vi.stubGlobal('URL', { createObjectURL: vi.fn().mockReturnValue('blob:x'), revokeObjectURL: vi.fn() });
      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'a') {
          return { click: vi.fn(), href: '', download: '' } as unknown as HTMLElement;
        }
        return document.createElementNS('http://www.w3.org/1999/xhtml', tag);
      });

      render(<Toolbar {...defaultProps} editorApi={api} currentDiagramName="Test" />);
      await userEvent.click(screen.getByText('Download'));
      await userEvent.click(screen.getByText('Download'));

      expect(api.exportXml).toHaveBeenCalledTimes(2);
      vi.restoreAllMocks();
    });
  });

  it('displays diagram name with special characters', () => {
    render(<Toolbar {...defaultProps} currentDiagramName='<Script>&"Alert"' />);
    expect(screen.getByText('<Script>&"Alert"')).toBeInTheDocument();
  });
});
