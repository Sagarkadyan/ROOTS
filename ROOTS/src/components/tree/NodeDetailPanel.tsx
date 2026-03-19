"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TreeNodeChild } from "../../lib/treeData";
import { GlowButton } from "../ui/GlowButton";
import { X, Clock } from "lucide-react";

interface NodeDetailPanelProps {
  node: TreeNodeChild | null;
  onClose: () => void;
}

export const NodeDetailPanel = ({ node, onClose }: NodeDetailPanelProps) => {
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ x: 340 }}
          animate={{ x: 0 }}
          exit={{ x: 340 }}
          transition={{ type: "spring", stiffness: 150, damping: 25 }}
          className="absolute right-0 top-0 h-full w-[340px] bg-glass-card shadow-2xl z-20 flex flex-col rounded-l-3xl rounded-r-none border-l border-[var(--border-glass)]"
        >
          <div 
            className="h-2 w-full shrink-0 rounded-tl-3xl"
            style={{ backgroundColor: node.color }}
          />
          
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mt-4 mb-6">
              <h2 className="font-display font-bold text-3xl mb-2 text-[var(--text-primary)]">
                {node.label}
              </h2>
              <div className="flex gap-3 mb-4">
                {node.estimatedHours && (
                  <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)] border border-[var(--border-glass)]">
                    <Clock className="w-3 h-3" />
                    ~{node.estimatedHours} hours
                  </span>
                )}
                {node.difficulty && (
                  <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)] border border-[var(--border-glass)]">
                    <span className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      <span className={`w-1.5 h-1.5 rounded-full ${node.difficulty !== 'Beginner' ? 'bg-yellow-500' : 'bg-gray-600'}`}></span>
                      <span className={`w-1.5 h-1.5 rounded-full ${node.difficulty === 'Advanced' ? 'bg-red-500' : 'bg-gray-600'}`}></span>
                    </span>
                    {node.difficulty}
                  </span>
                )}
              </div>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                {node.description || "Dive deep into this topic to expand your digital roots and grow your knowledge tree."}
              </p>
            </div>

            {node.children && node.children.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Skills Inside</h3>
                <div className="flex flex-wrap gap-2">
                  {node.children.map(child => (
                    <span 
                      key={child.id}
                      className="text-xs px-3 py-1.5 rounded-full border border-[var(--border-glass)] text-[#e2ffe8]"
                      style={{ backgroundColor: `${node.color}15` }}
                    >
                      {child.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 shrink-0 space-y-3 bg-[#0a1628]/80 backdrop-blur-md border-t border-[var(--border-glass)]">
            <GlowButton fullWidth variant="primary">
              Start Learning →
            </GlowButton>
            <GlowButton fullWidth variant="ghost">
              Add to My Path
            </GlowButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
