export interface SavedDiagram {
  id: string;
  name: string;
  xml: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'bpmn-diagrams';
const CURRENT_ID_KEY = 'bpmn-current-diagram-id';

function isValidDiagram(item: unknown): item is SavedDiagram {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof (item as SavedDiagram).id === 'string' &&
    typeof (item as SavedDiagram).name === 'string' &&
    typeof (item as SavedDiagram).xml === 'string' &&
    typeof (item as SavedDiagram).createdAt === 'string' &&
    typeof (item as SavedDiagram).updatedAt === 'string'
  );
}

function readAll(): SavedDiagram[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.error('Diagram storage is corrupted: expected an array');
      return [];
    }
    return parsed.filter((item) => {
      if (isValidDiagram(item)) return true;
      console.error('Skipping invalid diagram entry in storage:', item);
      return false;
    });
  } catch (error) {
    console.error('Failed to read diagrams from storage:', error);
    return [];
  }
}

function writeAll(diagrams: SavedDiagram[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
}

export function listDiagrams(): SavedDiagram[] {
  return readAll().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getDiagram(id: string): SavedDiagram | undefined {
  return readAll().find((d) => d.id === id);
}

export function saveDiagram(diagram: SavedDiagram): void {
  const all = readAll();
  const idx = all.findIndex((d) => d.id === diagram.id);
  if (idx >= 0) {
    all[idx] = diagram;
  } else {
    all.push(diagram);
  }
  writeAll(all);
}

export function deleteDiagram(id: string): void {
  writeAll(readAll().filter((d) => d.id !== id));
  if (getCurrentDiagramId() === id) {
    setCurrentDiagramId(null);
  }
}

export function getCurrentDiagramId(): string | null {
  try {
    return localStorage.getItem(CURRENT_ID_KEY);
  } catch (error) {
    console.error('Failed to read current diagram ID:', error);
    return null;
  }
}

export function setCurrentDiagramId(id: string | null): void {
  if (id) {
    localStorage.setItem(CURRENT_ID_KEY, id);
  } else {
    localStorage.removeItem(CURRENT_ID_KEY);
  }
}
