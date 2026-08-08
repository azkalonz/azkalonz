import { rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  heroTileEasingNames,
  heroTileEffectNames,
  heroTileOrderNames,
  type HeroTilePhase,
  type HeroTileTransition,
} from "../src/transition/heroTileTransition";
import {
  getHeroTileTransitionById,
  heroTileTransitionCatalog,
} from "../src/transition/heroTileTransitionCatalog";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const validatePhase = (
  transition: HeroTileTransition,
  phaseName: "reveal" | "exit",
  phase: HeroTilePhase,
) => {
  const issues: string[] = [];
  const prefix = `${transition.id} ${phaseName}`;

  if (!heroTileOrderNames.includes(phase.order)) {
    issues.push(`${prefix}: unknown order ${phase.order}`);
  }
  if (!heroTileEffectNames.includes(phase.effect)) {
    issues.push(`${prefix}: unknown effect ${phase.effect}`);
  }
  if (!heroTileEasingNames.includes(phase.easing)) {
    issues.push(`${prefix}: unknown easing ${phase.easing}`);
  }
  if (phase.start < 0 || phase.start > 0.2) {
    issues.push(`${prefix}: start must stay between 0 and 0.2`);
  }
  if (phase.staggerSpan < 0.1 || phase.staggerSpan > 0.75) {
    issues.push(`${prefix}: staggerSpan must stay between 0.1 and 0.75`);
  }
  if (phase.tileDuration < 0.08 || phase.tileDuration > 0.25) {
    issues.push(`${prefix}: tileDuration must stay between 0.08 and 0.25`);
  }
  if (phase.texture < 0 || phase.texture > 0.02) {
    issues.push(`${prefix}: texture must stay between 0 and 0.02`);
  }

  const completion =
    phase.start + phase.staggerSpan + phase.texture * 4 + phase.tileDuration;
  if (completion > 1) {
    issues.push(`${prefix}: timing exceeds the available scroll phase`);
  }

  return issues;
};

const validateCatalog = () => {
  const ids = new Set<string>();
  const issues = heroTileTransitionCatalog.flatMap((transition) => {
    const transitionIssues: string[] = [];

    if (ids.has(transition.id)) {
      transitionIssues.push(`${transition.id}: duplicate transition ID`);
    }
    ids.add(transition.id);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(transition.id)) {
      transitionIssues.push(`${transition.id}: ID must be kebab-case`);
    }
    if (!transition.label.trim() || !transition.description.trim()) {
      transitionIssues.push(
        `${transition.id}: label and description are required`,
      );
    }
    if (transition.overscan < 1 || transition.overscan > 1.15) {
      transitionIssues.push(
        `${transition.id}: overscan must stay between 1 and 1.15`,
      );
    }

    return [
      ...transitionIssues,
      ...validatePhase(transition, "reveal", transition.reveal),
      ...validatePhase(transition, "exit", transition.exit),
    ];
  });

  if (heroTileTransitionCatalog.length !== 10) {
    issues.push(
      `Transition catalog must contain exactly 10 styles; found ${heroTileTransitionCatalog.length}`,
    );
  }
  if (issues.length) {
    throw new Error(`Tile transition validation failed:\n${issues.join("\n")}`);
  }
};

const applyTransition = async (transition: HeroTileTransition) => {
  const currentTransitionPath = path.join(
    projectRoot,
    "transitions/current-transition.json",
  );
  const temporaryTransitionPath = `${currentTransitionPath}.tmp`;
  const nextTransition = `${JSON.stringify(transition, null, 2)}\n`;

  await writeFile(temporaryTransitionPath, nextTransition);
  await rename(temporaryTransitionPath, currentTransitionPath);

  console.log(
    `Applied ${transition.label} (${transition.id}) as the production tile transition.`,
  );
  console.log("Run npm run build to verify the production transition.");
};

const main = async () => {
  validateCatalog();

  const transitionId = process.argv[2];
  if (!transitionId || transitionId === "--list") {
    console.log("Available tile transitions:");
    heroTileTransitionCatalog.forEach((transition) =>
      console.log(`  ${transition.id.padEnd(24)} ${transition.label}`),
    );
    if (!transitionId) process.exitCode = 1;
    return;
  }

  const transition = getHeroTileTransitionById(transitionId);
  if (!transition) {
    console.error(`Unknown tile transition: ${transitionId}`);
    console.error("Run npm run transition:list to see valid transition IDs.");
    process.exitCode = 1;
    return;
  }

  await applyTransition(transition);
};

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
