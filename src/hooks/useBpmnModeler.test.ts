import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const { mockModeler, mockCommandStack, fireCommandStackChanged, MockBpmnModeler } = vi.hoisted(() => {
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

  const MockBpmnModeler = vi.fn().mockImplementation(function () {
    return mockModeler;
  });

  return {
    mockModeler,
    mockCommandStack,
    fireCommandStackChanged: () => commandStackChangedHandlers.forEach((h) => h()),
    MockBpmnModeler,
  };
});

vi.mock('bpmn-js/lib/Modeler', () => ({
  default: MockBpmnModeler,
}));
vi.mock('bpmn-js-properties-panel', () => ({
  BpmnPropertiesPanelModule: {},
  BpmnPropertiesProviderModule: {},
}));

import { useBpmnModeler } from './useBpmnModeler';

describe('useBpmnModeler', () => {
  let container: HTMLDivElement;
  let propertiesPanel: HTMLDivElement;

  beforeEach(() => {
    vi.clearAllMocks();
    container = document.createElement('div');
    propertiesPanel = document.createElement('div');
    document.body.appendChild(container);
    document.body.appendChild(propertiesPanel);
  });

  it('does not create modeler when container is null', () => {
    renderHook(() =>
      useBpmnModeler({ container: null, propertiesPanel, xml: '', onChanged: vi.fn() })
    );
    expect(MockBpmnModeler).not.toHaveBeenCalled();
  });

  it('does not create modeler when propertiesPanel is null', () => {
    renderHook(() =>
      useBpmnModeler({ container, propertiesPanel: null, xml: '', onChanged: vi.fn() })
    );
    expect(MockBpmnModeler).not.toHaveBeenCalled();
  });

  it('creates modeler when both container and propertiesPanel are provided', () => {
    renderHook(() =>
      useBpmnModeler({ container, propertiesPanel, xml: '<xml/>', onChanged: vi.fn() })
    );
    expect(MockBpmnModeler).toHaveBeenCalledOnce();
  });

  it('passes container and propertiesPanel to BpmnModeler constructor', () => {
    renderHook(() =>
      useBpmnModeler({ container, propertiesPanel, xml: '<xml/>', onChanged: vi.fn() })
    );
    expect(MockBpmnModeler).toHaveBeenCalledWith(
      expect.objectContaining({
        container,
        propertiesPanel: { parent: propertiesPanel },
      })
    );
  });

  it('passes additionalModules to BpmnModeler constructor', () => {
    renderHook(() =>
      useBpmnModeler({ container, propertiesPanel, xml: '<xml/>', onChanged: vi.fn() })
    );
    expect(MockBpmnModeler).toHaveBeenCalledWith(
      expect.objectContaining({
        additionalModules: expect.any(Array),
      })
    );
  });

  it('destroys modeler on unmount', () => {
    const { unmount } = renderHook(() =>
      useBpmnModeler({ container, propertiesPanel, xml: '<xml/>', onChanged: vi.fn() })
    );
    unmount();
    expect(mockModeler.destroy).toHaveBeenCalled();
  });

  it('imports XML when modeler is ready and xml is provided', async () => {
    renderHook(() =>
      useBpmnModeler({ container, propertiesPanel, xml: '<bpmn/>', onChanged: vi.fn() })
    );

    await vi.waitFor(() => {
      expect(mockModeler.importXML).toHaveBeenCalledWith('<bpmn/>');
    });
  });

  it('does not import when xml is empty', () => {
    renderHook(() =>
      useBpmnModeler({ container, propertiesPanel, xml: '', onChanged: vi.fn() })
    );
    expect(mockModeler.importXML).not.toHaveBeenCalled();
  });

  it('re-imports when xml changes', async () => {
    const { rerender } = renderHook(
      ({ xml }) => useBpmnModeler({ container, propertiesPanel, xml, onChanged: vi.fn() }),
      { initialProps: { xml: '<first/>' } }
    );

    await vi.waitFor(() => {
      expect(mockModeler.importXML).toHaveBeenCalledWith('<first/>');
    });

    mockModeler.importXML.mockClear();
    rerender({ xml: '<second/>' });

    await vi.waitFor(() => {
      expect(mockModeler.importXML).toHaveBeenCalledWith('<second/>');
    });
  });

  it('registers a commandStack.changed listener', () => {
    renderHook(() =>
      useBpmnModeler({ container, propertiesPanel, xml: '<xml/>', onChanged: vi.fn() })
    );
    expect(mockModeler.on).toHaveBeenCalledWith('commandStack.changed', expect.any(Function));
  });

  it('calls onChanged when commandStack.changed fires', () => {
    const onChanged = vi.fn();
    renderHook(() =>
      useBpmnModeler({ container, propertiesPanel, xml: '<xml/>', onChanged })
    );

    act(() => fireCommandStackChanged());
    expect(onChanged).toHaveBeenCalledOnce();
  });

  it('uses latest onChanged callback without recreating modeler', () => {
    const first = vi.fn();
    const second = vi.fn();

    const { rerender } = renderHook(
      ({ onChanged }) => useBpmnModeler({ container, propertiesPanel, xml: '<xml/>', onChanged }),
      { initialProps: { onChanged: first } }
    );

    rerender({ onChanged: second });
    act(() => fireCommandStackChanged());

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledOnce();
  });

  it('does not throw when onChanged is undefined', () => {
    renderHook(() =>
      useBpmnModeler({ container, propertiesPanel, xml: '<xml/>' })
    );

    expect(() => act(() => fireCommandStackChanged())).not.toThrow();
  });

  describe('exportXml', () => {
    it('returns xml from modeler.saveXML', async () => {
      mockModeler.saveXML.mockResolvedValue({ xml: '<exported/>' });

      const { result } = renderHook(() =>
        useBpmnModeler({ container, propertiesPanel, xml: '<xml/>', onChanged: vi.fn() })
      );

      const xml = await result.current.exportXml();
      expect(xml).toBe('<exported/>');
    });

    it('returns null when saveXML returns undefined xml', async () => {
      mockModeler.saveXML.mockResolvedValue({ xml: undefined });

      const { result } = renderHook(() =>
        useBpmnModeler({ container, propertiesPanel, xml: '<xml/>', onChanged: vi.fn() })
      );

      const xml = await result.current.exportXml();
      expect(xml).toBeNull();
    });

    it('returns null when modeler is not available', async () => {
      const { result } = renderHook(() =>
        useBpmnModeler({ container: null, propertiesPanel: null, xml: '', onChanged: vi.fn() })
      );

      const xml = await result.current.exportXml();
      expect(xml).toBeNull();
    });
  });

  describe('exportSvg', () => {
    it('returns svg from modeler.saveSVG', async () => {
      mockModeler.saveSVG.mockResolvedValue({ svg: '<svg>test</svg>' });

      const { result } = renderHook(() =>
        useBpmnModeler({ container, propertiesPanel, xml: '<xml/>', onChanged: vi.fn() })
      );

      const svg = await result.current.exportSvg();
      expect(svg).toBe('<svg>test</svg>');
    });

    it('returns null when saveSVG returns undefined svg', async () => {
      mockModeler.saveSVG.mockResolvedValue({ svg: undefined });

      const { result } = renderHook(() =>
        useBpmnModeler({ container, propertiesPanel, xml: '<xml/>', onChanged: vi.fn() })
      );

      const svg = await result.current.exportSvg();
      expect(svg).toBeNull();
    });

    it('returns null when modeler is not available', async () => {
      const { result } = renderHook(() =>
        useBpmnModeler({ container: null, propertiesPanel: null, xml: '', onChanged: vi.fn() })
      );

      const svg = await result.current.exportSvg();
      expect(svg).toBeNull();
    });
  });

  describe('getCommandStack', () => {
    it('returns command stack from modeler', () => {
      const { result } = renderHook(() =>
        useBpmnModeler({ container, propertiesPanel, xml: '<xml/>', onChanged: vi.fn() })
      );

      const cs = result.current.getCommandStack();
      expect(cs).toBe(mockCommandStack);
    });

    it('returns null when modeler is not available', () => {
      const { result } = renderHook(() =>
        useBpmnModeler({ container: null, propertiesPanel: null, xml: '', onChanged: vi.fn() })
      );

      expect(result.current.getCommandStack()).toBeNull();
    });
  });

  describe('importXML rejection handling', () => {
    it('logs error when importXML rejects', async () => {
      mockModeler.importXML.mockRejectedValueOnce(new Error('parse error'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      renderHook(() =>
        useBpmnModeler({ container, propertiesPanel, xml: '<bad-xml/>', onChanged: vi.fn() })
      );

      await vi.waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to import XML:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    it('does not log error after cleanup when importXML rejects late', async () => {
      // Create a deferred promise so we can control when importXML resolves
      let rejectFn: (reason: Error) => void;
      mockModeler.importXML.mockImplementationOnce(
        () => new Promise((_, reject) => { rejectFn = reject; })
      );
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { unmount } = renderHook(() =>
        useBpmnModeler({ container, propertiesPanel, xml: '<late/>', onChanged: vi.fn() })
      );

      // Unmount sets cancelled=true
      unmount();

      // Now reject after cleanup
      await act(async () => {
        rejectFn!(new Error('late error'));
      });

      // Should NOT log because cancelled=true
      expect(consoleSpy).not.toHaveBeenCalledWith('Failed to import XML');

      consoleSpy.mockRestore();
    });
  });

  describe('modeler recreation', () => {
    it('destroys and recreates modeler when container changes', () => {
      const container2 = document.createElement('div');
      document.body.appendChild(container2);

      const { rerender } = renderHook(
        ({ cont }) => useBpmnModeler({ container: cont, propertiesPanel, xml: '<xml/>', onChanged: vi.fn() }),
        { initialProps: { cont: container } }
      );

      expect(MockBpmnModeler).toHaveBeenCalledTimes(1);
      expect(mockModeler.destroy).not.toHaveBeenCalled();

      rerender({ cont: container2 });

      // Should have destroyed old and created new
      expect(mockModeler.destroy).toHaveBeenCalled();
      expect(MockBpmnModeler).toHaveBeenCalledTimes(2);
    });

    it('destroys and recreates modeler when propertiesPanel changes', () => {
      const panel2 = document.createElement('div');
      document.body.appendChild(panel2);

      const { rerender } = renderHook(
        ({ panel }) => useBpmnModeler({ container, propertiesPanel: panel, xml: '<xml/>', onChanged: vi.fn() }),
        { initialProps: { panel: propertiesPanel } }
      );

      expect(MockBpmnModeler).toHaveBeenCalledTimes(1);

      rerender({ panel: panel2 });

      expect(mockModeler.destroy).toHaveBeenCalled();
      expect(MockBpmnModeler).toHaveBeenCalledTimes(2);
    });

    it('does not recreate modeler when only xml changes', () => {
      const { rerender } = renderHook(
        ({ xml }) => useBpmnModeler({ container, propertiesPanel, xml, onChanged: vi.fn() }),
        { initialProps: { xml: '<first/>' } }
      );

      expect(MockBpmnModeler).toHaveBeenCalledTimes(1);

      rerender({ xml: '<second/>' });

      // Modeler should NOT be recreated for xml change
      expect(MockBpmnModeler).toHaveBeenCalledTimes(1);
      expect(mockModeler.destroy).not.toHaveBeenCalled();
    });

    it('does not create modeler when transitioning from valid to null container', () => {
      const { rerender } = renderHook(
        ({ cont }) => useBpmnModeler({ container: cont, propertiesPanel, xml: '<xml/>', onChanged: vi.fn() }),
        { initialProps: { cont: container as HTMLDivElement | null } }
      );

      expect(MockBpmnModeler).toHaveBeenCalledTimes(1);

      rerender({ cont: null });

      // Old modeler destroyed
      expect(mockModeler.destroy).toHaveBeenCalled();
      // No new modeler created (only 1 total)
      expect(MockBpmnModeler).toHaveBeenCalledTimes(1);
    });
  });
});
