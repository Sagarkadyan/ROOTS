"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { TreeNodeChild, TreeDataRoot, treeData as staticTreeData } from "../../lib/treeData";
import { NodeDetailPanel } from "./NodeDetailPanel";
import { 
  Code2, 
  Database, 
  Palette, 
  Activity, 
  Shield, 
  Circle,
  LucideIcon
} from "lucide-react";
import { motion } from "framer-motion";

const getIconForCategory = (id: string): LucideIcon => {
  switch (id) {
    case 'web-dev': return Code2;
    case 'data-science': return Database;
    case 'ui-ux': return Palette;
    case 'devops': return Activity;
    case 'cybersecurity': return Shield;
    default: return Circle;
  }
};

interface ProcessedNode {
  id: string;
  label: string;
  color: string;
  depth: number;
  x: number;
  y: number;
  parent: ProcessedNode | null;
  data: TreeNodeChild;
  hasChildren: boolean;
}

const CANVAS_WIDTH = 2400;
const CANVAS_HEIGHT = 1400;

export default function TreeCanvas() {
  const [treeData, setTreeData] = useState<TreeDataRoot>(staticTreeData);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<TreeNodeChild | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();
  
  const nodeTimingRef = useRef<Map<string, { start: number, end: number }>>(new Map());
  const hoverRef = useRef<string | null>(null);

  useEffect(() => {
    fetch("/api/tree")
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (data && Array.isArray(data.children)) setTreeData(data);
      })
      .catch(() => {
        // Fallback already set via useState(staticTreeData)
      });

    if (containerRef.current) {
      containerRef.current.scrollLeft = (CANVAS_WIDTH - containerRef.current.clientWidth) / 2;
    }
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const layoutNodes = useMemo(() => {
    if (!treeData) return [];
    
    const nodes: ProcessedNode[] = [];
    
    function traverse(node: TreeNodeChild | TreeDataRoot, depth: number, minX: number, maxX: number, parent: ProcessedNode | null) {
      const x = (minX + maxX) / 2;
      const y = 280 + depth * 220; 
      
      let pNode: ProcessedNode | null = null;
      
      if (depth > 0) {
        pNode = {
          id: node.id,
          label: (node as any).label,
          color: (node as any).color || "#4ade80",
          depth,
          x,
          y,
          parent,
          data: node as TreeNodeChild,
          hasChildren: !!(node.children && node.children.length > 0)
        };
        nodes.push(pNode);
      }
      
      const children = node.children || [];
      const isExpanded = depth === 0 || expandedIds.has((node as any).id);
      
      if (isExpanded && children.length > 0) {
        const step = (maxX - minX) / children.length;
        children.forEach((child, i) => {
          traverse(child, depth + 1, minX + i * step, minX + (i + 1) * step, depth === 0 ? null : pNode!);
        });
      }
    }
    
    traverse(treeData, 0, 100, CANVAS_WIDTH - 100, null);
    return nodes;
  }, [treeData, expandedIds]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!ctx || !canvas) return;

    const now = performance.now() / 1000;
    layoutNodes.forEach(n => {
      if (!nodeTimingRef.current.has(n.id)) {
        let start = now;
        if (n.parent) {
          const pt = nodeTimingRef.current.get(n.parent.id);
          if (pt) start = pt.end;
        }
        nodeTimingRef.current.set(n.id, { start, end: start + 0.5 });
      }
    });

    const drawPartialBezier = (ctx: CanvasRenderingContext2D, p0: {x: number, y: number}, p1: {x: number, y: number}, p2: {x: number, y: number}, p3: {x: number, y: number}, progress: number) => {
      ctx.moveTo(p0.x, p0.y);
      const steps = Math.max(5, Math.floor(progress * 40));
      for (let i = 1; i <= steps; i++) {
        const t = (i / steps) * progress;
        const inv = 1 - t;
        const x = inv*inv*inv * p0.x + 3*inv*inv*t * p1.x + 3*inv*t*t * p2.x + t*t*t * p3.x;
        const y = inv*inv*inv * p0.y + 3*inv*inv*t * p1.y + 3*inv*t*t * p2.y + t*t*t * p3.y;
        ctx.lineTo(x, y);
      }
    };

    const draw = () => {
      const currentTime = performance.now() / 1000;
      
      const bgGrd = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      bgGrd.addColorStop(0, "#050a0e");
      bgGrd.addColorStop(1, "#020406");
      ctx.fillStyle = bgGrd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const grd = ctx.createRadialGradient(CANVAS_WIDTH/2, 180, 0, CANVAS_WIDTH/2, 180, 1000);
      grd.addColorStop(0, "rgba(74, 222, 128, 0.08)");
      grd.addColorStop(0.5, "rgba(6, 182, 212, 0.03)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const hoveredId = hoverRef.current;
      const pathIds = new Set<string>();
      if (hoveredId) {
        let current = layoutNodes.find(n => n.id === hoveredId);
        while (current) {
          pathIds.add(current.id);
          current = current.parent;
        }
      }

      layoutNodes.forEach(node => {
        const timing = nodeTimingRef.current.get(node.id);
        if (!timing || currentTime < timing.start) return;

        const progress = Math.min(1, (currentTime - timing.start) / (timing.end - timing.start));
        const px = node.parent ? node.parent.x : CANVAS_WIDTH / 2;
        const py = node.parent ? node.parent.y : 180;
        
        const isHoveredPath = pathIds.has(node.id);
        const fadeOutOthers = hoveredId !== null && !isHoveredPath;

        ctx.beginPath();
        ctx.strokeStyle = node.color;
        ctx.lineWidth = isHoveredPath ? 5 : Math.max(1, 3 - node.depth * 0.5);
        
        if (isHoveredPath) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = node.color;
          ctx.globalAlpha = 1;
        } else {
          ctx.shadowBlur = 4;
          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.globalAlpha = fadeOutOthers ? 0.1 : 0.4;
        }

        const cp1 = { x: px, y: py + (node.y - py) * 0.6 };
        const cp2 = { x: node.x, y: py + (node.y - py) * 0.4 };
        const p0 = { x: px, y: py };
        const p3 = { x: node.x, y: node.y };

        if (progress < 1) {
          drawPartialBezier(ctx, p0, cp1, cp2, p3, progress);
        } else {
          ctx.moveTo(p0.x, p0.y);
          ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p3.x, p3.y);
        }
        
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current!);
  }, [layoutNodes]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative overflow-auto custom-scrollbar bg-[#050a0e]" 
      onClick={() => setSelectedNode(null)}
    >
      <style>{`
        @keyframes growNode {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.6); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .node-enter {
          animation: growNode 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      <div className="relative mx-auto" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="absolute inset-0 pointer-events-none"
        />

        {layoutNodes.map((node) => {
          const isExpanded = expandedIds.has(node.id);
          const isMainNode = node.depth <= 1;
          const animDelay = `${(node.depth * 0.15)}s`;
          const IconCmp = getIconForCategory(node.id);

          return (
            <div
              key={node.id}
              onMouseEnter={() => { hoverRef.current = node.id; }}
              onMouseLeave={() => { hoverRef.current = null; }}
              onClick={(e) => {
                e.stopPropagation();
                if (node.hasChildren) toggleExpand(node.id);
                setSelectedNode(node.data);
              }}
              className={`absolute node-enter flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 z-10`}
              style={{
                left: node.x,
                top: node.y,
                animationDelay: animDelay,
                opacity: 0
              }}
            >
              {isMainNode ? (
                <div 
                  className={`px-6 py-5 rounded-3xl font-body font-bold text-lg tracking-wide border-2 flex flex-col items-center gap-3 backdrop-blur-xl transition-all min-w-[160px]`}
                  style={{
                    backgroundColor: `rgba(10, 22, 40, 0.7)`,
                    borderColor: isExpanded ? node.color : `${node.color}60`,
                    color: "#ffffff",
                    boxShadow: isExpanded 
                      ? `0 0 30px ${node.color}40, inset 0 0 15px ${node.color}20` 
                      : `0 10px 25px rgba(0,0,0,0.5)`,
                    transform: isExpanded ? 'translateY(-5px)' : 'none'
                  }}
                >
                  <div 
                    className="p-3 rounded-2xl mb-1" 
                    style={{ backgroundColor: `${node.color}20`, border: `1px solid ${node.color}40` }}
                  >
                    <IconCmp style={{ color: node.color }} size={28} />
                  </div>
                  <div className="text-[10px] uppercase tracking-widest opacity-60" style={{ color: node.color }}>
                    Domain
                  </div>
                  <span className="text-center leading-tight">{node.label}</span>
                  {node.hasChildren && (
                    <div className="mt-1 w-6 h-6 rounded-full flex items-center justify-center border border-white/20 bg-white/5">
                      <span className="text-sm font-light">
                        {isExpanded ? "−" : "+"}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className={`px-4 py-1.5 rounded-full font-body font-medium text-xs tracking-wider border flex items-center gap-2 backdrop-blur-md transition-all whitespace-nowrap`}
                  style={{
                    backgroundColor: `${node.color}15`,
                    borderColor: `${node.color}40`,
                    color: "#e2ffe8",
                    boxShadow: `0 4px 15px rgba(0,0,0,0.3)`
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: node.color, boxShadow: `0 0 8px ${node.color}` }} />
                  {node.label}
                </div>
              )}
            </div>
          );
        })}

        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[400px] h-[200px] flex items-center justify-center pointer-events-none z-10">
          <svg viewBox="0 0 400 200" className="w-full h-full filter drop-shadow-[0_0_20px_rgba(74,222,128,0.3)]">
            <defs>
              <linearGradient id="tree-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <motion.path 
              d="M 200 180 Q 200 100 120 60 Q 150 40 200 40 Q 250 40 280 60 Q 200 100 200 180" 
              fill="url(#tree-grad)"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
            />
            {[...Array(5)].map((_, i) => (
              <motion.circle
                key={i}
                cx={150 + i * 25}
                cy={50 + Math.sin(i) * 10}
                r="3"
                fill="#ffffff"
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 + i, ease: "easeInOut" }}
              />
            ))}
          </svg>
        </div>

        <div 
          className="absolute left-1/2 top-[180px] w-8 h-8 rounded-full border-4 border-[#0a1628] bg-[#4ade80] transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_40px_rgba(74,222,128,0.8)] z-20"
        />
      </div>

      <NodeDetailPanel 
        node={selectedNode} 
        onClose={() => setSelectedNode(null)} 
      />
    </div>
  );
}
