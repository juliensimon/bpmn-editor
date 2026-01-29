import { describe, it, expect } from 'vitest';
import { EMPTY_DIAGRAM_XML } from './emptyDiagram';

describe('EMPTY_DIAGRAM_XML', () => {
  it('is a non-empty string', () => {
    expect(typeof EMPTY_DIAGRAM_XML).toBe('string');
    expect(EMPTY_DIAGRAM_XML.length).toBeGreaterThan(0);
  });

  it('contains XML declaration', () => {
    expect(EMPTY_DIAGRAM_XML).toContain('<?xml version="1.0"');
  });

  it('contains BPMN 2.0 definitions with correct namespace', () => {
    expect(EMPTY_DIAGRAM_XML).toContain('xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"');
  });

  it('contains BPMNDI namespace for diagram interchange', () => {
    expect(EMPTY_DIAGRAM_XML).toContain('xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"');
  });

  it('contains DC namespace for graphical bounds', () => {
    expect(EMPTY_DIAGRAM_XML).toContain('xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"');
  });

  it('contains a process element', () => {
    expect(EMPTY_DIAGRAM_XML).toContain('<bpmn2:process');
    expect(EMPTY_DIAGRAM_XML).toContain('id="Process_1"');
  });

  it('contains a start event', () => {
    expect(EMPTY_DIAGRAM_XML).toContain('<bpmn2:startEvent');
    expect(EMPTY_DIAGRAM_XML).toContain('id="StartEvent_1"');
    expect(EMPTY_DIAGRAM_XML).toContain('name="Start"');
  });

  it('contains BPMNDiagram with BPMNPlane', () => {
    expect(EMPTY_DIAGRAM_XML).toContain('<bpmndi:BPMNDiagram');
    expect(EMPTY_DIAGRAM_XML).toContain('<bpmndi:BPMNPlane');
    expect(EMPTY_DIAGRAM_XML).toContain('bpmnElement="Process_1"');
  });

  it('contains BPMNShape for the start event with bounds', () => {
    expect(EMPTY_DIAGRAM_XML).toContain('<bpmndi:BPMNShape');
    expect(EMPTY_DIAGRAM_XML).toContain('bpmnElement="StartEvent_1"');
    expect(EMPTY_DIAGRAM_XML).toContain('<dc:Bounds');
  });

  it('has a target namespace', () => {
    expect(EMPTY_DIAGRAM_XML).toContain('targetNamespace=');
  });
});
