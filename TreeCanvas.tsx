"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { treeData, TreeNodeChild } from "../../lib/treeData";
import * as Icons from "lucide-react";

// ─── Constants & Types ──────────────────────────────────────────────────
const NODE_W = 140;
const NODE_H = 40;
const V_GAP = 100;
const ROOT_Y = 280;

interface RootNode {
  id: string;
  label: string;
  color: string;
  depth: number;
  x: number;
  y: number;
  parentId: string | "trunk";
  children?: TreeNodeChild[];
  difficulty?: string;
  estimatedHours?: number;
  description?: string;
}

const difficultyColor: Record<string, string> = {
  Beginner: "#4ade80",
  Intermediate: "#f59e0b",
  Advanced: "#f43f5e",
};

const iconMap: Record<string, keyof typeof Icons> = {
  "web-dev": "Globe",
  "data-science": "BarChart2",
  design: "Pen",
  devops: "Server",
  cybersecurity: "Shield",
};

// ─── Helper Functions ───────────────────────────────────────────────────

function curvePathOrganic(x1: number, y1: number, x2: number, y2: number): string {
  // A curve going downwards organically
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  // Bezier curve from top to bottom
  return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${y1 + (y2 - y1) / 3}, ${x2} ${y2}`;
}

// Recursively builds the root nodes for expanded topics
function buildRootLayout(
  nodes: TreeNodeChild[],
  expanded: Set<string>,
  depth: number,
  parentId: string,
  minX: number,
  maxX: number
): RootNode[] {
  if (nodes.length === 0) return [];
  const result: RootNode[] = [];
  const count = nodes.length;
  const sliceW = (maxX - minX) / count;

  for (let i = 0; i < count; i++) {
    const node = nodes[i];
    // Center it in its assigned slice
    const x = minX + sliceW * i + sliceW / 2;
    const y = ROOT_Y + depth * V_GAP + (depth === 1 ? 40 : 80);

    const layoutNode: RootNode = {
      id: node.id,
      label: node.label,
      color: node.color,
      depth,
      x,
      y,
      parentId,
      children: node.children,
      difficulty: node.difficulty,
      estimatedHours: node.estimatedHours,
      description: node.description,
    };
    result.push(layoutNode);

    if (expanded.has(node.id) && node.children && node.children.length > 0) {
      // Pass the slice to children
      const childMinX = minX + sliceW * i;
      const childMaxX = childMinX + sliceW;
      const childNodes = buildRootLayout(node.children, expanded, depth + 1, node.id, childMinX, childMaxX);
      result.push(...childNodes);
    }
  }

  return result;
}

// ─── Main Component ─────────────────────────────────────────────────────

export default function TreeCanvas() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<RootNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportW, setViewportW] = useState(1200);
  const [viewportH, setViewportH] = useState(800);

  // Resize Observer
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      setViewportW(entries[0].contentRect.width || 1200);
      setViewportH(entries[0].contentRect.height || 800);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Compute Layout
  const allNodes = useMemo(() => {
    // Ensure the tree always centers within available scroll width, minimum 1200
    const scrollWidth = Math.max(viewportW, 1400); 
    const margin = 100;
    return buildRootLayout(treeData.children, expanded, 1, "trunk", margin, scrollWidth - margin);
  }, [expanded, viewportW]);

  // Edges connecting nodes
  const edges = useMemo(() => {
    const arr: { id: string; x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
    allNodes.forEach((n) => {
      if (n.parentId === "trunk") {
        const scrollWidth = Math.max(viewportW, 1400);
        arr.push({
          id: `trunk-${n.id}`,
          x1: scrollWidth / 2,
          y1: ROOT_Y,
          x2: n.x,
          y2: n.y,
          color: n.color,
        });
      } else {
        const parent = allNodes.find((p) => p.id === n.parentId);
        if (parent) {
          arr.push({
            id: `${parent.id}-${n.id}`,
            x1: parent.x,
            y1: parent.y + NODE_H / 2,
            x2: n.x,
            y2: n.y,
            color: parent.color,
          });
        }
      }
    });
    return arr;
  }, [allNodes, viewportW]);

  const toggleNode = useCallback((node: RootNode) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(node.id)) {
        // Collapse recursively
        const toRemove = new Set<string>();
        const collect = (id: string) => {
          toRemove.add(id);
          allNodes.forEach((n) => {
            if (n.parentId === id) collect(n.id);
          });
        };
        collect(node.id);
        toRemove.forEach((id) => next.delete(id));
      } else {
        if (node.children && node.children.length > 0) next.add(node.id);
      }
      return next;
    });
    setSelected((prev) => (prev?.id === node.id ? null : node));
  }, [allNodes]);

  // Determine container dimensions for scrolling
  const minCanvasW = Math.max(viewportW, 1400);
  const maxNodeY = allNodes.length > 0 ? Math.max(...allNodes.map((n) => n.y)) : ROOT_Y;
  const canvasH = Math.max(viewportH, maxNodeY + 250); // Extra padding at bottom
  const centerX = minCanvasW / 2;

  // Render a detailed panel for selected node
  const renderDetailPanel = () => {
    if (!selected) return null;
    return (
      <div className="fixed bottom-6 left-6 right-6 z-40 md:left-auto md:right-8 md:w-[400px]">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="rounded-2xl p-5 shadow-2xl pointer-events-auto border border-[var(--border-glass)]"
          style={{
            background: "rgba(10, 22, 40, 0.95)",
            border: `1.5px solid ${selected.color}66`,
            boxShadow: `0 8px 32px ${selected.color}20`,
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1"
              style={{ background: selected.color + "22", color: selected.color }}
            >
              <Icons.BookOpen size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="font-bold text-[var(--text-primary)] text-lg leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                  {selected.label}
                </h3>
                {selected.difficulty && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      color: difficultyColor[selected.difficulty] ?? "#e2ffe8",
                      background: (difficultyColor[selected.difficulty] ?? "#e2ffe8") + "22",
                      border: `1px solid ${(difficultyColor[selected.difficulty] ?? "#e2ffe8")}55`,
                    }}
                  >
                    {selected.difficulty}
                  </span>
                )}
              </div>
              {selected.estimatedHours && (
                <span className="text-xs text-[var(--accent-teal)] flex items-center gap-1 mb-2 font-medium">
                  <Icons.Clock size={12} /> ~{selected.estimatedHours} hours to finish
                </span>
              )}
              {selected.description && (
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
                  {selected.description}
                </p>
              )}
              {selected.children && selected.children.length > 0 && (
                <p className="text-[11px] font-medium" style={{ color: selected.color }}>
                  {expanded.has(selected.id) 
                    ? `Expanded showing ${selected.children.length} subtopics.` 
                    : `Contains ${selected.children.length} subtopics. Click to expand.`}
                </p>
              )}
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-[var(--text-muted)] hover:text-white transition-colors"
            >
              <Icons.X size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-auto custom-scrollbar bg-[var(--bg-deep)]"
      onClick={() => setSelected(null)}
    >
      <div className="absolute top-6 left-8 z-30 pointer-events-none">
        <h1 className="font-display font-bold text-3xl text-gradient">The Living Roots</h1>
        <p className="text-[var(--text-muted)] text-sm">Expand the roots to explore topics</p>
      </div>

      <div
        className="relative"
        style={{ width: minCanvasW, height: canvasH }}
      >
        {/* Sky / Air Background behind Tree */}
        <div 
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: ROOT_Y, background: 'linear-gradient(to bottom, transparent, rgba(5,10,14,0.1) 80%, rgba(10,22,40,0.5) 100%)' }}
        />

        {/* Soil Background */}
        <div
          className="absolute left-0 right-0 bottom-0 pointer-events-none"
          style={{
            top: ROOT_Y,
            background: 'linear-gradient(to bottom, rgba(14, 28, 20, 0.4) 0%, rgba(5, 10, 14, 0.9) 100%)',
            borderTop: '2px solid rgba(74, 222, 128, 0.1)',
            boxShadow: 'inset 0 10px 50px rgba(0,0,0,0.5)',
          }}
        />

        {/* Dynamic Static Tree (Trunk + Canopy) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <linearGradient id="trunk-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1a120e" />
              <stop offset="50%" stopColor="#302016" />
              <stop offset="100%" stopColor="#1a120e" />
            </linearGradient>
            {treeData.children.map((d) => (
              <filter key={`glow-${d.id}`} id={`root-glow-${d.id}`}>
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
          </defs>

          {/* Tree Canopy Background Glow */}
          <motion.circle 
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.4, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            cx={centerX} cy={120} r={140} 
            fill="url(#trunk-gradient)" 
            filter="blur(40px)" 
            opacity={0.3} 
          />

          {/* Tree Branches (Simple organic representation) */}
          <path d={`M ${centerX} ${ROOT_Y} Q ${centerX - 20} ${ROOT_Y - 100} ${centerX - 80} ${ROOT_Y - 180}`} fill="none" stroke="#251b14" strokeWidth="16" strokeLinecap="round" />
          <path d={`M ${centerX} ${ROOT_Y} Q ${centerX + 20} ${ROOT_Y - 100} ${centerX + 70} ${ROOT_Y - 160}`} fill="none" stroke="#2a1e16" strokeWidth="14" strokeLinecap="round" />
          <path d={`M ${centerX - 40} ${ROOT_Y - 130} Q ${centerX - 70} ${ROOT_Y - 160} ${centerX - 120} ${ROOT_Y - 150}`} fill="none" stroke="#221812" strokeWidth="8" strokeLinecap="round" />
          <path d={`M ${centerX + 30} ${ROOT_Y - 120} Q ${centerX + 70} ${ROOT_Y - 150} ${centerX + 110} ${ROOT_Y - 120}`} fill="none" stroke="#221812" strokeWidth="7" strokeLinecap="round" />

          {/* Tree Trunk */}
          <path 
            d={`M ${centerX - 20} ${ROOT_Y} C ${centerX - 15} ${ROOT_Y - 100}, ${centerX - 30} ${ROOT_Y - 200}, ${centerX} ${ROOT_Y - 250} C ${centerX + 30} ${ROOT_Y - 200}, ${centerX + 15} ${ROOT_Y - 100}, ${centerX + 20} ${ROOT_Y}`} 
            fill="url(#trunk-gradient)" 
          />

          {/* Leaves canopy points */}
          {[
            { x: centerX, y: ROOT_Y - 250, r: 40 },
            { x: centerX - 60, y: ROOT_Y - 210, r: 50 },
            { x: centerX + 50, y: ROOT_Y - 200, r: 45 },
            { x: centerX - 100, y: ROOT_Y - 160, r: 35 },
            { x: centerX + 90, y: ROOT_Y - 150, r: 35 },
            { x: centerX - 40, y: ROOT_Y - 280, r: 30 },
            { x: centerX + 40, y: ROOT_Y - 270, r: 25 },
          ].map((leaf, i) => (
            <motion.circle
              key={i}
              cx={leaf.x}
              cy={leaf.y}
              r={leaf.r}
              fill="rgba(74, 222, 128, 0.15)"
              stroke="rgba(74, 222, 128, 0.4)"
              strokeWidth="1"
              style={{ originX: `${leaf.x}px`, originY: `${leaf.y}px` }}
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", delay: Math.random() }}
            />
          ))}

          {/* Edges from Trunk to Root topics */}
          <AnimatePresence>
            {edges.map((edge) => (
              <motion.path
                key={edge.id}
                d={curvePathOrganic(edge.x1, edge.y1, edge.x2, edge.y2 - NODE_H / 2)}
                fill="none"
                stroke={edge.color}
                strokeWidth={edge.y1 === ROOT_Y ? 6 : 3}
                strokeOpacity={0.6}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ pathLength: 0, opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                strokeLinecap="round"
                filter={`url(#root-glow-${edge.id.split('-').pop()})`}
              />
            ))}
          </AnimatePresence>
        </svg>

        {/* Nodes layer */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
          <AnimatePresence>
            {allNodes.map((node) => {
              const isSelected = selected?.id === node.id;
              const isExpanded = expanded.has(node.id);
              const hasChildren = !!node.children?.length;
              const IconItem = (Icons[iconMap[node.id] as keyof typeof Icons] || Icons.Circle) as React.ElementType;

              return (
                <motion.div
                  key={node.id}
                  layoutId={node.id}
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="absolute pointer-events-auto cursor-pointer"
                  style={{
                    left: node.x,
                    top: node.y,
                    width: NODE_W,
                    height: NODE_H,
                    transform: "translate(-50%, -50%)",
                    zIndex: isSelected ? 30 : 20,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNode(node);
                    setSelected(node);
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full h-full rounded-xl flex items-center justify-between px-3"
                    style={{
                      background: isSelected
                        ? `linear-gradient(135deg, ${node.color}33, ${node.color}11)`
                        : `rgba(10, 22, 40, 0.8)`,
                      border: `1px solid ${isSelected ? node.color : node.color + "66"}`,
                      boxShadow: isSelected
                        ? `0 0 20px ${node.color}55, inset 0 0 10px ${node.color}22`
                        : `0 4px 12px rgba(0,0,0,0.5)`,
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {node.depth === 1 ? (
                        <div className="shrink-0" style={{ color: node.color }}>
                          <IconItem size={14} />
                        </div>
                      ) : (
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: node.color, boxShadow: `0 0 8px ${node.color}` }}
                        />
                      )}
                      <span className="text-xs font-semibold truncate text-[var(--text-primary)] font-sans">
                        {node.label}
                      </span>
                    </div>

                    {hasChildren && (
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        className="shrink-0 ml-1"
                        style={{ color: node.color }}
                      >
                        <Icons.ChevronRight size={14} />
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {renderDetailPanel()}
      </AnimatePresence>
    </div>
  );
}
