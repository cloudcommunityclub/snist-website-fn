'use client';

import ReactFlow, { Node, Edge, Background } from 'reactflow';
import 'reactflow/dist/style.css';

const nodes: Node[] = [
    {
        id: '1',
        position: { x: 0, y: 100 },
        data: { label: 'Find Role' },
        type: 'default',
    },
    {
        id: '2',
        position: { x: 200, y: 100 },
        data: { label: 'Take Challenge' },
        type: 'default',
    },
    {
        id: '3',
        position: { x: 400, y: 100 },
        data: { label: 'Submit PR' },
        type: 'default',
    },
    {
        id: '4',
        position: { x: 600, y: 100 },
        data: { label: 'Get Results' },
        type: 'default',
    },
];

const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e3-4', source: '3', target: '4' },
];

export default function Roadmap() {
    return (
        <div style={{ width: '100%', height: '300px' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                panOnDrag={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
            >
                <Background />
            </ReactFlow>
        </div>
    );
}
