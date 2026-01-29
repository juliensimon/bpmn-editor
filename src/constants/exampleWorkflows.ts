export interface ExampleWorkflow {
  name: string;
  description: string;
  xml: string;
}

const employeeOnboardingXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  id="Definitions_onboarding"
  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn2:process id="Process_Onboarding" name="Employee Onboarding" isExecutable="false">
    <bpmn2:startEvent id="Start_1" name="New Hire Starts">
      <bpmn2:outgoing>Flow_1</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:task id="Task_HR" name="HR Setup&#10;(Paperwork &amp; Benefits)">
      <bpmn2:incoming>Flow_1</bpmn2:incoming>
      <bpmn2:outgoing>Flow_2</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:parallelGateway id="Fork_1" name="Parallel Setup">
      <bpmn2:incoming>Flow_2</bpmn2:incoming>
      <bpmn2:outgoing>Flow_3</bpmn2:outgoing>
      <bpmn2:outgoing>Flow_4</bpmn2:outgoing>
    </bpmn2:parallelGateway>
    <bpmn2:task id="Task_IT" name="IT Provisioning&#10;(Laptop, Accounts)">
      <bpmn2:incoming>Flow_3</bpmn2:incoming>
      <bpmn2:outgoing>Flow_5</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:task id="Task_Training" name="Orientation&#10;Training">
      <bpmn2:incoming>Flow_4</bpmn2:incoming>
      <bpmn2:outgoing>Flow_6</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:parallelGateway id="Join_1" name="Sync">
      <bpmn2:incoming>Flow_5</bpmn2:incoming>
      <bpmn2:incoming>Flow_6</bpmn2:incoming>
      <bpmn2:outgoing>Flow_7</bpmn2:outgoing>
    </bpmn2:parallelGateway>
    <bpmn2:task id="Task_Review" name="Manager Review&#10;(30-day check-in)">
      <bpmn2:incoming>Flow_7</bpmn2:incoming>
      <bpmn2:outgoing>Flow_8</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:endEvent id="End_1" name="Onboarding Complete">
      <bpmn2:incoming>Flow_8</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:sequenceFlow id="Flow_1" sourceRef="Start_1" targetRef="Task_HR" />
    <bpmn2:sequenceFlow id="Flow_2" sourceRef="Task_HR" targetRef="Fork_1" />
    <bpmn2:sequenceFlow id="Flow_3" sourceRef="Fork_1" targetRef="Task_IT" />
    <bpmn2:sequenceFlow id="Flow_4" sourceRef="Fork_1" targetRef="Task_Training" />
    <bpmn2:sequenceFlow id="Flow_5" sourceRef="Task_IT" targetRef="Join_1" />
    <bpmn2:sequenceFlow id="Flow_6" sourceRef="Task_Training" targetRef="Join_1" />
    <bpmn2:sequenceFlow id="Flow_7" sourceRef="Join_1" targetRef="Task_Review" />
    <bpmn2:sequenceFlow id="Flow_8" sourceRef="Task_Review" targetRef="End_1" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_Onboarding">
      <bpmndi:BPMNShape id="Start_1_di" bpmnElement="Start_1">
        <dc:Bounds x="160" y="192" width="36" height="36" />
        <bpmndi:BPMNLabel><dc:Bounds x="139" y="235" width="78" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_HR_di" bpmnElement="Task_HR">
        <dc:Bounds x="260" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Fork_1_di" bpmnElement="Fork_1">
        <dc:Bounds x="425" y="185" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_IT_di" bpmnElement="Task_IT">
        <dc:Bounds x="540" y="100" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Training_di" bpmnElement="Task_Training">
        <dc:Bounds x="540" y="250" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Join_1_di" bpmnElement="Join_1">
        <dc:Bounds x="705" y="185" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Review_di" bpmnElement="Task_Review">
        <dc:Bounds x="820" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="End_1_di" bpmnElement="End_1">
        <dc:Bounds x="992" y="192" width="36" height="36" />
        <bpmndi:BPMNLabel><dc:Bounds x="962" y="235" width="96" height="27" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="196" y="210" /><di:waypoint x="260" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="360" y="210" /><di:waypoint x="425" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
        <di:waypoint x="450" y="185" /><di:waypoint x="450" y="140" /><di:waypoint x="540" y="140" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_4_di" bpmnElement="Flow_4">
        <di:waypoint x="450" y="235" /><di:waypoint x="450" y="290" /><di:waypoint x="540" y="290" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_5_di" bpmnElement="Flow_5">
        <di:waypoint x="640" y="140" /><di:waypoint x="730" y="140" /><di:waypoint x="730" y="185" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_6_di" bpmnElement="Flow_6">
        <di:waypoint x="640" y="290" /><di:waypoint x="730" y="290" /><di:waypoint x="730" y="235" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_7_di" bpmnElement="Flow_7">
        <di:waypoint x="755" y="210" /><di:waypoint x="820" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_8_di" bpmnElement="Flow_8">
        <di:waypoint x="920" y="210" /><di:waypoint x="992" y="210" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`;

const purchaseOrderXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  id="Definitions_po"
  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn2:process id="Process_PO" name="Purchase Order Approval" isExecutable="false">
    <bpmn2:startEvent id="Start_PO" name="PO Initiated">
      <bpmn2:outgoing>Flow_PO1</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:task id="Task_Submit" name="Submit&#10;Purchase Order">
      <bpmn2:incoming>Flow_PO1</bpmn2:incoming>
      <bpmn2:outgoing>Flow_PO2</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:task id="Task_MgrReview" name="Manager&#10;Review">
      <bpmn2:incoming>Flow_PO2</bpmn2:incoming>
      <bpmn2:outgoing>Flow_PO3</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:exclusiveGateway id="GW_Amount" name="Amount &gt; $5,000?">
      <bpmn2:incoming>Flow_PO3</bpmn2:incoming>
      <bpmn2:outgoing>Flow_PO4</bpmn2:outgoing>
      <bpmn2:outgoing>Flow_PO5</bpmn2:outgoing>
    </bpmn2:exclusiveGateway>
    <bpmn2:task id="Task_VP" name="VP Approval">
      <bpmn2:incoming>Flow_PO4</bpmn2:incoming>
      <bpmn2:outgoing>Flow_PO6</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:task id="Task_Auto" name="Auto-Approve">
      <bpmn2:incoming>Flow_PO5</bpmn2:incoming>
      <bpmn2:outgoing>Flow_PO7</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:exclusiveGateway id="GW_Merge" name="">
      <bpmn2:incoming>Flow_PO6</bpmn2:incoming>
      <bpmn2:incoming>Flow_PO7</bpmn2:incoming>
      <bpmn2:outgoing>Flow_PO8</bpmn2:outgoing>
    </bpmn2:exclusiveGateway>
    <bpmn2:task id="Task_Procure" name="Procurement&#10;Processing">
      <bpmn2:incoming>Flow_PO8</bpmn2:incoming>
      <bpmn2:outgoing>Flow_PO9</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:endEvent id="End_PO" name="PO Complete">
      <bpmn2:incoming>Flow_PO9</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:sequenceFlow id="Flow_PO1" sourceRef="Start_PO" targetRef="Task_Submit" />
    <bpmn2:sequenceFlow id="Flow_PO2" sourceRef="Task_Submit" targetRef="Task_MgrReview" />
    <bpmn2:sequenceFlow id="Flow_PO3" sourceRef="Task_MgrReview" targetRef="GW_Amount" />
    <bpmn2:sequenceFlow id="Flow_PO4" name="Yes" sourceRef="GW_Amount" targetRef="Task_VP" />
    <bpmn2:sequenceFlow id="Flow_PO5" name="No" sourceRef="GW_Amount" targetRef="Task_Auto" />
    <bpmn2:sequenceFlow id="Flow_PO6" sourceRef="Task_VP" targetRef="GW_Merge" />
    <bpmn2:sequenceFlow id="Flow_PO7" sourceRef="Task_Auto" targetRef="GW_Merge" />
    <bpmn2:sequenceFlow id="Flow_PO8" sourceRef="GW_Merge" targetRef="Task_Procure" />
    <bpmn2:sequenceFlow id="Flow_PO9" sourceRef="Task_Procure" targetRef="End_PO" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_PO">
    <bpmndi:BPMNPlane id="BPMNPlane_PO" bpmnElement="Process_PO">
      <bpmndi:BPMNShape id="Start_PO_di" bpmnElement="Start_PO">
        <dc:Bounds x="160" y="192" width="36" height="36" />
        <bpmndi:BPMNLabel><dc:Bounds x="147" y="235" width="62" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Submit_di" bpmnElement="Task_Submit">
        <dc:Bounds x="260" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_MgrReview_di" bpmnElement="Task_MgrReview">
        <dc:Bounds x="420" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="GW_Amount_di" bpmnElement="GW_Amount" isMarkerVisible="true">
        <dc:Bounds x="585" y="185" width="50" height="50" />
        <bpmndi:BPMNLabel><dc:Bounds x="564" y="242" width="92" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_VP_di" bpmnElement="Task_VP">
        <dc:Bounds x="700" y="100" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Auto_di" bpmnElement="Task_Auto">
        <dc:Bounds x="700" y="250" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="GW_Merge_di" bpmnElement="GW_Merge" isMarkerVisible="true">
        <dc:Bounds x="865" y="185" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Procure_di" bpmnElement="Task_Procure">
        <dc:Bounds x="980" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="End_PO_di" bpmnElement="End_PO">
        <dc:Bounds x="1152" y="192" width="36" height="36" />
        <bpmndi:BPMNLabel><dc:Bounds x="1136" y="235" width="68" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_PO1_di" bpmnElement="Flow_PO1">
        <di:waypoint x="196" y="210" /><di:waypoint x="260" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_PO2_di" bpmnElement="Flow_PO2">
        <di:waypoint x="360" y="210" /><di:waypoint x="420" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_PO3_di" bpmnElement="Flow_PO3">
        <di:waypoint x="520" y="210" /><di:waypoint x="585" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_PO4_di" bpmnElement="Flow_PO4">
        <di:waypoint x="610" y="185" /><di:waypoint x="610" y="140" /><di:waypoint x="700" y="140" />
        <bpmndi:BPMNLabel><dc:Bounds x="620" y="153" width="18" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_PO5_di" bpmnElement="Flow_PO5">
        <di:waypoint x="610" y="235" /><di:waypoint x="610" y="290" /><di:waypoint x="700" y="290" />
        <bpmndi:BPMNLabel><dc:Bounds x="620" y="273" width="15" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_PO6_di" bpmnElement="Flow_PO6">
        <di:waypoint x="800" y="140" /><di:waypoint x="890" y="140" /><di:waypoint x="890" y="185" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_PO7_di" bpmnElement="Flow_PO7">
        <di:waypoint x="800" y="290" /><di:waypoint x="890" y="290" /><di:waypoint x="890" y="235" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_PO8_di" bpmnElement="Flow_PO8">
        <di:waypoint x="915" y="210" /><di:waypoint x="980" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_PO9_di" bpmnElement="Flow_PO9">
        <di:waypoint x="1080" y="210" /><di:waypoint x="1152" y="210" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`;

const customerSupportXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  id="Definitions_cs"
  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn2:process id="Process_CS" name="Customer Support Ticket" isExecutable="false">
    <bpmn2:startEvent id="Start_CS" name="Ticket Received">
      <bpmn2:outgoing>Flow_CS1</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:task id="Task_Triage" name="Triage &amp;&#10;Classification">
      <bpmn2:incoming>Flow_CS1</bpmn2:incoming>
      <bpmn2:outgoing>Flow_CS2</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:exclusiveGateway id="GW_Severity" name="Severity?">
      <bpmn2:incoming>Flow_CS2</bpmn2:incoming>
      <bpmn2:outgoing>Flow_CS3</bpmn2:outgoing>
      <bpmn2:outgoing>Flow_CS4</bpmn2:outgoing>
      <bpmn2:outgoing>Flow_CS5</bpmn2:outgoing>
    </bpmn2:exclusiveGateway>
    <bpmn2:task id="Task_L1" name="L1 Support&#10;(Basic)">
      <bpmn2:incoming>Flow_CS3</bpmn2:incoming>
      <bpmn2:outgoing>Flow_CS6</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:task id="Task_L2" name="L2 Support&#10;(Technical)">
      <bpmn2:incoming>Flow_CS4</bpmn2:incoming>
      <bpmn2:outgoing>Flow_CS7</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:task id="Task_L3" name="L3 Support&#10;(Engineering)">
      <bpmn2:incoming>Flow_CS5</bpmn2:incoming>
      <bpmn2:outgoing>Flow_CS8</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:exclusiveGateway id="GW_Merge_CS" name="">
      <bpmn2:incoming>Flow_CS6</bpmn2:incoming>
      <bpmn2:incoming>Flow_CS7</bpmn2:incoming>
      <bpmn2:incoming>Flow_CS8</bpmn2:incoming>
      <bpmn2:outgoing>Flow_CS9</bpmn2:outgoing>
    </bpmn2:exclusiveGateway>
    <bpmn2:task id="Task_Resolve" name="Resolution&#10;Documentation">
      <bpmn2:incoming>Flow_CS9</bpmn2:incoming>
      <bpmn2:outgoing>Flow_CS10</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:task id="Task_Confirm" name="Customer&#10;Confirmation">
      <bpmn2:incoming>Flow_CS10</bpmn2:incoming>
      <bpmn2:outgoing>Flow_CS11</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:endEvent id="End_CS" name="Ticket Closed">
      <bpmn2:incoming>Flow_CS11</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:sequenceFlow id="Flow_CS1" sourceRef="Start_CS" targetRef="Task_Triage" />
    <bpmn2:sequenceFlow id="Flow_CS2" sourceRef="Task_Triage" targetRef="GW_Severity" />
    <bpmn2:sequenceFlow id="Flow_CS3" name="Low" sourceRef="GW_Severity" targetRef="Task_L1" />
    <bpmn2:sequenceFlow id="Flow_CS4" name="Medium" sourceRef="GW_Severity" targetRef="Task_L2" />
    <bpmn2:sequenceFlow id="Flow_CS5" name="High" sourceRef="GW_Severity" targetRef="Task_L3" />
    <bpmn2:sequenceFlow id="Flow_CS6" sourceRef="Task_L1" targetRef="GW_Merge_CS" />
    <bpmn2:sequenceFlow id="Flow_CS7" sourceRef="Task_L2" targetRef="GW_Merge_CS" />
    <bpmn2:sequenceFlow id="Flow_CS8" sourceRef="Task_L3" targetRef="GW_Merge_CS" />
    <bpmn2:sequenceFlow id="Flow_CS9" sourceRef="GW_Merge_CS" targetRef="Task_Resolve" />
    <bpmn2:sequenceFlow id="Flow_CS10" sourceRef="Task_Resolve" targetRef="Task_Confirm" />
    <bpmn2:sequenceFlow id="Flow_CS11" sourceRef="Task_Confirm" targetRef="End_CS" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_CS">
    <bpmndi:BPMNPlane id="BPMNPlane_CS" bpmnElement="Process_CS">
      <bpmndi:BPMNShape id="Start_CS_di" bpmnElement="Start_CS">
        <dc:Bounds x="160" y="252" width="36" height="36" />
        <bpmndi:BPMNLabel><dc:Bounds x="140" y="295" width="78" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Triage_di" bpmnElement="Task_Triage">
        <dc:Bounds x="260" y="230" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="GW_Severity_di" bpmnElement="GW_Severity" isMarkerVisible="true">
        <dc:Bounds x="425" y="245" width="50" height="50" />
        <bpmndi:BPMNLabel><dc:Bounds x="425" y="302" width="50" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_L1_di" bpmnElement="Task_L1">
        <dc:Bounds x="540" y="100" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_L2_di" bpmnElement="Task_L2">
        <dc:Bounds x="540" y="230" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_L3_di" bpmnElement="Task_L3">
        <dc:Bounds x="540" y="360" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="GW_Merge_CS_di" bpmnElement="GW_Merge_CS" isMarkerVisible="true">
        <dc:Bounds x="705" y="245" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Resolve_di" bpmnElement="Task_Resolve">
        <dc:Bounds x="820" y="230" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Confirm_di" bpmnElement="Task_Confirm">
        <dc:Bounds x="980" y="230" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="End_CS_di" bpmnElement="End_CS">
        <dc:Bounds x="1152" y="252" width="36" height="36" />
        <bpmndi:BPMNLabel><dc:Bounds x="1134" y="295" width="72" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_CS1_di" bpmnElement="Flow_CS1">
        <di:waypoint x="196" y="270" /><di:waypoint x="260" y="270" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_CS2_di" bpmnElement="Flow_CS2">
        <di:waypoint x="360" y="270" /><di:waypoint x="425" y="270" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_CS3_di" bpmnElement="Flow_CS3">
        <di:waypoint x="450" y="245" /><di:waypoint x="450" y="140" /><di:waypoint x="540" y="140" />
        <bpmndi:BPMNLabel><dc:Bounds x="460" y="183" width="20" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_CS4_di" bpmnElement="Flow_CS4">
        <di:waypoint x="475" y="270" /><di:waypoint x="540" y="270" />
        <bpmndi:BPMNLabel><dc:Bounds x="488" y="252" width="40" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_CS5_di" bpmnElement="Flow_CS5">
        <di:waypoint x="450" y="295" /><di:waypoint x="450" y="400" /><di:waypoint x="540" y="400" />
        <bpmndi:BPMNLabel><dc:Bounds x="460" y="343" width="23" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_CS6_di" bpmnElement="Flow_CS6">
        <di:waypoint x="640" y="140" /><di:waypoint x="730" y="140" /><di:waypoint x="730" y="245" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_CS7_di" bpmnElement="Flow_CS7">
        <di:waypoint x="640" y="270" /><di:waypoint x="705" y="270" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_CS8_di" bpmnElement="Flow_CS8">
        <di:waypoint x="640" y="400" /><di:waypoint x="730" y="400" /><di:waypoint x="730" y="295" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_CS9_di" bpmnElement="Flow_CS9">
        <di:waypoint x="755" y="270" /><di:waypoint x="820" y="270" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_CS10_di" bpmnElement="Flow_CS10">
        <di:waypoint x="920" y="270" /><di:waypoint x="980" y="270" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_CS11_di" bpmnElement="Flow_CS11">
        <di:waypoint x="1080" y="270" /><di:waypoint x="1152" y="270" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`;

const invoiceProcessingXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  id="Definitions_inv"
  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn2:process id="Process_Invoice" name="Invoice Processing" isExecutable="false">
    <bpmn2:startEvent id="Start_Inv" name="Invoice Received">
      <bpmn2:outgoing>Flow_Inv1</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:task id="Task_Receive" name="Log Invoice&#10;in System">
      <bpmn2:incoming>Flow_Inv1</bpmn2:incoming>
      <bpmn2:outgoing>Flow_Inv2</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:task id="Task_Validate" name="Validate&#10;Invoice Details">
      <bpmn2:incoming>Flow_Inv2</bpmn2:incoming>
      <bpmn2:outgoing>Flow_Inv3</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:task id="Task_MatchPO" name="Match with&#10;Purchase Order">
      <bpmn2:incoming>Flow_Inv3</bpmn2:incoming>
      <bpmn2:outgoing>Flow_Inv4</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:exclusiveGateway id="GW_Discrepancy" name="Discrepancy?">
      <bpmn2:incoming>Flow_Inv4</bpmn2:incoming>
      <bpmn2:outgoing>Flow_Inv5</bpmn2:outgoing>
      <bpmn2:outgoing>Flow_Inv6</bpmn2:outgoing>
    </bpmn2:exclusiveGateway>
    <bpmn2:task id="Task_Resolve_Inv" name="Resolve&#10;Discrepancy">
      <bpmn2:incoming>Flow_Inv5</bpmn2:incoming>
      <bpmn2:outgoing>Flow_Inv7</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:task id="Task_Approve" name="Approve&#10;for Payment">
      <bpmn2:incoming>Flow_Inv6</bpmn2:incoming>
      <bpmn2:incoming>Flow_Inv7</bpmn2:incoming>
      <bpmn2:outgoing>Flow_Inv8</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:task id="Task_Payment" name="Process&#10;Payment">
      <bpmn2:incoming>Flow_Inv8</bpmn2:incoming>
      <bpmn2:outgoing>Flow_Inv9</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:endEvent id="End_Inv" name="Invoice Paid">
      <bpmn2:incoming>Flow_Inv9</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:sequenceFlow id="Flow_Inv1" sourceRef="Start_Inv" targetRef="Task_Receive" />
    <bpmn2:sequenceFlow id="Flow_Inv2" sourceRef="Task_Receive" targetRef="Task_Validate" />
    <bpmn2:sequenceFlow id="Flow_Inv3" sourceRef="Task_Validate" targetRef="Task_MatchPO" />
    <bpmn2:sequenceFlow id="Flow_Inv4" sourceRef="Task_MatchPO" targetRef="GW_Discrepancy" />
    <bpmn2:sequenceFlow id="Flow_Inv5" name="Yes" sourceRef="GW_Discrepancy" targetRef="Task_Resolve_Inv" />
    <bpmn2:sequenceFlow id="Flow_Inv6" name="No" sourceRef="GW_Discrepancy" targetRef="Task_Approve" />
    <bpmn2:sequenceFlow id="Flow_Inv7" sourceRef="Task_Resolve_Inv" targetRef="Task_Approve" />
    <bpmn2:sequenceFlow id="Flow_Inv8" sourceRef="Task_Approve" targetRef="Task_Payment" />
    <bpmn2:sequenceFlow id="Flow_Inv9" sourceRef="Task_Payment" targetRef="End_Inv" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_Inv">
    <bpmndi:BPMNPlane id="BPMNPlane_Inv" bpmnElement="Process_Invoice">
      <bpmndi:BPMNShape id="Start_Inv_di" bpmnElement="Start_Inv">
        <dc:Bounds x="160" y="192" width="36" height="36" />
        <bpmndi:BPMNLabel><dc:Bounds x="136" y="235" width="84" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Receive_di" bpmnElement="Task_Receive">
        <dc:Bounds x="260" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Validate_di" bpmnElement="Task_Validate">
        <dc:Bounds x="420" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_MatchPO_di" bpmnElement="Task_MatchPO">
        <dc:Bounds x="580" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="GW_Discrepancy_di" bpmnElement="GW_Discrepancy" isMarkerVisible="true">
        <dc:Bounds x="745" y="185" width="50" height="50" />
        <bpmndi:BPMNLabel><dc:Bounds x="735" y="242" width="70" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Resolve_Inv_di" bpmnElement="Task_Resolve_Inv">
        <dc:Bounds x="860" y="100" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Approve_di" bpmnElement="Task_Approve">
        <dc:Bounds x="1020" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Payment_di" bpmnElement="Task_Payment">
        <dc:Bounds x="1180" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="End_Inv_di" bpmnElement="End_Inv">
        <dc:Bounds x="1352" y="192" width="36" height="36" />
        <bpmndi:BPMNLabel><dc:Bounds x="1338" y="235" width="64" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_Inv1_di" bpmnElement="Flow_Inv1">
        <di:waypoint x="196" y="210" /><di:waypoint x="260" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Inv2_di" bpmnElement="Flow_Inv2">
        <di:waypoint x="360" y="210" /><di:waypoint x="420" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Inv3_di" bpmnElement="Flow_Inv3">
        <di:waypoint x="520" y="210" /><di:waypoint x="580" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Inv4_di" bpmnElement="Flow_Inv4">
        <di:waypoint x="680" y="210" /><di:waypoint x="745" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Inv5_di" bpmnElement="Flow_Inv5">
        <di:waypoint x="770" y="185" /><di:waypoint x="770" y="140" /><di:waypoint x="860" y="140" />
        <bpmndi:BPMNLabel><dc:Bounds x="780" y="153" width="18" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Inv6_di" bpmnElement="Flow_Inv6">
        <di:waypoint x="795" y="210" /><di:waypoint x="1020" y="210" />
        <bpmndi:BPMNLabel><dc:Bounds x="900" y="192" width="15" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Inv7_di" bpmnElement="Flow_Inv7">
        <di:waypoint x="960" y="140" /><di:waypoint x="1070" y="140" /><di:waypoint x="1070" y="170" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Inv8_di" bpmnElement="Flow_Inv8">
        <di:waypoint x="1120" y="210" /><di:waypoint x="1180" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Inv9_di" bpmnElement="Flow_Inv9">
        <di:waypoint x="1280" y="210" /><di:waypoint x="1352" y="210" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`;

const leaveRequestXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  id="Definitions_leave"
  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn2:process id="Process_Leave" name="Leave Request Approval" isExecutable="false">
    <bpmn2:startEvent id="Start_Leave" name="Leave Requested">
      <bpmn2:outgoing>Flow_L1</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:task id="Task_SubmitLeave" name="Submit Leave&#10;Request">
      <bpmn2:incoming>Flow_L1</bpmn2:incoming>
      <bpmn2:outgoing>Flow_L2</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:task id="Task_MgrReviewLeave" name="Manager&#10;Review">
      <bpmn2:incoming>Flow_L2</bpmn2:incoming>
      <bpmn2:outgoing>Flow_L3</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:exclusiveGateway id="GW_Days" name="More than 5 days?">
      <bpmn2:incoming>Flow_L3</bpmn2:incoming>
      <bpmn2:outgoing>Flow_L4</bpmn2:outgoing>
      <bpmn2:outgoing>Flow_L5</bpmn2:outgoing>
    </bpmn2:exclusiveGateway>
    <bpmn2:task id="Task_HRApproval" name="HR Approval">
      <bpmn2:incoming>Flow_L4</bpmn2:incoming>
      <bpmn2:outgoing>Flow_L6</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:task id="Task_AutoApprove" name="Auto-Approve">
      <bpmn2:incoming>Flow_L5</bpmn2:incoming>
      <bpmn2:outgoing>Flow_L7</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:exclusiveGateway id="GW_MergeLeave" name="">
      <bpmn2:incoming>Flow_L6</bpmn2:incoming>
      <bpmn2:incoming>Flow_L7</bpmn2:incoming>
      <bpmn2:outgoing>Flow_L8</bpmn2:outgoing>
    </bpmn2:exclusiveGateway>
    <bpmn2:task id="Task_Calendar" name="Update&#10;Calendar">
      <bpmn2:incoming>Flow_L8</bpmn2:incoming>
      <bpmn2:outgoing>Flow_L9</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:task id="Task_Notify" name="Notify&#10;Team">
      <bpmn2:incoming>Flow_L9</bpmn2:incoming>
      <bpmn2:outgoing>Flow_L10</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:endEvent id="End_Leave" name="Leave Approved">
      <bpmn2:incoming>Flow_L10</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:sequenceFlow id="Flow_L1" sourceRef="Start_Leave" targetRef="Task_SubmitLeave" />
    <bpmn2:sequenceFlow id="Flow_L2" sourceRef="Task_SubmitLeave" targetRef="Task_MgrReviewLeave" />
    <bpmn2:sequenceFlow id="Flow_L3" sourceRef="Task_MgrReviewLeave" targetRef="GW_Days" />
    <bpmn2:sequenceFlow id="Flow_L4" name="Yes" sourceRef="GW_Days" targetRef="Task_HRApproval" />
    <bpmn2:sequenceFlow id="Flow_L5" name="No" sourceRef="GW_Days" targetRef="Task_AutoApprove" />
    <bpmn2:sequenceFlow id="Flow_L6" sourceRef="Task_HRApproval" targetRef="GW_MergeLeave" />
    <bpmn2:sequenceFlow id="Flow_L7" sourceRef="Task_AutoApprove" targetRef="GW_MergeLeave" />
    <bpmn2:sequenceFlow id="Flow_L8" sourceRef="GW_MergeLeave" targetRef="Task_Calendar" />
    <bpmn2:sequenceFlow id="Flow_L9" sourceRef="Task_Calendar" targetRef="Task_Notify" />
    <bpmn2:sequenceFlow id="Flow_L10" sourceRef="Task_Notify" targetRef="End_Leave" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_Leave">
    <bpmndi:BPMNPlane id="BPMNPlane_Leave" bpmnElement="Process_Leave">
      <bpmndi:BPMNShape id="Start_Leave_di" bpmnElement="Start_Leave">
        <dc:Bounds x="160" y="192" width="36" height="36" />
        <bpmndi:BPMNLabel><dc:Bounds x="136" y="235" width="84" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_SubmitLeave_di" bpmnElement="Task_SubmitLeave">
        <dc:Bounds x="260" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_MgrReviewLeave_di" bpmnElement="Task_MgrReviewLeave">
        <dc:Bounds x="420" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="GW_Days_di" bpmnElement="GW_Days" isMarkerVisible="true">
        <dc:Bounds x="585" y="185" width="50" height="50" />
        <bpmndi:BPMNLabel><dc:Bounds x="564" y="242" width="92" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_HRApproval_di" bpmnElement="Task_HRApproval">
        <dc:Bounds x="700" y="100" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_AutoApprove_di" bpmnElement="Task_AutoApprove">
        <dc:Bounds x="700" y="250" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="GW_MergeLeave_di" bpmnElement="GW_MergeLeave" isMarkerVisible="true">
        <dc:Bounds x="865" y="185" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Calendar_di" bpmnElement="Task_Calendar">
        <dc:Bounds x="980" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Notify_di" bpmnElement="Task_Notify">
        <dc:Bounds x="1140" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="End_Leave_di" bpmnElement="End_Leave">
        <dc:Bounds x="1312" y="192" width="36" height="36" />
        <bpmndi:BPMNLabel><dc:Bounds x="1290" y="235" width="80" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_L1_di" bpmnElement="Flow_L1">
        <di:waypoint x="196" y="210" /><di:waypoint x="260" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_L2_di" bpmnElement="Flow_L2">
        <di:waypoint x="360" y="210" /><di:waypoint x="420" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_L3_di" bpmnElement="Flow_L3">
        <di:waypoint x="520" y="210" /><di:waypoint x="585" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_L4_di" bpmnElement="Flow_L4">
        <di:waypoint x="610" y="185" /><di:waypoint x="610" y="140" /><di:waypoint x="700" y="140" />
        <bpmndi:BPMNLabel><dc:Bounds x="620" y="153" width="18" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_L5_di" bpmnElement="Flow_L5">
        <di:waypoint x="610" y="235" /><di:waypoint x="610" y="290" /><di:waypoint x="700" y="290" />
        <bpmndi:BPMNLabel><dc:Bounds x="620" y="273" width="15" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_L6_di" bpmnElement="Flow_L6">
        <di:waypoint x="800" y="140" /><di:waypoint x="890" y="140" /><di:waypoint x="890" y="185" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_L7_di" bpmnElement="Flow_L7">
        <di:waypoint x="800" y="290" /><di:waypoint x="890" y="290" /><di:waypoint x="890" y="235" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_L8_di" bpmnElement="Flow_L8">
        <di:waypoint x="915" y="210" /><di:waypoint x="980" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_L9_di" bpmnElement="Flow_L9">
        <di:waypoint x="1080" y="210" /><di:waypoint x="1140" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_L10_di" bpmnElement="Flow_L10">
        <di:waypoint x="1240" y="210" /><di:waypoint x="1312" y="210" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`;

export const EXAMPLE_WORKFLOWS: ExampleWorkflow[] = [
  {
    name: 'Employee Onboarding',
    description: 'HR setup, parallel IT provisioning & training, manager review',
    xml: employeeOnboardingXml,
  },
  {
    name: 'Purchase Order Approval',
    description: 'Submit PO, manager review, conditional VP approval for large orders',
    xml: purchaseOrderXml,
  },
  {
    name: 'Customer Support Ticket',
    description: 'Triage by severity into L1/L2/L3 support paths, resolution & confirmation',
    xml: customerSupportXml,
  },
  {
    name: 'Invoice Processing',
    description: 'Validate invoice, match PO, resolve discrepancies, process payment',
    xml: invoiceProcessingXml,
  },
  {
    name: 'Leave Request Approval',
    description: 'Manager review, HR approval for extended leave, calendar update & notify',
    xml: leaveRequestXml,
  },
];
