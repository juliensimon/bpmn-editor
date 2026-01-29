import { useEffect, useState } from 'react';
import { listDiagrams, type SavedDiagram } from '../services/diagramStorage';
import { EXAMPLE_WORKFLOWS } from '../constants/exampleWorkflows';
import './DiagramList.css';

interface DiagramListProps {
  currentId: string | null;
  refreshKey: number;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onLoadExample?: (name: string, xml: string) => void;
}

export function DiagramList({ currentId, refreshKey, onSelect, onDelete, onLoadExample }: DiagramListProps) {
  const [diagrams, setDiagrams] = useState<SavedDiagram[]>([]);
  const [examplesOpen, setExamplesOpen] = useState(true);

  useEffect(() => {
    setDiagrams(listDiagrams());
  }, [refreshKey]);

  return (
    <div className="diagram-list">
      <div className="diagram-list-header">Diagrams</div>
      <div className="diagram-list-items">
        {diagrams.length === 0 && (
          <div className="diagram-list-empty">No diagrams yet</div>
        )}
        {diagrams.map((d) => (
          <div
            key={d.id}
            className={`diagram-list-item ${d.id === currentId ? 'active' : ''}`}
            onClick={() => onSelect(d.id)}
          >
            <span className="diagram-list-item-name">{d.name}</span>
            <button
              className="diagram-list-item-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(d.id);
              }}
              title="Delete diagram"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="diagram-list-examples">
        <button
          className="diagram-list-examples-header"
          onClick={() => setExamplesOpen((o) => !o)}
        >
          <span className={`diagram-list-examples-arrow ${examplesOpen ? 'open' : ''}`}>▶</span>
          Examples
        </button>
        {examplesOpen && (
          <div className="diagram-list-examples-items">
            {EXAMPLE_WORKFLOWS.map((ex) => (
              <button
                key={ex.name}
                className="diagram-list-example-item"
                onClick={() => onLoadExample?.(ex.name, ex.xml)}
                title={ex.description}
              >
                {ex.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
