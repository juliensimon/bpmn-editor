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
    expect(screen.getByText('PNG')).toBeInTheDocument();
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
    expect(screen.getByTitle('Download .png image')).toBeInTheDocument();
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

  describe('PNG Download', () => {
    const mockSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300"/></svg>';

    function setupCanvasMocks() {
      const drawImage = vi.fn();
      const scaleFn = vi.fn();
      const mockCtx = { drawImage, scale: scaleFn } as unknown as CanvasRenderingContext2D;
      const toBlobFn = vi.fn((cb: BlobCallback) => cb(new Blob(['png'], { type: 'image/png' })));

      const createObjectURL = vi.fn().mockReturnValue('blob:test');
      const revokeObjectURL = vi.fn();
      vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });

      let capturedCanvas: Partial<HTMLCanvasElement> | null = null;
      const clickSpy = vi.fn();
      let downloadName = '';

      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'canvas') {
          capturedCanvas = {
            width: 0,
            height: 0,
            getContext: vi.fn().mockReturnValue(mockCtx),
            toBlob: toBlobFn,
          };
          return capturedCanvas as unknown as HTMLCanvasElement;
        }
        if (tag === 'a') {
          const el = { click: clickSpy, href: '' };
          Object.defineProperty(el, 'download', {
            set(v: string) { downloadName = v; },
            get() { return downloadName; },
          });
          return el as unknown as HTMLAnchorElement;
        }
        return document.createElementNS('http://www.w3.org/1999/xhtml', tag);
      });

      return { drawImage, scaleFn, mockCtx, toBlobFn, createObjectURL, revokeObjectURL, clickSpy, getDownloadName: () => downloadName, getCanvas: () => capturedCanvas };
    }

    // jsdom doesn't fire img.onload, so we patch Image to trigger it
    function patchImage() {
      const OrigImage = globalThis.Image;
      class FakeImage extends OrigImage {
        constructor() {
          super();
          setTimeout(() => { if (this.onload) (this.onload as () => void).call(this); }, 0);
        }
      }
      vi.stubGlobal('Image', FakeImage);
    }

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('exports SVG and downloads a PNG file', async () => {
      const api = createMockApi({ exportSvg: vi.fn().mockResolvedValue(mockSvg) });
      patchImage();
      const { clickSpy, getDownloadName, createObjectURL, revokeObjectURL, scaleFn, drawImage } = setupCanvasMocks();

      render(<Toolbar {...defaultProps} editorApi={api} currentDiagramName="MyProcess" />);
      await userEvent.click(screen.getByText('PNG'));

      // wait for the async img.onload + toBlob chain
      await vi.waitFor(() => expect(clickSpy).toHaveBeenCalledOnce());

      expect(api.exportSvg).toHaveBeenCalledOnce();
      expect(scaleFn).toHaveBeenCalledWith(2, 2);
      expect(drawImage).toHaveBeenCalledOnce();
      expect(getDownloadName()).toBe('MyProcess.png');
      // createObjectURL called for SVG blob and PNG blob
      expect(createObjectURL).toHaveBeenCalledTimes(2);
      // revokeObjectURL called for SVG blob and PNG blob
      expect(revokeObjectURL).toHaveBeenCalledTimes(2);
    });

    it('uses "diagram" as default filename when name is null', async () => {
      const api = createMockApi({ exportSvg: vi.fn().mockResolvedValue(mockSvg) });
      patchImage();
      const { clickSpy, getDownloadName } = setupCanvasMocks();

      render(<Toolbar {...defaultProps} editorApi={api} currentDiagramName={null} />);
      await userEvent.click(screen.getByText('PNG'));
      await vi.waitFor(() => expect(clickSpy).toHaveBeenCalledOnce());

      expect(getDownloadName()).toBe('diagram.png');
    });

    it('does nothing when editorApi is null', async () => {
      render(<Toolbar {...defaultProps} editorApi={null} />);
      await expect(userEvent.click(screen.getByText('PNG'))).resolves.not.toThrow();
    });

    it('does nothing when exportSvg returns null', async () => {
      const api = createMockApi({ exportSvg: vi.fn().mockResolvedValue(null) });
      const createObjectURL = vi.fn();
      vi.stubGlobal('URL', { createObjectURL, revokeObjectURL: vi.fn() });

      render(<Toolbar {...defaultProps} editorApi={api} />);
      await userEvent.click(screen.getByText('PNG'));

      expect(createObjectURL).not.toHaveBeenCalled();
      vi.restoreAllMocks();
    });
  });

  it('displays diagram name with special characters', () => {
    render(<Toolbar {...defaultProps} currentDiagramName='<Script>&"Alert"' />);
    expect(screen.getByText('<Script>&"Alert"')).toBeInTheDocument();
  });
});
