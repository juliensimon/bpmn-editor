import { useState, useCallback, useRef, useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { DiagramList } from './components/DiagramList';
import { BpmnEditor, type BpmnEditorApi } from './components/BpmnEditor';
import {
  getDiagram,
  saveDiagram,
  deleteDiagram,
  getCurrentDiagramId,
  setCurrentDiagramId,
  listDiagrams,
} from './services/diagramStorage';
import { EMPTY_DIAGRAM_XML } from './constants/emptyDiagram';
import './App.css';

export default function App() {
  const [currentId, setCurrentId] = useState<string | null>(getCurrentDiagramId);
  const [xml, setXml] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);
  const editorApiRef = useRef<BpmnEditorApi | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (currentId) {
      const diagram = getDiagram(currentId);
      if (diagram) {
        setXml(diagram.xml);
      } else {
        setCurrentId(null);
        setCurrentDiagramId(null);
      }
    }
  }, [currentId]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const saveCurrentDiagram = useCallback(async (): Promise<void> => {
    if (!currentId || !editorApiRef.current) return;
    try {
      const exportedXml = await editorApiRef.current.exportXml();
      if (!exportedXml) return;
      const diagram = getDiagram(currentId);
      if (!diagram) return;
      saveDiagram({
        ...diagram,
        xml: exportedXml,
        updatedAt: new Date().toISOString(),
      });
      setRefreshKey((k) => k + 1);
    } catch (error) {
      console.error('Failed to save diagram:', error);
    }
  }, [currentId]);

  const handleNew = useCallback(() => {
    const id = crypto.randomUUID();
    const count = listDiagrams().length + 1;
    const now = new Date().toISOString();
    saveDiagram({
      id,
      name: `Diagram ${count}`,
      xml: EMPTY_DIAGRAM_XML,
      createdAt: now,
      updatedAt: now,
    });
    setCurrentDiagramId(id);
    setCurrentId(id);
    setXml(EMPTY_DIAGRAM_XML);
    setRefreshKey((k) => k + 1);
  }, []);

  const handleDiagramChanged = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveCurrentDiagram().catch((error: unknown) => {
        console.error('Auto-save failed:', error);
      });
    }, 500);
  }, [saveCurrentDiagram]);

  const handleSelect = useCallback((id: string) => {
    const diagram = getDiagram(id);
    if (!diagram) return;
    setCurrentDiagramId(id);
    setCurrentId(id);
    setXml(diagram.xml);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      deleteDiagram(id);
      if (id === currentId) {
        setCurrentId(null);
        setCurrentDiagramId(null);
        setXml('');
      }
      setRefreshKey((k) => k + 1);
    },
    [currentId]
  );

  const handleEditorReady = useCallback((api: BpmnEditorApi) => {
    editorApiRef.current = api;
  }, []);

  const currentDiagram = currentId ? getDiagram(currentId) : null;

  return (
    <div className="app">
      <Toolbar
        editorApi={editorApiRef.current}
        currentDiagramName={currentDiagram?.name ?? null}
        onNew={handleNew}
        onSave={saveCurrentDiagram}
      />
      <div className="app-body">
        <DiagramList
          currentId={currentId}
          refreshKey={refreshKey}
          onSelect={handleSelect}
          onDelete={handleDelete}
        />
        {currentId && xml ? (
          <BpmnEditor
            xml={xml}
            onDiagramChanged={handleDiagramChanged}
            onReady={handleEditorReady}
          />
        ) : (
          <div className="app-empty">
            Create a new diagram or select one from the sidebar.
          </div>
        )}
      </div>
    </div>
  );
}
