import { useEffect, useRef, useCallback, useState } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';

interface UseBpmnModelerOptions {
  container: HTMLElement | null;
  propertiesPanel: HTMLElement | null;
  xml: string;
  onChanged?: () => void;
}

export function useBpmnModeler({
  container,
  propertiesPanel,
  xml,
  onChanged,
}: UseBpmnModelerOptions) {
  const modelerRef = useRef<BpmnModeler | null>(null);
  const onChangedRef = useRef(onChanged);
  onChangedRef.current = onChanged;
  const [modelerReady, setModelerReady] = useState(false);

  useEffect(() => {
    if (!container || !propertiesPanel) return;

    const modeler = new BpmnModeler({
      container,
      propertiesPanel: {
        parent: propertiesPanel,
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
      ],
    });

    modelerRef.current = modeler;
    setModelerReady(true);

    modeler.on('commandStack.changed', () => {
      onChangedRef.current?.();
    });

    return () => {
      modeler.destroy();
      modelerRef.current = null;
      setModelerReady(false);
    };
  }, [container, propertiesPanel]);

  useEffect(() => {
    if (!modelerReady || !xml || !modelerRef.current) return;
    let cancelled = false;
    modelerRef.current.importXML(xml).catch((error: unknown) => {
      if (!cancelled) console.error('Failed to import XML:', error);
    });
    return () => { cancelled = true; };
  }, [modelerReady, xml]);

  const exportXml = useCallback(async (): Promise<string | null> => {
    const modeler = modelerRef.current;
    if (!modeler) return null;
    try {
      const { xml } = await modeler.saveXML({ format: true });
      return xml ?? null;
    } catch (error) {
      console.error('Failed to export XML:', error);
      return null;
    }
  }, []);

  const exportSvg = useCallback(async (): Promise<string | null> => {
    const modeler = modelerRef.current;
    if (!modeler) return null;
    try {
      const { svg } = await modeler.saveSVG();
      return svg ?? null;
    } catch (error) {
      console.error('Failed to export SVG:', error);
      return null;
    }
  }, []);

  const getCommandStack = useCallback(() => {
    const modeler = modelerRef.current;
    if (!modeler) return null;
    return modeler.get('commandStack') as {
      undo: () => void;
      redo: () => void;
      canUndo: () => boolean;
      canRedo: () => boolean;
    };
  }, []);

  return { exportXml, exportSvg, getCommandStack };
}
