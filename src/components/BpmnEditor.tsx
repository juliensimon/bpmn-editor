import { useState, useEffect } from 'react';
import { useBpmnModeler } from '../hooks/useBpmnModeler';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import '@bpmn-io/properties-panel/dist/assets/properties-panel.css';
import './BpmnEditor.css';

interface BpmnEditorProps {
  xml: string;
  onDiagramChanged: () => void;
  onReady: (api: BpmnEditorApi) => void;
}

export interface BpmnEditorApi {
  exportXml: () => Promise<string | null>;
  exportSvg: () => Promise<string | null>;
  getCommandStack: () => {
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
  } | null;
}

export function BpmnEditor({ xml, onDiagramChanged, onReady }: BpmnEditorProps) {
  const [canvasEl, setCanvasEl] = useState<HTMLDivElement | null>(null);
  const [panelEl, setPanelEl] = useState<HTMLDivElement | null>(null);

  const { exportXml, exportSvg, getCommandStack } = useBpmnModeler({
    container: canvasEl,
    propertiesPanel: panelEl,
    xml,
    onChanged: onDiagramChanged,
  });

  useEffect(() => {
    onReady({ exportXml, exportSvg, getCommandStack });
  }, [exportXml, exportSvg, getCommandStack, onReady]);

  return (
    <div className="bpmn-editor">
      <div className="bpmn-canvas" ref={setCanvasEl} />
      <div className="bpmn-properties-panel" ref={setPanelEl} />
    </div>
  );
}
