import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

// Mock the hook since bpmn-js needs real DOM
vi.mock('../hooks/useBpmnModeler', () => ({
  useBpmnModeler: vi.fn().mockReturnValue({
    exportXml: vi.fn(),
    exportSvg: vi.fn(),
    getCommandStack: vi.fn(),
  }),
}));

// Mock CSS imports
vi.mock('bpmn-js/dist/assets/diagram-js.css', () => ({}));
vi.mock('bpmn-js/dist/assets/bpmn-js.css', () => ({}));
vi.mock('bpmn-js/dist/assets/bpmn-font/css/bpmn.css', () => ({}));
vi.mock('@bpmn-io/properties-panel/dist/assets/properties-panel.css', () => ({}));

import { BpmnEditor } from './BpmnEditor';
import { useBpmnModeler } from '../hooks/useBpmnModeler';

const mockUseBpmnModeler = vi.mocked(useBpmnModeler);

describe('BpmnEditor', () => {
  const defaultProps = {
    xml: '<test/>',
    onDiagramChanged: vi.fn(),
    onReady: vi.fn(),
  };

  it('renders canvas and properties panel containers', () => {
    const { container } = render(<BpmnEditor {...defaultProps} />);
    expect(container.querySelector('.bpmn-canvas')).toBeInTheDocument();
    expect(container.querySelector('.bpmn-properties-panel')).toBeInTheDocument();
  });

  it('renders within an editor wrapper', () => {
    const { container } = render(<BpmnEditor {...defaultProps} />);
    expect(container.querySelector('.bpmn-editor')).toBeInTheDocument();
  });

  it('passes xml to useBpmnModeler', () => {
    render(<BpmnEditor {...defaultProps} xml="<my-xml/>" />);
    expect(mockUseBpmnModeler).toHaveBeenCalledWith(
      expect.objectContaining({ xml: '<my-xml/>' })
    );
  });

  it('passes onChanged callback to useBpmnModeler', () => {
    const onDiagramChanged = vi.fn();
    render(<BpmnEditor {...defaultProps} onDiagramChanged={onDiagramChanged} />);
    expect(mockUseBpmnModeler).toHaveBeenCalledWith(
      expect.objectContaining({ onChanged: onDiagramChanged })
    );
  });

  it('calls onReady with editor API', () => {
    const onReady = vi.fn();
    render(<BpmnEditor {...defaultProps} onReady={onReady} />);
    expect(onReady).toHaveBeenCalledWith(
      expect.objectContaining({
        exportXml: expect.any(Function),
        exportSvg: expect.any(Function),
        getCommandStack: expect.any(Function),
      })
    );
  });

  it('provides DOM refs for container and propertiesPanel', () => {
    render(<BpmnEditor {...defaultProps} />);
    // The hook should be called with actual DOM elements (or null initially)
    const call = mockUseBpmnModeler.mock.calls[mockUseBpmnModeler.mock.calls.length - 1][0];
    // On first render, useState callback refs will be null, then set
    // We just verify the hook was called with the expected shape
    expect(call).toHaveProperty('container');
    expect(call).toHaveProperty('propertiesPanel');
  });
});
