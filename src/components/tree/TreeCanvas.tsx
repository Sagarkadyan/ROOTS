"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { treeData, TreeNodeChild } from "../../lib/treeData";
import { NodeDetailPanel } from "./NodeDetailPanel";

interface Point {
  x: number;
  y: number;
}

interface ProcessedNode extends TreeNodeChild {
  x: number;
  y: number;
  parentId: string | null;
  depth: number;
  angle: number;
  isVisible: boolean;
  parentPos?: Point;
  pathD?: string;
  growDelay: number;
  growDuration: number;
  arriveTime: number;
}

function hashStringToSeed(str: string) {
  // Deterministic seed for organic jitter based on id.
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function TreeCanvas() {
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set(["web-dev"]));
  const [selectedNode, setSelectedNode] = useState<TreeNodeChild | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hasBooted, setHasBooted] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setHasBooted(true), 1500);
    return () => window.clearTimeout(t);
  }, []);

  const toggleExpand = useCallback((nodeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedNodeIds(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const handleNodeClick = useCallback((node: TreeNodeChild, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode(node);
    if (node.children && node.children.length > 0) {
      toggleExpand(node.id);
    }
  }, [toggleExpand]);

  const handleCanvasClick = useCallback(() => {
    if (selectedNode) setSelectedNode(null);
  }, [selectedNode]);

  // Layout Algorithm: Bottom-origin organic root growth
  const processedNodes = useMemo(() => {
    const nodes: ProcessedNode[] = [];
    const viewW = 800;
    const viewH = 800;
    const origin: Point = { x: viewW / 2, y: 640 }; // where roots start branching

    const trunkDuration = 1.4;
    const baseChildDelay = 0.14;
    const baseStartDelay = hasBooted ? 0 : trunkDuration;

    const buildPath = (from: Point, to: Point, seedStr: string) => {
      const seed = hashStringToSeed(seedStr);
      const rand = mulberry32(seed);

      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const px = -uy;
      const py = ux;

      // Organic curvature + slight wobble.
      const wobble = (rand() - 0.5) * clamp(len * 0.22, 6, 36);
      const wobble2 = (rand() - 0.5) * clamp(len * 0.14, 4, 26);

      const cp1 = {
        x: from.x + ux * (len * 0.28) + px * wobble,
        y: from.y + uy * (len * 0.28) + py * wobble,
      };
      const cp2 = {
        x: from.x + ux * (len * 0.78) + px * wobble2,
        y: from.y + uy * (len * 0.78) + py * wobble2,
      };

      return `M ${from.x} ${from.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${to.x} ${to.y}`;
    };

    const processNode = (
      node: TreeNodeChild,
      parentId: string | null,
      depth: number,
      parentPos: Point,
      parentAngle: number,
      siblingIndex: number,
      siblingCount: number,
      parentArriveTime: number
    ) => {
      const rand = mulberry32(hashStringToSeed(node.id));

      const spread = clamp(1.15 / (depth + 1), 0.22, 0.95);
      const t = siblingCount <= 1 ? 0.5 : siblingIndex / (siblingCount - 1);
      const offset = (t - 0.5) * spread;
      const jitter = (rand() - 0.5) * 0.22;
      const angle = parentAngle + offset + jitter;

      const baseLen = 210 * Math.pow(0.78, depth);
      const lenJitter = 0.78 + rand() * 0.44;
      const length = clamp(baseLen * lenJitter, 70, 240);

      const x = parentPos.x + Math.cos(angle) * length;
      const y = parentPos.y + Math.sin(angle) * length;

      const childPos = {
        x: clamp(x, 60, viewW - 60),
        y: clamp(y, 80, viewH - 80),
      };

      const growDuration = clamp(0.72 + depth * 0.1 + rand() * 0.25, 0.7, 1.4);
      const growDelay = parentArriveTime + baseChildDelay;
      const arriveTime = growDelay + growDuration;

      const pathD = buildPath(parentPos, childPos, `${parentId ?? "root"}->${node.id}`);

      nodes.push({
        ...node,
        x: childPos.x,
        y: childPos.y,
        parentId,
        depth,
        angle,
        isVisible: true,
        parentPos,
        pathD,
        growDelay,
        growDuration,
        arriveTime,
      });

      if (expandedNodeIds.has(node.id) && node.children && node.children.length > 0) {
        node.children.forEach((child, i) =>
          processNode(child, node.id, depth + 1, childPos, angle, i, node.children!.length, arriveTime)
        );
      }
    };

    // Primary domains: spread out like main roots (left ↔ right), mostly upward.
    const domainCount = treeData.children.length;
    const totalSpan = Math.PI * 0.92;
    const startAngle = -Math.PI * (0.5 + 0.46); // ~ -2.95 rad (up-left)
    const step = domainCount <= 1 ? 0 : totalSpan / (domainCount - 1);

    treeData.children.forEach((domain, i) => {
      const baseAngle = startAngle + i * step;
      // subtle asymmetry so it doesn't feel like a chart
      const rand = mulberry32(hashStringToSeed(domain.id));
      const angle = baseAngle + (rand() - 0.5) * 0.16;
      processNode(domain, treeData.id, 0, origin, angle, i, domainCount, baseStartDelay);
    });

    return nodes;
  }, [expandedNodeIds, hasBooted]);

  const activeNodeId = hoveredNodeId ?? selectedNode?.id ?? null;

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#050a0e]" onClick={handleCanvasClick}>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-gradient from-[var(--accent-teal)] to-transparent blur-[120px]" />
      </div>

      <svg 
        viewBox="0 0 800 800"
        className="w-full h-full object-contain cursor-grab active:cursor-grabbing select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="trunk-grad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#1b120d" />
            <stop offset="45%" stopColor="#2b221b" />
            <stop offset="100%" stopColor="var(--accent-teal)" />
          </linearGradient>
        </defs>

        {/* Phase 1: Trunk emerges first (bottom → up) */}
        <motion.g>
          <motion.path
            d="M 400 790 C 400 745 400 700 400 640"
            stroke="url(#trunk-grad)"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
          <motion.path
            d="M 398 790 C 398 742 400 702 402 640"
            stroke="rgba(74, 222, 128, 0.14)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.55, ease: "easeInOut" }}
          />
        </motion.g>

        {/* Links (Roots) */}
        <g>
          <AnimatePresence>
            {processedNodes.map((node) => {
              if (!node.parentPos) return null;

              const d = node.pathD ?? `M ${node.parentPos.x} ${node.parentPos.y} L ${node.x} ${node.y}`;
              const isActive = activeNodeId === node.id;

              const seed = mulberry32(hashStringToSeed(`thickness:${node.id}`));
              const thicknessJitter = (seed() - 0.5) * 1.4;
              const baseW = Math.max(1.2, 7.5 - node.depth * 1.55);
              const wOuter = clamp(baseW + 2.2 + thicknessJitter, 2, 10);
              const wInner = clamp(baseW - 1.4 + thicknessJitter * 0.4, 1, 7);

              return (
                <motion.g key={`link-${node.id}`}>
                  {/* Outer bark (subtle depth + thickness variation) */}
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={wOuter}
                    strokeLinecap="round"
                    opacity={isActive ? 0.22 : 0.14}
                    style={{ filter: isActive ? "url(#glow)" : "none" }}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: isActive ? 0.22 : 0.14 }}
                    exit={{ pathLength: 0, opacity: 0 }}
                    transition={{ duration: node.growDuration, delay: node.growDelay, ease: "easeInOut" }}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onClick={(e) => handleNodeClick(node, e)}
                    className="cursor-pointer"
                  />
                  {/* Inner living root (colored) */}
                  <motion.path
                    d={d}
                    fill="none"
                    stroke={node.color}
                    strokeWidth={wInner}
                    strokeLinecap="round"
                    opacity={isActive ? 0.9 : 0.55}
                    style={{
                      filter: isActive ? "drop-shadow(0 0 10px rgba(255,255,255,0.18))" : "none",
                    }}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: isActive ? 0.9 : 0.55 }}
                    exit={{ pathLength: 0, opacity: 0 }}
                    transition={{ duration: node.growDuration, delay: node.growDelay, ease: "easeInOut" }}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onClick={(e) => handleNodeClick(node, e)}
                    className="cursor-pointer"
                  />
                </motion.g>
              );
            })}
          </AnimatePresence>
        </g>

        {/* Nodes */}
        <g>
          <AnimatePresence>
            {processedNodes.map((node) => (
              <motion.g
                key={`node-${node.id}`}
                initial={{ scale: 0, opacity: 0, x: node.parentPos?.x || 400, y: node.parentPos?.y || 640 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  x: node.x, 
                  y: node.y,
                  filter: hoveredNodeId === node.id || selectedNode?.id === node.id ? "url(#glow)" : "none"
                }}
                exit={{ scale: 0, opacity: 0, x: node.parentPos?.x || 400, y: node.parentPos?.y || 640 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: Math.max(0, node.arriveTime - 0.06) }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={(e) => handleNodeClick(node, e)}
                className="cursor-pointer group"
              >
                {/* Organic Shape (Leaf/Seed) */}
                <motion.path
                  d="M 0 0 C -12 -8, -12 -20, 0 -28 C 12 -20, 12 -8, 0 0 Z"
                  fill={node.color}
                  opacity={selectedNode?.id === node.id ? 1 : 0.8}
                  whileHover={{ scale: 1.2 }}
                  animate={(() => {
                    const r = mulberry32(hashStringToSeed(`node-wiggle:${node.id}`));
                    const baseRot = (r() - 0.5) * 10;
                    const wiggle = 2 + r() * 2.5;
                    return {
                      rotate: [baseRot - wiggle, baseRot + wiggle, baseRot - wiggle],
                      scale: selectedNode?.id === node.id ? 1.2 : 1,
                    };
                  })()}
                  transition={(() => {
                    const r = mulberry32(hashStringToSeed(`node-wiggle:${node.id}`));
                    const dur = 3.8 + r() * 2.6;
                    return {
                      rotate: { duration: dur, repeat: Infinity, ease: "easeInOut" },
                      scale: { type: "spring", stiffness: 260, damping: 20 },
                    };
                  })()}
                />

                {/* Label */}
                <motion.text
                  y={15}
                  textAnchor="middle"
                  fill="var(--text-primary)"
                  fontSize={12 - node.depth}
                  fontWeight={node.depth === 0 ? "bold" : "medium"}
                  className="pointer-events-none select-none drop-shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: node.arriveTime + 0.06, ease: "easeOut" }}
                >
                  {node.label}
                </motion.text>

                {/* Expand Indicator */}
                {node.children && node.children.length > 0 && (
                  <motion.circle
                    r={3}
                    cy={-32}
                    fill={expandedNodeIds.has(node.id) ? "white" : node.color}
                    animate={{ 
                      scale: expandedNodeIds.has(node.id) ? [1, 1.5, 1] : 1,
                      opacity: expandedNodeIds.has(node.id) ? 1 : 0.6
                    }}
                    transition={{ repeat: expandedNodeIds.has(node.id) ? Infinity : 0, duration: 2 }}
                  />
                )}
              </motion.g>
            ))}
          </AnimatePresence>
        </g>
      </svg>

      {/* UI Overlay */}
      <div className="absolute top-6 left-6 z-10 space-y-2">
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">
          Learning Roots
        </h1>
        <p className="text-sm text-[var(--text-muted)] max-w-[200px]">
          Click nodes to explore subtopics. Your path grows with every click.
        </p>
      </div>

      <NodeDetailPanel 
        node={selectedNode} 
        onClose={() => setSelectedNode(null)} 
      />

      {/* Micro-animations: Fireflies */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[var(--accent-teal)] rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%", 
              opacity: 0 
            }}
            animate={{ 
              x: [null, Math.random() * 100 + "%"],
              y: [null, Math.random() * 100 + "%"],
              opacity: [0, 0.4, 0]
            }}
            transition={{ 
              duration: 10 + Math.random() * 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        ))}
      </div>
    </div>
  );
}
