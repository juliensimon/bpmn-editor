import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DiagramList } from './DiagramList';
import * as storage from '../services/diagramStorage';
import { EXAMPLE_WORKFLOWS } from '../constants/exampleWorkflows';

vi.mock('../services/diagramStorage', async (importOriginal) => {
  const actual = await importOriginal<typeof storage>();
  return { ...actual, listDiagrams: vi.fn() };
});

const mockListDiagrams = vi.mocked(storage.listDiagrams);

describe('DiagramList', () => {
  const defaultProps = {
    currentId: null as string | null,
    refreshKey: 0,
    onSelect: vi.fn(),
    onDelete: vi.fn(),
    onLoadExample: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockListDiagrams.mockReturnValue([]);
  });

  it('renders the header', () => {
    render(<DiagramList {...defaultProps} />);
    expect(screen.getByText('Diagrams')).toBeInTheDocument();
  });

  it('shows empty state when no diagrams', () => {
    render(<DiagramList {...defaultProps} />);
    expect(screen.getByText('No diagrams yet')).toBeInTheDocument();
  });

  it('renders diagram names', () => {
    mockListDiagrams.mockReturnValue([
      { id: '1', name: 'First', xml: '', createdAt: '', updatedAt: '' },
      { id: '2', name: 'Second', xml: '', createdAt: '', updatedAt: '' },
    ]);
    render(<DiagramList {...defaultProps} />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('does not show empty state when diagrams exist', () => {
    mockListDiagrams.mockReturnValue([
      { id: '1', name: 'Exists', xml: '', createdAt: '', updatedAt: '' },
    ]);
    render(<DiagramList {...defaultProps} />);
    expect(screen.queryByText('No diagrams yet')).not.toBeInTheDocument();
  });

  it('calls onSelect when a diagram item is clicked', async () => {
    const onSelect = vi.fn();
    mockListDiagrams.mockReturnValue([
      { id: 'abc', name: 'Click Me', xml: '', createdAt: '', updatedAt: '' },
    ]);
    render(<DiagramList {...defaultProps} onSelect={onSelect} />);
    await userEvent.click(screen.getByText('Click Me'));
    expect(onSelect).toHaveBeenCalledWith('abc');
  });

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    mockListDiagrams.mockReturnValue([
      { id: 'del', name: 'Delete Me', xml: '', createdAt: '', updatedAt: '' },
    ]);
    render(<DiagramList {...defaultProps} onDelete={onDelete} />);
    await userEvent.click(screen.getByTitle('Delete diagram'));
    expect(onDelete).toHaveBeenCalledWith('del');
  });

  it('does not call onSelect when delete button is clicked (stopPropagation)', async () => {
    const onSelect = vi.fn();
    const onDelete = vi.fn();
    mockListDiagrams.mockReturnValue([
      { id: 'x', name: 'Item', xml: '', createdAt: '', updatedAt: '' },
    ]);
    render(<DiagramList {...defaultProps} onSelect={onSelect} onDelete={onDelete} />);
    await userEvent.click(screen.getByTitle('Delete diagram'));
    expect(onDelete).toHaveBeenCalledOnce();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('highlights the active diagram with "active" class', () => {
    mockListDiagrams.mockReturnValue([
      { id: 'active-one', name: 'Active', xml: '', createdAt: '', updatedAt: '' },
      { id: 'inactive', name: 'Inactive', xml: '', createdAt: '', updatedAt: '' },
    ]);
    render(<DiagramList {...defaultProps} currentId="active-one" />);
    const activeItem = screen.getByText('Active').closest('.diagram-list-item');
    const inactiveItem = screen.getByText('Inactive').closest('.diagram-list-item');
    expect(activeItem?.className).toContain('active');
    expect(inactiveItem?.className).not.toContain('active');
  });

  it('reloads diagrams when refreshKey changes', () => {
    mockListDiagrams.mockReturnValue([]);
    const { rerender } = render(<DiagramList {...defaultProps} refreshKey={0} />);
    expect(mockListDiagrams).toHaveBeenCalledTimes(1);

    rerender(<DiagramList {...defaultProps} refreshKey={1} />);
    expect(mockListDiagrams).toHaveBeenCalledTimes(2);
  });

  it('does not reload when other props change', () => {
    mockListDiagrams.mockReturnValue([]);
    const { rerender } = render(<DiagramList {...defaultProps} refreshKey={0} />);
    expect(mockListDiagrams).toHaveBeenCalledTimes(1);

    rerender(<DiagramList {...defaultProps} refreshKey={0} currentId="changed" />);
    // Still only 1 call — refreshKey didn't change
    expect(mockListDiagrams).toHaveBeenCalledTimes(1);
  });

  it('renders a delete button for each diagram', () => {
    mockListDiagrams.mockReturnValue([
      { id: '1', name: 'A', xml: '', createdAt: '', updatedAt: '' },
      { id: '2', name: 'B', xml: '', createdAt: '', updatedAt: '' },
    ]);
    render(<DiagramList {...defaultProps} />);
    expect(screen.getAllByTitle('Delete diagram')).toHaveLength(2);
  });

  it('renders a diagram with empty name', () => {
    mockListDiagrams.mockReturnValue([
      { id: '1', name: '', xml: '', createdAt: '', updatedAt: '' },
    ]);
    render(<DiagramList {...defaultProps} />);
    // The item should exist even with empty name
    const items = document.querySelectorAll('.diagram-list-item');
    expect(items).toHaveLength(1);
    expect(screen.queryByText('No diagrams yet')).not.toBeInTheDocument();
  });

  it('renders a diagram with a very long name', () => {
    const longName = 'A'.repeat(500);
    mockListDiagrams.mockReturnValue([
      { id: '1', name: longName, xml: '', createdAt: '', updatedAt: '' },
    ]);
    render(<DiagramList {...defaultProps} />);
    expect(screen.getByText(longName)).toBeInTheDocument();
  });

  it('renders many diagrams without issues', () => {
    const manyDiagrams = Array.from({ length: 100 }, (_, i) => ({
      id: `id-${i}`,
      name: `Diagram ${i}`,
      xml: '',
      createdAt: '',
      updatedAt: '',
    }));
    mockListDiagrams.mockReturnValue(manyDiagrams);
    render(<DiagramList {...defaultProps} />);

    expect(screen.getAllByTitle('Delete diagram')).toHaveLength(100);
    expect(screen.getByText('Diagram 0')).toBeInTheDocument();
    expect(screen.getByText('Diagram 99')).toBeInTheDocument();
    expect(screen.queryByText('No diagrams yet')).not.toBeInTheDocument();
  });

  it('renders diagram name with special characters', () => {
    mockListDiagrams.mockReturnValue([
      { id: '1', name: '<b>Bold</b> & "Quoted"', xml: '', createdAt: '', updatedAt: '' },
    ]);
    render(<DiagramList {...defaultProps} />);
    expect(screen.getByText('<b>Bold</b> & "Quoted"')).toBeInTheDocument();
  });

  it('calls onSelect with correct id when clicking among many diagrams', async () => {
    const onSelect = vi.fn();
    mockListDiagrams.mockReturnValue([
      { id: 'first', name: 'First', xml: '', createdAt: '', updatedAt: '' },
      { id: 'second', name: 'Second', xml: '', createdAt: '', updatedAt: '' },
      { id: 'third', name: 'Third', xml: '', createdAt: '', updatedAt: '' },
    ]);
    render(<DiagramList {...defaultProps} onSelect={onSelect} />);
    await userEvent.click(screen.getByText('Second'));
    expect(onSelect).toHaveBeenCalledWith('second');
  });

  it('calls onDelete with correct id for middle item', async () => {
    const onDelete = vi.fn();
    mockListDiagrams.mockReturnValue([
      { id: 'a', name: 'A', xml: '', createdAt: '', updatedAt: '' },
      { id: 'b', name: 'B', xml: '', createdAt: '', updatedAt: '' },
      { id: 'c', name: 'C', xml: '', createdAt: '', updatedAt: '' },
    ]);
    render(<DiagramList {...defaultProps} onDelete={onDelete} />);
    const deleteButtons = screen.getAllByTitle('Delete diagram');
    await userEvent.click(deleteButtons[1]); // middle item
    expect(onDelete).toHaveBeenCalledWith('b');
  });

  it('does not highlight any item when currentId matches none', () => {
    mockListDiagrams.mockReturnValue([
      { id: '1', name: 'A', xml: '', createdAt: '', updatedAt: '' },
      { id: '2', name: 'B', xml: '', createdAt: '', updatedAt: '' },
    ]);
    render(<DiagramList {...defaultProps} currentId="nonexistent" />);
    const items = document.querySelectorAll('.diagram-list-item.active');
    expect(items).toHaveLength(0);
  });

  it('renders all example workflows', () => {
    render(<DiagramList {...defaultProps} />);
    for (const ex of EXAMPLE_WORKFLOWS) {
      expect(screen.getByText(ex.name)).toBeInTheDocument();
    }
  });

  it('calls onLoadExample with correct name and xml when an example is clicked', async () => {
    const onLoadExample = vi.fn();
    render(<DiagramList {...defaultProps} onLoadExample={onLoadExample} />);
    await userEvent.click(screen.getByText(EXAMPLE_WORKFLOWS[0].name));
    expect(onLoadExample).toHaveBeenCalledWith(
      EXAMPLE_WORKFLOWS[0].name,
      EXAMPLE_WORKFLOWS[0].xml,
    );
  });

  it('collapses examples section when header is clicked', async () => {
    render(<DiagramList {...defaultProps} />);
    expect(screen.getByText(EXAMPLE_WORKFLOWS[0].name)).toBeInTheDocument();
    await userEvent.click(screen.getByText('Examples'));
    expect(screen.queryByText(EXAMPLE_WORKFLOWS[0].name)).not.toBeInTheDocument();
  });

  it('shows example descriptions as tooltips', () => {
    render(<DiagramList {...defaultProps} />);
    for (const ex of EXAMPLE_WORKFLOWS) {
      expect(screen.getByTitle(ex.description)).toBeInTheDocument();
    }
  });
});
