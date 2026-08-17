import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Background,
  BackgroundVariant,
  BaseEdge,
  getBezierPath,
  getViewportForBounds,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeHandle,
  type NodeProps,
  type ReactFlowInstance,
  type Viewport,
} from "@xyflow/react";
import AiAutomationScene from "./AiAutomationScene";
import { HeroSceneBar, type HeroSceneId } from "./HeroSceneChrome";
import ResponsiveAppScene from "./ResponsiveAppScene";
import {
  getHeroScreenLayout,
  getResponsiveAppCameraPlan,
  RESPONSIVE_APP_LAYOUTS,
  type HeroScreenLayout,
  type ResponsiveAppGeometry,
  type ResponsiveAppLayout,
} from "./responsiveAppGeometry";

type WorkflowTone = "source" | "process" | "system" | "outcome";
type WorkflowGlyphName =
  | "shopify"
  | "webhook"
  | "transform"
  | "inventory"
  | "fulfilment"
  | "carrier"
  | "tracking"
  | "outcome";

type PortSpec = {
  id: string;
  type: "source" | "target";
  position: Position;
  offset?: number;
};

type WorkflowNodeData = Record<string, unknown> & {
  eyebrow: string;
  label: string;
  detail: string;
  tone: WorkflowTone;
  glyph: WorkflowGlyphName;
  ports: PortSpec[];
};

type WorkflowNode = Node<WorkflowNodeData, "system">;

type WorkflowEdgeData = Record<string, unknown> & {
  tone: "proof" | "system";
  incident?: boolean;
};

type WorkflowEdge = Edge<WorkflowEdgeData, "operational">;
type WorkflowLayout = HeroScreenLayout;
type WorkflowMotionState = "pending" | "running" | "stable";
type HeroPlaybackController = {
  setPaused: (paused: boolean) => void;
  moveTo: (scene: HeroSceneId, direction: -1 | 1) => void;
};
type WorkflowNodeId =
  | "shopify"
  | "webhook"
  | "validate"
  | "inventory"
  | "fulfilment"
  | "tracking"
  | "carrier"
  | "outcome";

type WorkflowCameraPlan = {
  overview: Viewport;
  ingress: Viewport;
  validation: Viewport;
  branch: Viewport;
  merge: Viewport;
  incident: Viewport;
  returning: Viewport;
  outcome: Viewport;
  static: Viewport;
};

type AiSceneRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type AiSceneGeometry = {
  prompt: AiSceneRect;
  evidence: AiSceneRect;
};

type AiCameraState = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  skewX: number;
};

type AiCameraPlan = {
  prompt: AiCameraState;
  evidence: AiCameraState;
  actions: AiCameraState;
};

const PORT_SIZE = 9;
const FALLBACK_VIEWPORT = { x: 0, y: 0, zoom: 0.62 };
const HERO_SCENE_ORDER: HeroSceneId[] = ["app", "workflow", "ai"];
const HERO_SCENE_LABELS: Record<HeroSceneId, string> = {
  app: "Web and mobile application",
  workflow: "Shopify workflow",
  ai: "AI-assisted review",
};

const AI_SCENE_LAYOUTS: Record<WorkflowLayout, AiSceneGeometry> = {
  desktop: {
    prompt: { x: 60, y: 108, width: 700, height: 318 },
    evidence: { x: 900, y: 34, width: 720, height: 472 },
  },
  medium: {
    prompt: { x: 60, y: 108, width: 700, height: 318 },
    evidence: { x: 900, y: 34, width: 720, height: 472 },
  },
  compact: {
    prompt: { x: 40, y: 70, width: 560, height: 400 },
    evidence: { x: 700, y: 20, width: 560, height: 760 },
  },
};

const getWorkflowLayoutSnapshot = (): WorkflowLayout => {
  return getHeroScreenLayout(window.innerWidth);
};

const subscribeToWorkflowLayout = (notify: () => void) => {
  const compact = window.matchMedia("(max-width: 719px)");
  const medium = window.matchMedia(
    "(min-width: 720px) and (max-width: 1279px)",
  );
  compact.addEventListener("change", notify);
  medium.addEventListener("change", notify);
  return () => {
    compact.removeEventListener("change", notify);
    medium.removeEventListener("change", notify);
  };
};

const subscribeToReducedMotion = (notify: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

const getReducedMotionSnapshot = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getPortPosition = (port: PortSpec, width: number, height: number) => {
  const offset = port.offset ?? 0.5;

  if (port.position === Position.Top || port.position === Position.Bottom) {
    return {
      x: width * offset - PORT_SIZE / 2,
      y:
        port.position === Position.Top
          ? -PORT_SIZE / 2
          : height - PORT_SIZE / 2,
    };
  }

  return {
    x: port.position === Position.Left ? -PORT_SIZE / 2 : width - PORT_SIZE / 2,
    y: height * offset - PORT_SIZE / 2,
  };
};

const makeNode = ({
  id,
  x,
  y,
  width,
  height,
  eyebrow,
  label,
  detail,
  tone,
  glyph,
  ports,
}: {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  eyebrow: string;
  label: string;
  detail: string;
  tone: WorkflowTone;
  glyph: WorkflowGlyphName;
  ports: PortSpec[];
}): WorkflowNode => {
  const handles: NodeHandle[] = ports.map((port) => ({
    id: port.id,
    type: port.type,
    position: port.position,
    ...getPortPosition(port, width, height),
    width: PORT_SIZE,
    height: PORT_SIZE,
  }));

  return {
    id,
    type: "system",
    position: { x, y },
    width,
    height,
    initialWidth: width,
    initialHeight: height,
    handles,
    draggable: false,
    selectable: false,
    connectable: false,
    deletable: false,
    focusable: false,
    data: { eyebrow, label, detail, tone, glyph, ports },
  };
};

const workflowNodes: WorkflowNode[] = [
  makeNode({
    id: "shopify",
    x: 0,
    y: 150,
    width: 184,
    height: 92,
    eyebrow: "Trigger",
    label: "Shopify order",
    detail: "Order created",
    tone: "source",
    glyph: "shopify",
    ports: [{ id: "out", type: "source", position: Position.Right }],
  }),
  makeNode({
    id: "webhook",
    x: 212,
    y: 150,
    width: 192,
    height: 92,
    eyebrow: "Receive",
    label: "Order webhook",
    detail: "Order payload",
    tone: "system",
    glyph: "webhook",
    ports: [
      { id: "in", type: "target", position: Position.Left },
      { id: "out", type: "source", position: Position.Right },
    ],
  }),
  makeNode({
    id: "validate",
    x: 436,
    y: 150,
    width: 204,
    height: 92,
    eyebrow: "Transform",
    label: "Validate & map",
    detail: "Normalize line items",
    tone: "process",
    glyph: "transform",
    ports: [
      { id: "in", type: "target", position: Position.Left },
      {
        id: "out-inventory",
        type: "source",
        position: Position.Right,
        offset: 0.32,
      },
      {
        id: "out-fulfilment",
        type: "source",
        position: Position.Right,
        offset: 0.68,
      },
    ],
  }),
  makeNode({
    id: "inventory",
    x: 682,
    y: 34,
    width: 196,
    height: 92,
    eyebrow: "System",
    label: "Inventory / ERP",
    detail: "Reserve stock",
    tone: "system",
    glyph: "inventory",
    ports: [
      { id: "in", type: "target", position: Position.Left },
      { id: "out", type: "source", position: Position.Bottom },
    ],
  }),
  makeNode({
    id: "fulfilment",
    x: 682,
    y: 266,
    width: 196,

    height: 92,
    eyebrow: "Merge + action",
    label: "3PL fulfilment",
    detail: "Create shipment",
    tone: "system",
    glyph: "fulfilment",
    ports: [
      {
        id: "in-order",
        type: "target",
        position: Position.Left,
        offset: 0.62,
      },
      { id: "in-stock", type: "target", position: Position.Top },
      { id: "out", type: "source", position: Position.Right },
    ],
  }),
  makeNode({
    id: "tracking",
    x: 914,
    y: 34,
    width: 196,
    height: 92,
    eyebrow: "Sync",
    label: "Tracking update",
    detail: "Update Shopify",
    tone: "system",
    glyph: "tracking",
    ports: [
      { id: "in", type: "target", position: Position.Bottom },
      { id: "out", type: "source", position: Position.Right },
    ],
  }),
  makeNode({
    id: "carrier",
    x: 914,
    y: 266,
    width: 196,
    height: 92,
    eyebrow: "External API",
    label: "Carrier service",
    detail: "Return tracking",
    tone: "system",
    glyph: "carrier",
    ports: [
      { id: "in", type: "target", position: Position.Left },
      {
        id: "out",
        type: "source",
        position: Position.Top,
        offset: 0.5,
      },
    ],
  }),
  makeNode({
    id: "outcome",
    x: 1146,
    y: 150,
    width: 216,
    height: 92,
    eyebrow: "Outcome",
    label: "Customer notified",
    detail: "Order status complete",
    tone: "outcome",
    glyph: "outcome",
    ports: [{ id: "in", type: "target", position: Position.Left }],
  }),
];

const makeEdge = ({
  id,
  source,
  sourceHandle,
  target,
  targetHandle,
  tone = "proof",
  incident = false,
}: {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  tone?: WorkflowEdgeData["tone"];
  incident?: boolean;
}): WorkflowEdge => ({
  id,
  type: "operational",
  source,
  sourceHandle,
  target,
  targetHandle,
  selectable: false,
  deletable: false,
  focusable: false,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 7,
    height: 7,
    color: "var(--line-strong)",
  },
  data: { tone, incident },
});

const workflowEdges: WorkflowEdge[] = [
  makeEdge({
    id: "order-webhook",
    source: "shopify",
    sourceHandle: "out",
    target: "webhook",
    targetHandle: "in",
  }),
  makeEdge({
    id: "webhook-validate",
    source: "webhook",
    sourceHandle: "out",
    target: "validate",
    targetHandle: "in",
  }),
  makeEdge({
    id: "validate-inventory",
    source: "validate",
    sourceHandle: "out-inventory",
    target: "inventory",
    targetHandle: "in",
  }),
  makeEdge({
    id: "validate-fulfilment",
    source: "validate",
    sourceHandle: "out-fulfilment",
    target: "fulfilment",
    targetHandle: "in-order",
  }),
  makeEdge({
    id: "inventory-fulfilment",
    source: "inventory",
    sourceHandle: "out",
    target: "fulfilment",
    targetHandle: "in-stock",
  }),
  makeEdge({
    id: "fulfilment-carrier",
    source: "fulfilment",
    sourceHandle: "out",
    target: "carrier",
    targetHandle: "in",
    incident: true,
  }),
  makeEdge({
    id: "carrier-tracking",
    source: "carrier",
    sourceHandle: "out",
    target: "tracking",
    targetHandle: "in",
    tone: "system",
  }),
  makeEdge({
    id: "tracking-outcome",
    source: "tracking",
    sourceHandle: "out",
    target: "outcome",
    targetHandle: "in",
    tone: "system",
  }),
];

const WorkflowGlyph = ({ name }: { name: WorkflowGlyphName }) => {
  let glyph;

  switch (name) {
    case "shopify":
      glyph = (
        <>
          <path d="M6.5 8h11l-.9 9.5H7.4L6.5 8Z" />
          <path d="M9.3 8V6.7a2.7 2.7 0 0 1 5.4 0V8" />
        </>
      );
      break;
    case "webhook":
      glyph = (
        <>
          <path d="M7.2 7.2h3.2v3.2" />
          <path d="M10.4 7.2 6.8 10.8a3.1 3.1 0 0 0 0 4.4 3.1 3.1 0 0 0 4.4 0l1.1-1.1" />
          <path d="m13.6 16.8 3.6-3.6a3.1 3.1 0 0 0 0-4.4 3.1 3.1 0 0 0-4.4 0l-1.1 1.1" />
          <path d="M16.8 16.8h-3.2v-3.2" />
        </>
      );
      break;
    case "transform":
      glyph = (
        <>
          <path d="M5 7h5M14 7h5M5 12h9M18 12h1M5 17h2M11 17h8" />
          <rect x="10" y="5.5" width="4" height="3" rx=".7" />
          <rect x="14" y="10.5" width="4" height="3" rx=".7" />
          <rect x="7" y="15.5" width="4" height="3" rx=".7" />
        </>
      );
      break;
    case "inventory":
      glyph = (
        <>
          <path d="m5 8 7-3 7 3-7 3-7-3Z" />
          <path d="m5 12 7 3 7-3M5 16l7 3 7-3" />
        </>
      );
      break;
    case "fulfilment":
      glyph = (
        <>
          <path d="m5.5 8 6.5-3 6.5 3v8L12 19l-6.5-3V8Z" />
          <path d="m5.5 8 6.5 3 6.5-3M12 11v8" />
        </>
      );
      break;
    case "carrier":
      glyph = (
        <>
          <path d="M4.5 7h9v8h-9zM13.5 10h3l3 3v2h-6z" />
          <path d="M8 17.2a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4ZM17 17.2a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Z" />
        </>
      );
      break;
    case "tracking":
      glyph = (
        <>
          <path d="M18.5 9a7 7 0 0 0-12-2L4.5 9" />
          <path d="M4.5 5v4h4M5.5 15a7 7 0 0 0 12 2l2-2" />
          <path d="M19.5 19v-4h-4" />
        </>
      );
      break;
    default:
      glyph = <path d="m5.5 12.5 4 4 9-9" />;
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {glyph}
    </svg>
  );
};

const SystemNode = ({ id, data, isConnectable }: NodeProps<WorkflowNode>) => (
  <>
    {data.ports
      .filter((port) => port.type === "target")
      .map((port) => (
        <Handle
          key={port.id}
          id={port.id}
          type="target"
          position={port.position}
          isConnectable={isConnectable}
          style={
            port.position === Position.Left || port.position === Position.Right
              ? { top: `${(port.offset ?? 0.5) * 100}%` }
              : { left: `${(port.offset ?? 0.5) * 100}%` }
          }
        />
      ))}
    <div
      className={`hero-workflow-node hero-workflow-node--${data.tone}`}
      data-workflow-node={id}
    >
      <span className="hero-workflow-node__glyph" aria-hidden="true">
        <WorkflowGlyph name={data.glyph} />
      </span>
      <span className="hero-workflow-node__copy">
        <strong className="hero-workflow-node__label">{data.label}</strong>
        <span className="hero-workflow-node__detail">{data.detail}</span>
      </span>
      <span
        className="hero-workflow-node__state"
        data-workflow-node-state={id}
        aria-hidden="true"
      />
      {id === "carrier" ? (
        <span
          className="hero-workflow-node__fault"
          data-workflow-carrier-fault
          aria-hidden="true"
        />
      ) : null}
    </div>
    {data.ports
      .filter((port) => port.type === "source")
      .map((port) => (
        <Handle
          key={port.id}
          id={port.id}
          type="source"
          position={port.position}
          isConnectable={isConnectable}
          style={
            port.position === Position.Left || port.position === Position.Right
              ? { top: `${(port.offset ?? 0.5) * 100}%` }
              : { left: `${(port.offset ?? 0.5) * 100}%` }
          }
        />
      ))}
  </>
);

const OperationalEdge = ({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  markerEnd,
  data,
}: EdgeProps<WorkflowEdge>) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: data?.incident ? 0.22 : 0.28,
  });
  const tone = data?.tone ?? "proof";

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        interactionWidth={0}
        className="hero-workflow-edge__base"
        data-workflow-edge-base={id}
      />
      {data?.incident ? (
        <>
          <path
            d={edgePath}
            pathLength="100"
            className="hero-workflow-edge__packet hero-workflow-edge__packet--proof"
            data-workflow-incident-attempt
          />
          <path
            d={edgePath}
            pathLength="100"
            className="hero-workflow-edge__packet hero-workflow-edge__packet--fault"
            data-workflow-incident-fault
          />
          <path
            d={edgePath}
            pathLength="100"
            className="hero-workflow-edge__packet hero-workflow-edge__packet--system"
            data-workflow-incident-recovery
          />
        </>
      ) : (
        <path
          d={edgePath}
          pathLength="100"
          className={`hero-workflow-edge__packet hero-workflow-edge__packet--${tone}`}
          data-workflow-edge-packet={id}
        />
      )}
    </>
  );
};

const nodeTypes = { system: SystemNode };
const edgeTypes = { operational: OperationalEdge };

const packetEdgeIds = [
  "order-webhook",
  "webhook-validate",
  "validate-inventory",
  "validate-fulfilment",
  "inventory-fulfilment",
  "carrier-tracking",
  "tracking-outcome",
] as const;

const getFixedNodesBounds = (nodes: WorkflowNode[]) => {
  const left = Math.min(...nodes.map((node) => node.position.x));
  const top = Math.min(...nodes.map((node) => node.position.y));
  const right = Math.max(
    ...nodes.map(
      (node) => node.position.x + (node.width ?? node.initialWidth ?? 0),
    ),
  );
  const bottom = Math.max(
    ...nodes.map(
      (node) => node.position.y + (node.height ?? node.initialHeight ?? 0),
    ),
  );

  return { x: left, y: top, width: right - left, height: bottom - top };
};

const getWorkflowCameraPlan = (
  nodes: WorkflowNode[],
  width: number,
  height: number,
  layout: WorkflowLayout,
): WorkflowCameraPlan => {
  const nodesById = Object.fromEntries(
    nodes.map((node) => [node.id, node]),
  ) as Record<WorkflowNodeId, WorkflowNode>;
  const focusMaxZoom =
    layout === "desktop" ? 0.86 : layout === "medium" ? 0.94 : 0.98;
  const overviewMaxZoom =
    layout === "desktop" ? 0.62 : layout === "medium" ? 0.6 : 0.24;
  const focusPadding = layout === "compact" ? 0.045 : 0.12;

  const frame = (ids: WorkflowNodeId[], maxZoom: number, padding: number) =>
    getViewportForBounds(
      getFixedNodesBounds(ids.map((id) => nodesById[id])),
      width,
      height,
      0.18,
      maxZoom,
      padding,
    );

  return {
    overview: frame(
      nodes.map(({ id }) => id as WorkflowNodeId),
      overviewMaxZoom,
      layout === "compact" ? 0.025 : 0.055,
    ),
    ingress: frame(["shopify", "webhook"], focusMaxZoom, focusPadding),
    validation: frame(["webhook", "validate"], focusMaxZoom, focusPadding),
    branch: frame(
      ["validate", "inventory", "fulfilment"],
      focusMaxZoom,
      layout === "compact" ? 0.025 : 0.1,
    ),
    merge: frame(["inventory", "fulfilment"], focusMaxZoom, focusPadding),
    incident: frame(["fulfilment", "carrier"], focusMaxZoom, focusPadding),
    returning: frame(["carrier", "tracking"], focusMaxZoom, focusPadding),
    outcome: frame(["tracking", "outcome"], focusMaxZoom, focusPadding),
    static: frame(
      ["validate", "inventory", "fulfilment"],
      focusMaxZoom,
      layout === "compact" ? 0.025 : 0.08,
    ),
  };
};

const getAiCameraPlan = (
  width: number,
  height: number,
  layout: WorkflowLayout,
): AiCameraPlan => {
  const geometry = AI_SCENE_LAYOUTS[layout];
  const padding = layout === "compact" ? 0.04 : 0.07;
  const maxZoom = layout === "desktop" ? 0.94 : 0.98;

  const frame = (
    rect: AiSceneRect,
    rotation: number,
    skewX: number,
  ): AiCameraState => {
    const scale = Math.min(
      maxZoom,
      width / (rect.width * (1 + padding * 2)),
      height / (rect.height * (1 + padding * 2)),
    );

    return {
      x: width / 2 - (rect.x + rect.width / 2) * scale,
      y: height / 2 - (rect.y + rect.height / 2) * scale,
      scale,
      rotation,
      skewX,
    };
  };

  return {
    prompt: frame(geometry.prompt, -0.3, -0.42),
    evidence:
      layout === "compact"
        ? frame(
            {
              x: geometry.evidence.x + 100,
              y: geometry.evidence.y,
              width: geometry.evidence.width - 200,
              height: 450,
            },
            0.32,
            0.44,
          )
        : frame(geometry.evidence, 0.32, 0.44),
    actions:
      layout === "compact"
        ? frame(
            {
              x: geometry.evidence.x + 100,
              y: geometry.evidence.y + 440,
              width: geometry.evidence.width - 200,
              height: 320,
            },
            0.2,
            0.24,
          )
        : frame(geometry.evidence, 0.32, 0.44),
  };
};

const HeroSystemScreen = () => {
  const rootRef = useRef<HTMLElement | null>(null);
  const flowRef = useRef<HTMLDivElement | null>(null);
  const playbackControllerRef = useRef<HeroPlaybackController | null>(null);
  const manuallyPausedRef = useRef(false);
  const activeSceneRef = useRef<HeroSceneId>("app");
  const deckTransitioningRef = useRef(false);
  const flowInstanceRef = useRef<ReactFlowInstance<
    WorkflowNode,
    WorkflowEdge
  > | null>(null);
  const layout = useSyncExternalStore<WorkflowLayout>(
    subscribeToWorkflowLayout,
    getWorkflowLayoutSnapshot,
    () => "desktop",
  );
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
  const [flowReady, setFlowReady] = useState(false);
  const [flowSize, setFlowSize] = useState({ width: 0, height: 0 });
  const [motionState, setMotionState] =
    useState<WorkflowMotionState>("pending");
  const [activeScene, setActiveScene] = useState<HeroSceneId>("app");
  const [isPaused, setIsPaused] = useState(false);
  const [isDeckTransitioning, setIsDeckTransitioning] = useState(false);
  const [statusAnnouncement, setStatusAnnouncement] = useState("");
  const initialResponsiveViewport =
    flowSize.width > 0 && flowSize.height > 0
      ? getResponsiveAppCameraPlan(flowSize.width, flowSize.height, layout)
          .desktop
      : undefined;

  const updateActiveScene = useCallback((scene: HeroSceneId) => {
    activeSceneRef.current = scene;
    setActiveScene(scene);
  }, []);

  const togglePlayback = useCallback(() => {
    if (deckTransitioningRef.current) return;

    const paused = !manuallyPausedRef.current;
    manuallyPausedRef.current = paused;
    setIsPaused(paused);
    setStatusAnnouncement(paused ? "Animation paused." : "Animation playing.");
    playbackControllerRef.current?.setPaused(paused);
  }, []);

  const moveToAdjacentScene = useCallback((direction: -1 | 1) => {
    if (deckTransitioningRef.current) return;

    const currentIndex = HERO_SCENE_ORDER.indexOf(activeSceneRef.current);
    const nextIndex =
      (currentIndex + direction + HERO_SCENE_ORDER.length) %
      HERO_SCENE_ORDER.length;
    const nextScene = HERO_SCENE_ORDER[nextIndex];
    playbackControllerRef.current?.moveTo(nextScene, direction);
    setStatusAnnouncement(
      `Moving to scene ${nextIndex + 1} of ${HERO_SCENE_ORDER.length}: ${HERO_SCENE_LABELS[nextScene]}.`,
    );
  }, []);

  const handleInit = useCallback(
    (instance: ReactFlowInstance<WorkflowNode, WorkflowEdge>) => {
      flowInstanceRef.current = instance;
      setMotionState("pending");
      setFlowReady(true);
    },
    [],
  );

  useLayoutEffect(() => {
    const flow = flowRef.current;
    if (!flow) return;

    const updateSize = () => {
      const { clientWidth: width, clientHeight: height } = flow;
      setFlowSize((current) =>
        Math.abs(current.width - width) > 1 ||
        Math.abs(current.height - height) > 1
          ? { width, height }
          : current,
      );
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setFlowSize((current) =>
        Math.abs(current.width - width) > 1 ||
        Math.abs(current.height - height) > 1
          ? { width, height }
          : current,
      );
    });
    resizeObserver.observe(flow);
    return () => resizeObserver.disconnect();
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const flowInstance = flowInstanceRef.current;
    if (
      !root ||
      !flowInstance ||
      !flowReady ||
      flowSize.width <= 0 ||
      flowSize.height <= 0
    ) {
      return;
    }

    const cameraPlan = getWorkflowCameraPlan(
      workflowNodes,
      flowSize.width,
      flowSize.height,
      layout,
    );
    const responsiveCameraPlan = getResponsiveAppCameraPlan(
      flowSize.width,
      flowSize.height,
      layout,
    );
    const aiCameraPlan = getAiCameraPlan(
      flowSize.width,
      flowSize.height,
      layout,
    );
    const applyViewport = (viewport: Viewport) => {
      void flowInstance.setViewport(viewport, { duration: 0 });
    };

    applyViewport(
      prefersReducedMotion ? cameraPlan.static : cameraPlan.overview,
    );

    if (prefersReducedMotion) {
      playbackControllerRef.current = null;
      updateActiveScene("workflow");
      setMotionState("stable");
      return;
    }

    let cancelled = false;
    let revert: () => void = () => undefined;
    let observer: IntersectionObserver | undefined;
    let handleVisibility: () => void = () => undefined;
    let playbackController: HeroPlaybackController | null = null;
    let stopDeckTransition: () => void = () => undefined;

    void import("gsap")
      .then(({ gsap }) => {
        if (cancelled) return;

        const context = gsap.context(() => {
          const packets = Object.fromEntries(
            packetEdgeIds.map((id) => [
              id,
              root.querySelector<SVGPathElement>(
                `[data-workflow-edge-packet="${id}"]`,
              ),
            ]),
          ) as Record<(typeof packetEdgeIds)[number], SVGPathElement | null>;
          const incidentBase = root.querySelector<SVGPathElement>(
            '[data-workflow-edge-base="fulfilment-carrier"]',
          );
          const incidentAttempt = root.querySelector<SVGPathElement>(
            "[data-workflow-incident-attempt]",
          );
          const incidentFault = root.querySelector<SVGPathElement>(
            "[data-workflow-incident-fault]",
          );
          const incidentRecovery = root.querySelector<SVGPathElement>(
            "[data-workflow-incident-recovery]",
          );
          const nodeStates = Object.fromEntries(
            workflowNodes.map(({ id }) => [
              id,
              root.querySelector<HTMLElement>(
                `[data-workflow-node-state="${id}"]`,
              ),
            ]),
          ) as Record<string, HTMLElement | null>;
          const carrier = root.querySelector<HTMLElement>(
            '[data-workflow-node="carrier"]',
          );
          const carrierFault = root.querySelector<HTMLElement>(
            "[data-workflow-carrier-fault]",
          );
          const workflowScene = root.querySelector<HTMLElement>(
            "[data-workflow-scene]",
          );
          const workflowCard = root.querySelector<HTMLElement>(
            '[data-hero-card="workflow"]',
          );
          const responsiveScene = root.querySelector<HTMLElement>(
            "[data-responsive-scene]",
          );
          const responsiveCard = root.querySelector<HTMLElement>(
            '[data-hero-card="app"]',
          );
          const responsiveStage = root.querySelector<HTMLElement>(
            "[data-responsive-camera]",
          );
          const responsiveApp = root.querySelector<HTMLElement>(
            "[data-responsive-app-shell]",
          );
          const responsiveRegions = Object.fromEntries(
            (["header", "nav", "toolbar", "orders", "detail"] as const).map(
              (region) => [
                region,
                root.querySelector<HTMLElement>(
                  `[data-responsive-region="${region}"]`,
                ),
              ],
            ),
          );
          const responsiveInterior = Array.from(
            root.querySelectorAll<HTMLElement>("[data-responsive-interior]"),
          );
          const responsiveCompletion = root.querySelector<HTMLElement>(
            "[data-responsive-completion-rule]",
          );
          const responsiveBrowserChrome = root.querySelector<HTMLElement>(
            "[data-responsive-browser-chrome]",
          );
          const responsivePhoneHardware = root.querySelector<HTMLElement>(
            "[data-responsive-phone-hardware]",
          );
          const aiScene = root.querySelector<HTMLElement>("[data-ai-scene]");
          const aiCard = root.querySelector<HTMLElement>(
            '[data-hero-card="ai"]',
          );
          const aiStage = root.querySelector<HTMLElement>("[data-ai-stage]");
          const aiCamera = root.querySelector<HTMLElement>("[data-ai-camera]");
          const aiPromptPlane = root.querySelector<HTMLElement>(
            "[data-ai-prompt-plane]",
          );
          const aiEvidencePlane = root.querySelector<HTMLElement>(
            "[data-ai-evidence-plane]",
          );
          const aiQuestionChars = Array.from(
            root.querySelectorAll<HTMLElement>("[data-ai-question-char]"),
          );
          const aiCursor = root.querySelector<HTMLElement>("[data-ai-cursor]");
          const aiPromptRule = root.querySelector<HTMLElement>(
            "[data-ai-prompt-rule]",
          );
          const aiPromptAction = root.querySelector<HTMLElement>(
            "[data-ai-prompt-action]",
          );
          const aiAnswer = root.querySelector<HTMLElement>("[data-ai-answer]");
          const aiSummary =
            root.querySelector<HTMLElement>("[data-ai-summary]");
          const aiDonutSegments = Array.from(
            root.querySelectorAll<SVGCircleElement>("[data-ai-donut-segment]"),
          );
          const aiBarFills = Array.from(
            root.querySelectorAll<HTMLElement>("[data-ai-bar-fill]"),
          );
          const aiActionTable = root.querySelector<HTMLElement>(
            "[data-ai-action-table]",
          );
          const aiReviewAction = root.querySelector<HTMLElement>(
            "[data-ai-review-action]",
          );
          const resolvedPackets = Object.values(packets).filter(
            (packet): packet is SVGPathElement => Boolean(packet),
          );
          const resolvedNodeStates = Object.values(nodeStates).filter(
            (state): state is HTMLElement => Boolean(state),
          );
          const resolvedResponsiveRegions = Object.values(
            responsiveRegions,
          ).filter((region): region is HTMLElement => Boolean(region));

          if (
            resolvedPackets.length !== packetEdgeIds.length ||
            resolvedNodeStates.length !== workflowNodes.length ||
            !incidentBase ||
            !incidentAttempt ||
            !incidentFault ||
            !incidentRecovery ||
            !carrier ||
            !carrierFault ||
            !workflowScene ||
            !workflowCard ||
            !responsiveScene ||
            !responsiveCard ||
            !responsiveStage ||
            !responsiveApp ||
            resolvedResponsiveRegions.length !== 5 ||
            responsiveInterior.length === 0 ||
            !responsiveCompletion ||
            !responsiveBrowserChrome ||
            !responsivePhoneHardware ||
            !aiScene ||
            !aiCard ||
            !aiStage ||
            !aiCamera ||
            !aiPromptPlane ||
            !aiEvidencePlane ||
            aiQuestionChars.length === 0 ||
            !aiCursor ||
            !aiPromptRule ||
            !aiPromptAction ||
            !aiAnswer ||
            !aiSummary ||
            aiDonutSegments.length !== 3 ||
            aiBarFills.length !== 3 ||
            !aiActionTable ||
            !aiReviewAction
          ) {
            applyViewport(cameraPlan.overview);
            playbackControllerRef.current = null;
            updateActiveScene("workflow");
            setMotionState("stable");
            return;
          }

          const transientPackets = [
            ...resolvedPackets,
            incidentAttempt,
            incidentFault,
            incidentRecovery,
          ];
          const animatedViewport = {
            x: cameraPlan.overview.x,
            y: cameraPlan.overview.y,
            scale: cameraPlan.overview.zoom,
          };
          const responsiveViewport = {
            x: responsiveCameraPlan.desktop.x,
            y: responsiveCameraPlan.desktop.y,
            scale: responsiveCameraPlan.desktop.zoom,
          };
          const aiViewport = { ...aiCameraPlan.prompt };
          const aiDonutOffsets = aiDonutSegments.map((segment) =>
            Number(segment.getAttribute("stroke-dashoffset") ?? 0),
          );

          const setViewport = () => {
            void flowInstance.setViewport(
              {
                x: animatedViewport.x,
                y: animatedViewport.y,
                zoom: animatedViewport.scale,
              },
              { duration: 0 },
            );
          };

          const setResponsiveViewport = () => {
            gsap.set(responsiveStage, {
              x: responsiveViewport.x,
              y: responsiveViewport.y,
              scale: responsiveViewport.scale,
              transformOrigin: "0 0",
            });
          };

          const setAiViewport = () => {
            gsap.set(aiCamera, {
              x: aiViewport.x,
              y: aiViewport.y,
              scale: aiViewport.scale,
              rotation: aiViewport.rotation,
              skewX: aiViewport.skewX,
              transformOrigin: "0 0",
            });
          };

          const setAiLayout = () => {
            const geometry = AI_SCENE_LAYOUTS[layout];

            aiScene.dataset.aiLayout = layout;
            gsap.set(aiPromptPlane, {
              x: geometry.prompt.x,
              y: geometry.prompt.y,
              width: geometry.prompt.width,
              height: geometry.prompt.height,
              rotation: -0.7,
              skewX: -0.8,
              transformOrigin: "50% 50%",
            });
            gsap.set(aiEvidencePlane, {
              x: geometry.evidence.x,
              y: geometry.evidence.y,
              width: geometry.evidence.width,
              height: geometry.evidence.height,
              rotation: 0.45,
              skewX: 0.55,
              transformOrigin: "50% 50%",
            });
          };

          const resetAiContent = () => {
            setAiLayout();
            Object.assign(aiViewport, aiCameraPlan.prompt);
            setAiViewport();
            gsap.set(aiStage, {
              rotationY: -1.6,
              skewX: -0.35,
              scale: 0.985,
              transformOrigin: "50% 50%",
            });
            gsap.set(aiPromptPlane, { autoAlpha: 1, scale: 0.985 });
            gsap.set(aiEvidencePlane, { autoAlpha: 0.16, scale: 1 });
            gsap.set(aiQuestionChars, { autoAlpha: 0 });
            gsap.set(aiCursor, { autoAlpha: 0 });
            gsap.set(aiPromptRule, {
              scaleX: 0,
              transformOrigin: "0 50%",
            });
            gsap.set(aiPromptAction, { scale: 1, transformOrigin: "50% 50%" });
            gsap.set(aiAnswer, { autoAlpha: 0, y: 8 });
            gsap.set(aiSummary, { autoAlpha: 0, y: 8 });
            gsap.set(aiDonutSegments, { strokeDashoffset: 100 });
            gsap.set(aiBarFills, {
              scaleX: 0,
              transformOrigin: "0 50%",
            });
            gsap.set(aiActionTable, {
              autoAlpha: 0,
              y: 10,
              clipPath: "inset(0 0 100% 0)",
            });
            gsap.set(aiReviewAction, { autoAlpha: 0, y: 4 });
          };

          const setResponsiveLayout = (mode: ResponsiveAppLayout) => {
            const geometry = RESPONSIVE_APP_LAYOUTS[mode];
            const camera = responsiveCameraPlan[mode];

            responsiveApp.dataset.responsiveLayout = mode;
            gsap.set(responsiveApp, {
              x: geometry.shell.x,
              y: geometry.shell.y,
              width: geometry.shell.width,
              height: geometry.shell.height,
              borderRadius: geometry.shell.radius,
            });
            (
              Object.entries(responsiveRegions) as Array<
                [
                  Exclude<keyof ResponsiveAppGeometry, "shell">,
                  HTMLElement | null,
                ]
              >
            ).forEach(([region, element]) => {
              if (!element) return;
              gsap.set(element, geometry[region]);
            });
            responsiveViewport.x = camera.x;
            responsiveViewport.y = camera.y;
            responsiveViewport.scale = camera.zoom;
            setResponsiveViewport();
          };

          const resetWorkflowContent = () => {
            gsap.set(transientPackets, {
              autoAlpha: 0,
              strokeDashoffset: 0,
              autoRound: false,
            });
            gsap.set(resolvedNodeStates, { autoAlpha: 0 });
            gsap.set([incidentBase, carrier], { autoAlpha: 1 });
            gsap.set(carrierFault, { autoAlpha: 0 });
            animatedViewport.x = cameraPlan.overview.x;
            animatedViewport.y = cameraPlan.overview.y;
            animatedViewport.scale = cameraPlan.overview.zoom;
            setViewport();
          };

          const resetResponsiveContent = () => {
            gsap.set(responsiveInterior, { autoAlpha: 1 });
            gsap.set(responsiveBrowserChrome, { autoAlpha: 1 });
            gsap.set(responsivePhoneHardware, { autoAlpha: 0 });
            gsap.set(responsiveCompletion, {
              scaleX: 0.34,
              transformOrigin: "0 50%",
            });
            setResponsiveLayout("desktop");
          };

          const sceneCards: Record<HeroSceneId, HTMLElement> = {
            app: responsiveCard,
            workflow: workflowCard,
            ai: aiCard,
          };
          const deckPeek = layout === "compact" ? 4 : 7;
          const topPose = {
            "--hero-card-depth-mix": "0%",
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            zIndex: 30,
          };
          const middlePose = {
            "--hero-card-depth-mix": "68%",
            autoAlpha: 1,
            x: deckPeek,
            y: deckPeek,
            scale: 0.996,
            rotation: 0,
            zIndex: 20,
          };
          const backPose = {
            "--hero-card-depth-mix": "100%",
            autoAlpha: 1,
            x: deckPeek * 2,
            y: deckPeek * 2,
            scale: 0.994,
            rotation: 0,
            zIndex: 10,
          };
          const ejectGeometry = {
            "--hero-card-depth-mix": "0%",
            x: layout === "compact" ? -3 : -5,
            y: layout === "compact" ? -5 : -8,
            scale: layout === "compact" ? 1.012 : 1.022,
            rotation: layout === "compact" ? -0.06 : -0.1,
            zIndex: 40,
          };
          const vanishedForwardPose = {
            ...ejectGeometry,
            autoAlpha: 0,
          };
          const hiddenBackPose = {
            ...backPose,
            autoAlpha: 0,
          };
          const sceneAtOffset = (scene: HeroSceneId, offset: number) => {
            const index = HERO_SCENE_ORDER.indexOf(scene);
            return HERO_SCENE_ORDER[
              (index + offset + HERO_SCENE_ORDER.length) %
                HERO_SCENE_ORDER.length
            ];
          };
          const setDeckResting = (scene: HeroSceneId) => {
            const nextScene = sceneAtOffset(scene, 1);
            const lastScene = sceneAtOffset(scene, 2);

            HERO_SCENE_ORDER.forEach((sceneId) => {
              const card = sceneCards[sceneId];
              const depth =
                sceneId === scene
                  ? "top"
                  : sceneId === nextScene
                    ? "middle"
                    : "back";
              card.dataset.deckDepth = depth;
              gsap.set(
                card,
                depth === "top"
                  ? topPose
                  : sceneId === lastScene
                    ? backPose
                    : middlePose,
              );
            });
          };
          const forceDeckResting = (scene: HeroSceneId) => {
            const nextScene = sceneAtOffset(scene, 1);
            const lastScene = sceneAtOffset(scene, 2);

            setDeckResting(scene);
            HERO_SCENE_ORDER.forEach((sceneId) => {
              const card = sceneCards[sceneId];
              const pose =
                sceneId === scene
                  ? topPose
                  : sceneId === nextScene
                    ? middlePose
                    : backPose;

              card.style.opacity = String(pose.autoAlpha);
              card.style.visibility = "visible";
              card.style.zIndex = String(pose.zIndex);
              card.style.setProperty(
                "--hero-card-depth-mix",
                pose["--hero-card-depth-mix"],
              );
              card.style.transform = `translate3d(${pose.x}px, ${pose.y}px, 0) rotate(${pose.rotation}deg) scale(${pose.scale})`;
              card.dataset.deckDepth =
                sceneId === scene
                  ? "top"
                  : sceneId === lastScene
                    ? "back"
                    : "middle";
            });
          };
          const resetSceneContent = (scene: HeroSceneId) => {
            if (scene === "app") resetResponsiveContent();
            else if (scene === "workflow") resetWorkflowContent();
            else resetAiContent();
          };

          const resetAnimatedStart = () => {
            resetWorkflowContent();
            resetResponsiveContent();
            resetAiContent();
            gsap.set([workflowScene, responsiveScene, aiScene], {
              autoAlpha: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
            });
            setDeckResting("app");
            updateActiveScene("app");
          };

          resetAnimatedStart();

          const timeline = gsap.timeline({
            paused: true,
            defaults: { ease: "power3.inOut" },
          });
          const deckTiming =
            layout === "compact"
              ? {
                  forwardDuration: 0.56,
                  ejectEnd: 0.22,
                  promoteStart: 0.22,
                  promoteEnd: 0.56,
                  previousDuration: 0.56,
                  retractEnd: 0.34,
                  demoteStart: 0,
                  demoteEnd: 0.34,
                  restoreStart: 0.34,
                  restoreEnd: 0.56,
                }
              : {
                  forwardDuration: 0.68,
                  ejectEnd: 0.26,
                  promoteStart: 0.26,
                  promoteEnd: 0.68,
                  previousDuration: 0.68,
                  retractEnd: 0.42,
                  demoteStart: 0,
                  demoteEnd: 0.42,
                  restoreStart: 0.42,
                  restoreEnd: 0.68,
                };
          const SHEET_DURATION = deckTiming.forwardDuration;
          const APP_TO_WORKFLOW = 5.25;
          const WORKFLOW_START = APP_TO_WORKFLOW + SHEET_DURATION;
          const workflowTime = (time: number) => WORKFLOW_START + time;
          const WORKFLOW_TO_AI = workflowTime(12.05);
          const AI_START = WORKFLOW_TO_AI + SHEET_DURATION;
          const AI_TO_APP = AI_START + 6.4;
          const LOOP_RESET = AI_TO_APP + SHEET_DURATION;
          const LOOP_HOLD = 0.38 + 0.65;

          timeline
            .addLabel("app", 0)
            .addLabel("workflow", WORKFLOW_START)
            .addLabel("ai", AI_START);

          const setDeckTransitioningState = (transitioning: boolean) => {
            deckTransitioningRef.current = transitioning;
            setIsDeckTransitioning(transitioning);
          };

          const addForwardDeckMotion = (
            deckTimeline: ReturnType<typeof gsap.timeline>,
            from: HeroSceneId,
            to: HeroSceneId,
            start: number,
          ) => {
            const outgoingCard = sceneCards[from];
            const incomingCard = sceneCards[to];
            const newBackCard = sceneCards[sceneAtOffset(to, 1)];
            const cycleStart = start + deckTiming.ejectEnd;
            const cycleDuration =
              deckTiming.promoteEnd - deckTiming.promoteStart;
            const rearRevealStart = cycleStart + cycleDuration * 0.64;
            const rearRevealDuration =
              start + deckTiming.forwardDuration - rearRevealStart;
            const exitFadeDuration = layout === "compact" ? 0.1 : 0.12;
            const exitFadeStart = cycleStart - exitFadeDuration;

            deckTimeline
              .set(outgoingCard, topPose, start)
              .set(incomingCard, middlePose, start)
              .set(newBackCard, backPose, start)
              .to(
                outgoingCard,
                {
                  ...ejectGeometry,
                  duration: deckTiming.ejectEnd,
                  ease: "power2.in",
                },
                start,
              )
              .to(
                outgoingCard,
                {
                  autoAlpha: 0,
                  duration: exitFadeDuration,
                  ease: "power1.in",
                },
                exitFadeStart,
              )
              // Recycle the outgoing sheet only after it is invisible. It never
              // visibly travels from the front of the deck to the rear edge.
              .set(outgoingCard, hiddenBackPose, cycleStart)
              .set(incomingCard, { zIndex: 30 }, cycleStart)
              .set(newBackCard, { zIndex: 20 }, cycleStart)
              .to(
                incomingCard,
                {
                  ...topPose,
                  duration: cycleDuration,
                  ease: "power3.out",
                },
                cycleStart,
              )
              .to(
                newBackCard,
                {
                  ...middlePose,
                  duration: cycleDuration,
                  ease: "power3.out",
                },
                cycleStart,
              )
              .to(
                outgoingCard,
                {
                  autoAlpha: 1,
                  duration: rearRevealDuration,
                  ease: "power2.out",
                },
                rearRevealStart,
              );
          };

          const addPreviousDeckMotion = (
            deckTimeline: ReturnType<typeof gsap.timeline>,
            current: HeroSceneId,
            target: HeroSceneId,
            start: number,
          ) => {
            const currentCard = sceneCards[current];
            const oldMiddleCard = sceneCards[sceneAtOffset(current, 1)];
            const targetCard = sceneCards[target];
            const restoreStart = start + deckTiming.restoreStart;

            deckTimeline
              .set(currentCard, topPose, start)
              .set(oldMiddleCard, middlePose, start)
              .set(targetCard, backPose, start)
              .to(
                currentCard,
                {
                  ...middlePose,
                  duration: deckTiming.demoteEnd - deckTiming.demoteStart,
                  ease: "power3.inOut",
                },
                start + deckTiming.demoteStart,
              )
              .to(
                oldMiddleCard,
                {
                  ...backPose,
                  duration: deckTiming.demoteEnd - deckTiming.demoteStart,
                  ease: "power3.inOut",
                },
                start + deckTiming.demoteStart,
              )
              // Once the current top has moved back into the stack, stage the
              // previous sheet in front while hidden and let it settle inward.
              .set(targetCard, vanishedForwardPose, restoreStart)
              .to(
                targetCard,
                {
                  ...topPose,
                  duration: deckTiming.restoreEnd - deckTiming.restoreStart,
                  ease: "power2.out",
                },
                restoreStart,
              );
          };

          const addForwardDeckTransition = (
            from: HeroSceneId,
            to: HeroSceneId,
            start: number,
            end: number,
          ) => {
            timeline.call(
              () => setDeckTransitioningState(true),
              undefined,
              start,
            );
            addForwardDeckMotion(timeline, from, to, start);
            timeline.call(
              () => {
                resetSceneContent(from);
                setDeckResting(to);
                updateActiveScene(to);
                setDeckTransitioningState(false);
              },
              undefined,
              end,
            );
          };

          const tweenResponsiveLayout = (
            mode: ResponsiveAppLayout,
            start: number,
            duration: number,
          ) => {
            const geometry = RESPONSIVE_APP_LAYOUTS[mode];
            const camera = responsiveCameraPlan[mode];
            const layoutSwitchProgress = mode === "tablet" ? 0.56 : 0.7;

            timeline
              .to(
                responsiveApp,
                {
                  x: geometry.shell.x,
                  y: geometry.shell.y,
                  width: geometry.shell.width,
                  height: geometry.shell.height,
                  borderRadius: geometry.shell.radius,
                  duration,
                },
                start,
              )
              .to(
                responsiveViewport,
                {
                  x: camera.x,
                  y: camera.y,
                  scale: camera.zoom,
                  duration,
                  onUpdate: setResponsiveViewport,
                },
                start,
              )
              .call(
                () => {
                  responsiveApp.dataset.responsiveLayout = mode;
                },
                undefined,
                start + duration * layoutSwitchProgress,
              );

            if (mode === "phone") {
              timeline
                .to(
                  responsiveBrowserChrome,
                  { autoAlpha: 0, duration: 0.22, ease: "none" },
                  start + duration * 0.5,
                )
                .to(
                  responsivePhoneHardware,
                  { autoAlpha: 1, duration: 0.26, ease: "none" },
                  start + duration * 0.58,
                );
            } else {
              timeline
                .to(
                  responsivePhoneHardware,
                  { autoAlpha: 0, duration: 0.2, ease: "none" },
                  start + duration * 0.42,
                )
                .to(
                  responsiveBrowserChrome,
                  { autoAlpha: 1, duration: 0.24, ease: "none" },
                  start + duration * 0.48,
                );
            }

            (
              Object.entries(responsiveRegions) as Array<
                [
                  Exclude<keyof ResponsiveAppGeometry, "shell">,
                  HTMLElement | null,
                ]
              >
            ).forEach(([region, element]) => {
              if (!element) return;
              timeline.to(element, { ...geometry[region], duration }, start);
            });
          };

          const runPacket = (
            packet: SVGPathElement,
            state: HTMLElement | undefined,
            start: number,
            duration: number,
          ) => {
            timeline
              .set(
                packet,
                {
                  autoAlpha: 1,
                  strokeDashoffset: 0,
                  autoRound: false,
                },
                start,
              )
              .to(
                packet,
                {
                  strokeDashoffset: -100,
                  autoRound: false,
                  duration,
                  ease: "none",
                },
                start,
              )
              .to(
                packet,
                { autoAlpha: 0, duration: 0.16 },
                start + duration - 0.08,
              );

            if (!state) return;

            timeline
              .to(
                state,
                { autoAlpha: 1, duration: 0.2 },
                start + duration - 0.12,
              )
              .to(
                state,
                { autoAlpha: 0, duration: 0.42 },
                start + duration + 0.26,
              );
          };

          tweenResponsiveLayout("tablet", 1.25, 0.85);
          tweenResponsiveLayout("phone", 3, 0.85);

          timeline.to(
            responsiveCompletion,
            { scaleX: 1, duration: 0.55, ease: "power3.out" },
            4.1,
          );

          addForwardDeckTransition(
            "app",
            "workflow",
            APP_TO_WORKFLOW,
            WORKFLOW_START,
          );

          timeline
            .to(
              animatedViewport,
              {
                x: cameraPlan.ingress.x,
                y: cameraPlan.ingress.y,
                scale: cameraPlan.ingress.zoom,
                duration: 0.95,
                onUpdate: setViewport,
              },
              workflowTime(0.12),
            )
            .to(
              nodeStates.shopify,
              { autoAlpha: 1, duration: 0.22 },
              workflowTime(0.18),
            )
            .to(
              nodeStates.shopify,
              { autoAlpha: 0, duration: 0.34 },
              workflowTime(0.74),
            );

          runPacket(
            packets["order-webhook"]!,
            nodeStates.webhook!,
            workflowTime(0.48),
            0.78,
          );
          timeline.to(
            animatedViewport,
            {
              x: cameraPlan.validation.x,
              y: cameraPlan.validation.y,
              scale: cameraPlan.validation.zoom,
              duration: 0.76,
              onUpdate: setViewport,
            },
            workflowTime(1.12),
          );
          runPacket(
            packets["webhook-validate"]!,
            nodeStates.validate!,
            workflowTime(1.5),
            0.9,
          );

          timeline.to(
            animatedViewport,
            {
              x: cameraPlan.branch.x,
              y: cameraPlan.branch.y,
              scale: cameraPlan.branch.zoom,
              duration: 1.2,
              onUpdate: setViewport,
            },
            workflowTime(2.4),
          );

          runPacket(
            packets["validate-inventory"]!,
            nodeStates.inventory!,
            workflowTime(2.82),
            1.04,
          );
          runPacket(
            packets["validate-fulfilment"]!,
            undefined,
            workflowTime(2.82),
            1.08,
          );
          timeline.to(
            animatedViewport,
            {
              x: cameraPlan.merge.x,
              y: cameraPlan.merge.y,
              scale: cameraPlan.merge.zoom,
              duration: 0.78,
              onUpdate: setViewport,
            },
            workflowTime(3.72),
          );
          runPacket(
            packets["inventory-fulfilment"]!,
            nodeStates.fulfilment!,
            workflowTime(4.02),
            0.92,
          );

          timeline
            .to(
              animatedViewport,
              {
                x: cameraPlan.incident.x,
                y: cameraPlan.incident.y,
                scale: cameraPlan.incident.zoom,
                duration: 0.82,
                onUpdate: setViewport,
              },
              workflowTime(4.55),
            )
            .set(
              incidentAttempt,
              {
                autoAlpha: 1,
                strokeDashoffset: 0,
                autoRound: false,
              },
              workflowTime(5.08),
            )
            .to(
              incidentAttempt,
              {
                strokeDashoffset: -62,
                autoRound: false,
                duration: 0.88,
                ease: "none",
              },
              workflowTime(5.08),
            )
            .to(
              incidentBase,
              { autoAlpha: 0.32, duration: 0.24 },
              workflowTime(5.94),
            )
            .to(
              carrier,
              { autoAlpha: 0.48, duration: 0.28 },
              workflowTime(5.98),
            )
            .to(
              carrierFault,
              { autoAlpha: 1, duration: 0.22 },
              workflowTime(5.98),
            )
            .set(
              incidentFault,
              {
                autoAlpha: 1,
                strokeDashoffset: -62,
                autoRound: false,
              },
              workflowTime(6.04),
            )
            .to(
              incidentFault,
              {
                strokeDashoffset: 0,
                autoRound: false,
                duration: 0.58,
                ease: "power2.in",
              },
              workflowTime(6.04),
            )
            .to(
              incidentAttempt,
              { autoAlpha: 0, duration: 0.2 },
              workflowTime(6.08),
            )
            .to(
              incidentFault,
              { autoAlpha: 0, duration: 0.18 },
              workflowTime(6.58),
            )
            .set(
              incidentRecovery,
              {
                autoAlpha: 1,
                strokeDashoffset: 0,
                autoRound: false,
              },
              workflowTime(6.86),
            )
            .to(
              incidentRecovery,
              {
                strokeDashoffset: -100,
                autoRound: false,
                duration: 1.04,
                ease: "none",
              },
              workflowTime(6.86),
            )
            .to(
              carrierFault,
              { autoAlpha: 0, duration: 0.24 },
              workflowTime(7.6),
            )
            .to(carrier, { autoAlpha: 1, duration: 0.32 }, workflowTime(7.56))
            .to(
              incidentBase,
              { autoAlpha: 1, duration: 0.24 },
              workflowTime(7.66),
            )
            .to(
              nodeStates.carrier,
              { autoAlpha: 1, duration: 0.22 },
              workflowTime(7.68),
            )
            .to(
              nodeStates.carrier,
              { autoAlpha: 0, duration: 0.4 },
              workflowTime(8.22),
            )
            .to(
              incidentRecovery,
              { autoAlpha: 0, duration: 0.18 },
              workflowTime(7.94),
            );

          runPacket(
            packets["carrier-tracking"]!,
            nodeStates.tracking!,
            workflowTime(8.08),
            1.04,
          );
          timeline.to(
            animatedViewport,
            {
              x: cameraPlan.returning.x,
              y: cameraPlan.returning.y,
              scale: cameraPlan.returning.zoom,
              duration: 0.9,
              onUpdate: setViewport,
            },
            workflowTime(7.9),
          );
          runPacket(
            packets["tracking-outcome"]!,
            nodeStates.outcome!,
            workflowTime(9.38),
            0.98,
          );
          timeline.to(
            animatedViewport,
            {
              x: cameraPlan.outcome.x,
              y: cameraPlan.outcome.y,
              scale: cameraPlan.outcome.zoom,
              duration: 0.82,
              onUpdate: setViewport,
            },
            workflowTime(9.08),
          );

          timeline
            .to(
              animatedViewport,
              {
                x: cameraPlan.overview.x,
                y: cameraPlan.overview.y,
                scale: cameraPlan.overview.zoom,
                duration: 1.25,
                onUpdate: setViewport,
              },
              workflowTime(10.34),
            )
            .to(
              nodeStates.outcome,
              { autoAlpha: 0, duration: 0.5 },
              workflowTime(11.08),
            );

          addForwardDeckTransition("workflow", "ai", WORKFLOW_TO_AI, AI_START);

          timeline.to(
            aiStage,
            {
              rotationY: 0,
              skewX: 0,
              scale: 1,
              duration: 0.7,
              ease: "power3.out",
            },
            WORKFLOW_TO_AI,
          );

          timeline
            .set(aiCursor, { autoAlpha: 1 }, AI_START + 0.25)
            .to(
              aiCursor,
              {
                autoAlpha: 0.18,
                duration: 0.16,
                repeat: 7,
                yoyo: true,
                ease: "none",
              },
              AI_START + 0.25,
            )
            .to(
              aiQuestionChars,
              {
                autoAlpha: 1,
                duration: 0.01,
                stagger: 0.025,
                ease: "none",
              },
              AI_START + 0.3,
            )
            .set(aiCursor, { autoAlpha: 0 }, AI_START + 1.68)
            .to(
              aiPromptRule,
              { scaleX: 1, duration: 0.32, ease: "power3.out" },
              AI_START + 1.62,
            )
            .to(
              aiPromptAction,
              { scale: 0.975, duration: 0.1, ease: "power2.in" },
              AI_START + 1.78,
            )
            .to(
              aiPromptAction,
              { scale: 1, duration: 0.18, ease: "power3.out" },
              AI_START + 1.88,
            )
            .to(
              aiViewport,
              {
                ...aiCameraPlan.evidence,
                duration: 1,
                ease: "power3.inOut",
                onUpdate: setAiViewport,
              },
              AI_START + 2.1,
            )
            .to(
              aiPromptPlane,
              { autoAlpha: 0.42, duration: 0.65 },
              AI_START + 2.1,
            )
            .to(
              aiEvidencePlane,
              { autoAlpha: 1, duration: 0.46 },
              AI_START + 2.45,
            )
            .to(
              aiAnswer,
              { autoAlpha: 1, y: 0, duration: 0.34, ease: "power3.out" },
              AI_START + 2.92,
            )
            .to(
              aiSummary,
              { autoAlpha: 1, y: 0, duration: 0.38, ease: "power3.out" },
              AI_START + 3.2,
            )
            .to(
              aiDonutSegments,
              {
                strokeDashoffset: (index: number) => aiDonutOffsets[index],
                autoRound: false,
                duration: 0.78,
                stagger: 0.06,
                ease: "power2.out",
              },
              AI_START + 3.38,
            )
            .to(
              aiBarFills,
              {
                scaleX: 1,
                duration: 0.58,
                stagger: 0.14,
                ease: "power3.out",
              },
              AI_START + 3.5,
            )
            .to(
              aiViewport,
              {
                ...aiCameraPlan.actions,
                duration: 0.72,
                ease: "power3.inOut",
                onUpdate: setAiViewport,
              },
              AI_START + 3.9,
            )
            .to(
              aiActionTable,
              {
                autoAlpha: 1,
                y: 0,
                clipPath: "inset(0 0 0% 0)",
                duration: 0.58,
                ease: "power3.out",
              },
              AI_START + 3.96,
            )
            .to(
              aiReviewAction,
              { autoAlpha: 1, y: 0, duration: 0.32, ease: "power3.out" },
              AI_START + 4.42,
            );

          addForwardDeckTransition("ai", "app", AI_TO_APP, LOOP_RESET);
          timeline.to({}, { duration: LOOP_HOLD }, LOOP_RESET);

          setMotionState("running");

          let isInView = typeof IntersectionObserver === "undefined";
          let manualDeckTransition: ReturnType<typeof gsap.timeline> | null =
            null;
          const syncPlayback = () => {
            const canAnimate = isInView && !document.hidden;

            if (manualDeckTransition) {
              timeline.pause();
              if (canAnimate) manualDeckTransition.resume();
              else manualDeckTransition.pause();
              return;
            }

            if (canAnimate && !manuallyPausedRef.current) timeline.play();
            else timeline.pause();
          };

          timeline.eventCallback("onComplete", () => {
            // A GSAP repeat rewinds every later zero-duration deck setter while
            // seeking back to zero, which can briefly restore the outgoing AI
            // sheet. Normalize the complete reel synchronously after the seek
            // so the browser only paints the canonical application start.
            timeline.pause(0, true);
            resetAnimatedStart();
            setDeckTransitioningState(false);
            syncPlayback();
          });

          const sceneAnchors: Record<HeroSceneId, number> = {
            app: 0,
            workflow: WORKFLOW_START,
            ai: AI_START,
          };

          const runManualDeckTransition = (
            scene: HeroSceneId,
            direction: -1 | 1,
          ) => {
            if (deckTransitioningRef.current) return;

            const current = activeSceneRef.current;
            if (current === scene) return;

            timeline.pause();
            resetSceneContent(scene);
            setDeckResting(current);
            setDeckTransitioningState(true);
            manuallyPausedRef.current = false;
            setIsPaused(false);

            manualDeckTransition?.kill();
            const transition = gsap.timeline({
              paused: true,
            });
            manualDeckTransition = transition;

            if (direction === 1)
              addForwardDeckMotion(transition, current, scene, 0);
            else addPreviousDeckMotion(transition, current, scene, 0);

            transition.eventCallback("onComplete", () => {
              if (manualDeckTransition !== transition) return;

              timeline.pause();
              timeline.totalTime(sceneAnchors[scene], true);
              resetSceneContent(current);
              forceDeckResting(scene);
              updateActiveScene(scene);
              setStatusAnnouncement(
                `Scene ${HERO_SCENE_ORDER.indexOf(scene) + 1} of ${HERO_SCENE_ORDER.length}: ${HERO_SCENE_LABELS[scene]}.`,
              );
              manualDeckTransition = null;
              setDeckTransitioningState(false);
              syncPlayback();
            });

            syncPlayback();
          };

          stopDeckTransition = () => {
            manualDeckTransition?.kill();
            manualDeckTransition = null;
            deckTransitioningRef.current = false;
          };

          playbackController = {
            setPaused: () => syncPlayback(),
            moveTo: runManualDeckTransition,
          };
          playbackControllerRef.current = playbackController;

          if (typeof IntersectionObserver !== "undefined") {
            observer = new IntersectionObserver(
              ([entry]) => {
                isInView = entry.isIntersecting;
                syncPlayback();
              },
              { threshold: 0.08 },
            );
            observer.observe(root);
          }

          handleVisibility = syncPlayback;
          document.addEventListener("visibilitychange", handleVisibility);
          syncPlayback();
        }, root);

        revert = () => {
          stopDeckTransition();
          context.revert();
        };
      })
      .catch(() => {
        if (cancelled) return;
        playbackControllerRef.current = null;
        applyViewport(cameraPlan.static);
        updateActiveScene("workflow");
        setMotionState("stable");
      });

    return () => {
      cancelled = true;
      observer?.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      if (playbackControllerRef.current === playbackController) {
        playbackControllerRef.current = null;
      }
      revert();
      deckTransitioningRef.current = false;
      setIsDeckTransitioning(false);
    };
  }, [
    flowSize.height,
    flowSize.width,
    flowReady,
    layout,
    prefersReducedMotion,
    updateActiveScene,
  ]);

  return (
    <figure
      ref={rootRef}
      className="hero-system-screen"
      data-workflow-layout={layout}
      data-workflow-motion={flowReady ? motionState : "pending"}
      data-active-scene={activeScene}
      data-playback-paused={isPaused ? "true" : "false"}
      data-deck-transitioning={isDeckTransitioning ? "true" : "false"}
    >
      <div className="hero-system-screen__frame" aria-hidden="true">
        <section
          className="hero-system-screen__card"
          data-hero-card="app"
          data-deck-depth="top"
        >
          <HeroSceneBar scene="app" />
          <div className="hero-system-screen__flow">
            <ResponsiveAppScene initialViewport={initialResponsiveViewport} />
          </div>
        </section>

        <section
          className="hero-system-screen__card"
          data-hero-card="workflow"
          data-deck-depth="middle"
        >
          <HeroSceneBar scene="workflow" />
          <div ref={flowRef} className="hero-system-screen__flow">
            <div
              className="hero-system-screen__scene hero-system-screen__workflow-scene"
              data-workflow-scene
            >
              <ReactFlow<WorkflowNode, WorkflowEdge>
                nodes={workflowNodes}
                edges={workflowEdges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultViewport={FALLBACK_VIEWPORT}
                minZoom={0.18}
                maxZoom={1.05}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                panOnDrag={false}
                panOnScroll={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                nodesFocusable={false}
                edgesFocusable={false}
                preventScrolling={false}
                onlyRenderVisibleElements={false}
                proOptions={{ hideAttribution: true }}
                onInit={handleInit}
              >
                <Background
                  id="hero-workflow-grid"
                  className="hero-system-screen__flow-grid"
                  color="var(--hero-grid-line)"
                  gap={32}
                  lineWidth={0.5}
                  variant={BackgroundVariant.Lines}
                />
              </ReactFlow>
            </div>
          </div>
        </section>

        <section
          className="hero-system-screen__card"
          data-hero-card="ai"
          data-deck-depth="back"
        >
          <HeroSceneBar scene="ai" />
          <div className="hero-system-screen__flow">
            <AiAutomationScene />
          </div>
        </section>
      </div>
      {motionState === "running" ? (
        <div
          className="hero-system-screen__controls"
          role="group"
          aria-label={`Service reel controls. Current scene: ${HERO_SCENE_LABELS[activeScene]}`}
        >
          <button
            className="hero-system-screen__control"
            type="button"
            aria-label="Previous scene"
            disabled={isDeckTransitioning}
            onClick={() => moveToAdjacentScene(-1)}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M11.8 5.4 7.2 10l4.6 4.6M5.2 5.2v9.6" />
            </svg>
          </button>
          <button
            className="hero-system-screen__control hero-system-screen__control--playback"
            type="button"
            aria-label={isPaused ? "Play animation" : "Pause animation"}
            disabled={isDeckTransitioning}
            onClick={togglePlayback}
          >
            {isPaused ? (
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="m7.2 5.2 7.2 4.8-7.2 4.8V5.2Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M7.2 5.2v9.6M12.8 5.2v9.6" />
              </svg>
            )}
          </button>
          <button
            className="hero-system-screen__control"
            type="button"
            aria-label="Next scene"
            disabled={isDeckTransitioning}
            onClick={() => moveToAdjacentScene(1)}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="m8.2 5.4 4.6 4.6-4.6 4.6M14.8 5.2v9.6" />
            </svg>
          </button>
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            {statusAnnouncement}
          </span>
        </div>
      ) : null}
    </figure>
  );
};

export default HeroSystemScreen;
