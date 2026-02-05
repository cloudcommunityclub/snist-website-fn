import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { LucideIcon } from 'lucide-react';

interface ActivityNodeData {
    label: string;
    description: string;
    icon: LucideIcon;
}

const ActivityNode = ({ data }: NodeProps<ActivityNodeData>) => {
    const Icon = data.icon;

    return (
        <div className="relative group min-w-[300px] max-w-sm rounded-xl bg-neutral-900 border border-white/10 hover:border-cyan-500/50 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]">

            {/* Target Handle (Input) */}
            <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-neutral-900 transition-transform hover:scale-125 focus:ring-2 focus:ring-cyan-400"
            />

            <div className="flex items-start p-5 gap-4">
                {/* Icon Circle */}
                <div className="flex-shrink-0 relative">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full group-hover:bg-cyan-500/40 transition-all" />
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-neutral-800 border border-white/10 group-hover:border-cyan-500/40 transition-colors">
                        {Icon && <Icon className="w-6 h-6 text-cyan-400" />}
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-gray-100 group-hover:text-white transition-colors">
                        {data.label}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                        {data.description}
                    </p>
                </div>
            </div>

            {/* Source Handle (Output) */}
            <Handle
                type="source"
                position={Position.Right}
                className="!w-3 !h-3 !bg-purple-500 !border-2 !border-neutral-900 transition-transform hover:scale-125 focus:ring-2 focus:ring-purple-400"
            />

            {/* Decorative Glow on Hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
    );
};

export default memo(ActivityNode);
