import type { BpmnEditorApi } from './BpmnEditor';
import './Toolbar.css';

interface ToolbarProps {
  editorApi: BpmnEditorApi | null;
  currentDiagramName: string | null;
  onNew: () => void;
  onSave: () => void;
}

export function Toolbar({ editorApi, currentDiagramName, onNew, onSave }: ToolbarProps) {
  const handleDownloadPng = async () => {
    if (!editorApi) return;
    const svg = await editorApi.exportSvg();
    if (!svg) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const svgEl = doc.documentElement;

    const viewBox = svgEl.getAttribute('viewBox');
    let width = 800;
    let height = 600;
    if (viewBox) {
      const parts = viewBox.split(/[\s,]+/).map(Number);
      if (parts.length === 4) {
        width = parts[2];
        height = parts[3];
      }
    } else {
      const w = parseFloat(svgEl.getAttribute('width') ?? '');
      const h = parseFloat(svgEl.getAttribute('height') ?? '');
      if (w > 0) width = w;
      if (h > 0) height = h;
    }

    svgEl.setAttribute('width', String(width));
    svgEl.setAttribute('height', String(height));
    const serializedSvg = new XMLSerializer().serializeToString(svgEl);

    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);

    const img = new Image();
    const svgBlob = new Blob([serializedSvg], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    try {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          resolve();
        };
        img.onerror = () => reject(new Error('Failed to load SVG image'));
        img.src = svgUrl;
      });
    } finally {
      URL.revokeObjectURL(svgUrl);
    }

    const pngBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    );
    if (!pngBlob) return;

    const pngUrl = URL.createObjectURL(pngBlob);
    try {
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${currentDiagramName ?? 'diagram'}.png`;
      a.click();
    } finally {
      URL.revokeObjectURL(pngUrl);
    }
  };

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
        <button className="toolbar-btn" onClick={handleDownloadPng} title="Download .png image">
          PNG
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
