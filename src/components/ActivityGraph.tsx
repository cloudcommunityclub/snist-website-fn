'use client'

import React, { useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    Node,
    Edge,
    ConnectionLineType,
    MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Rocket, BookOpen, FlaskConical, Users } from 'lucide-react';
import ActivityNode from './ActivityNode';
import DataPacketEdge from './DataPacketEdge';


const activities = [
    {
        title: "Explore Cutting Edge Tech",
        description: "Master industry-standard tools and stay ahead in the evolving technology landscape.",
        icon: Rocket
    },
    {
        title: "Open Source Contributions",
        description: "Contribute to free and open source projects and make a meaningful impact.",
        icon: BookOpen
    },
    {
        title: "Research Driven Activities",
        description: "Explore and advance in your field of interest through research papers.",
        icon: FlaskConical
    },
    {
        title: "Networking",
        description: "Connect with like-minded people, because your network is your net worth.",
        icon: Users
    }
];

// Circular layout configuration
const CENTER_X = 0;
const CENTER_Y = 0;
const RADIUS = 400; // Increased radius for better spacing

export default function ActivityGraph() {
    const nodeTypes = useMemo(() => ({ activityNode: ActivityNode }), []);
    const edgeTypes = useMemo(() => ({ dataPacket: DataPacketEdge }), []);


    // 1. Central "Core" Node
    const initialNodes: Node[] = [
        {
            id: 'core',
            type: 'default', // Using default type for the center
            data: { label: 'C³ Core' },
            position: { x: CENTER_X, y: CENTER_Y },
            style: {
                background: '#000',
                color: '#fff',
                border: '2px solid #06b6d4',
                borderRadius: '50%',
                width: 100,
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
                boxShadow: '0 0 20px rgba(6,182,212,0.5)'
            },
            draggable: false,
        }
    ];

    // 2. Satellite Activity Nodes
    activities.forEach((activity, index) => {
        const angle = (index / activities.length) * 2 * Math.PI;
        const x = CENTER_X + RADIUS * Math.cos(angle);
        const y = CENTER_Y + RADIUS * Math.sin(angle);

        initialNodes.push({
            id: `activity-${index}`,
            type: 'activityNode',
            position: { x, y }, // Center the node roughly
            data: {
                label: activity.title,
                description: activity.description,
                icon: activity.icon
            },
            draggable: false,
        });
    });

    // 3. Edges connecting Core to Satellites
    const initialEdges: Edge[] = activities.map((_, index) => ({
        id: `e-core-${index}`,
        source: 'core',
        target: `activity-${index}`,
        type: 'dataPacket',
        animated: false,
        style: { strokeWidth: 2 },
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#333',
        },
    }));

    return (
        <div className="w-full h-[600px] bg-black border-y border-white/10 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black z-0 pointer-events-none" />

            <ReactFlow
                nodes={initialNodes}
                edges={initialEdges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}

                fitView
                panOnScroll={false}
                zoomOnScroll={false}
                panOnDrag={false}
                nodesDraggable={false}
                proOptions={{ hideAttribution: true }}
                className="relative z-10"
            >
                <Background color="#333" gap={20} size={1} />
            </ReactFlow>
        </div>
    );
}
