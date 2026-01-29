import type { BpmnEditorApi } from './BpmnEditor';
import './Toolbar.css';

interface ToolbarProps {
  editorApi: BpmnEditorApi | null;
  currentDiagramName: string | null;
  onNew: () => void;
  onSave: () => void;
}

export function Toolbar({ editorApi, currentDiagramName, onNew, onSave }: ToolbarProps) {
  const handleDownload = async () => {
    if (!editorApi) return;
    const xml = await editorApi.exportXml();
    if (!xml) return;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentDiagramName ?? 'diagram'}.bpmn`;
      a.click();
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const handleUndo = () => {
    editorApi?.getCommandStack()?.undo();
  };

  const handleRedo = () => {
    editorApi?.getCommandStack()?.redo();
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button className="toolbar-btn" onClick={onNew} title="New Diagram">
          + New
        </button>
        <button className="toolbar-btn" onClick={onSave} title="Save Diagram">
          Save
        </button>
        <button className="toolbar-btn" onClick={handleDownload} title="Download .bpmn file">
          Download
        </button>
        <div className="toolbar-separator" />
        <button className="toolbar-btn" onClick={handleUndo} title="Undo (Ctrl+Z)">
          Undo
        </button>
        <button className="toolbar-btn" onClick={handleRedo} title="Redo (Ctrl+Shift+Z)">
          Redo
        </button>
      </div>
      <div className="toolbar-right">
        {currentDiagramName && (
          <span className="toolbar-diagram-name">{currentDiagramName}</span>
        )}
      </div>
    </div>
  );
}
