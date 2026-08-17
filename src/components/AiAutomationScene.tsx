import { HeroSceneGrid } from "./HeroSceneChrome";

const evidenceBars = [
  { id: "shipment", label: "Shipment created", tone: "proof" },
  { id: "carrier", label: "Carrier request recovered", tone: "relay" },
  { id: "tracking", label: "Tracking returned", tone: "system" },
] as const;

const actionRows = [
  {
    id: "shipment",
    event: "Shipment created",
    source: "3PL fulfilment",
    result: "Complete",
  },
  {
    id: "carrier",
    event: "Carrier request",
    source: "Carrier service",
    result: "Recovered on retry",
  },
  {
    id: "tracking",
    event: "Tracking update",
    source: "Shopify",
    result: "Complete",
  },
] as const;

export const AI_AUTOMATION_QUESTION =
  "Summarize the fulfilment issue. Is anything still blocked?";

const AiQuestion = () => (
  <span data-ai-question-text>
    {AI_AUTOMATION_QUESTION.split(" ").map((word, wordIndex, words) => (
      <span key={`${word}-${wordIndex}`} className="ai-automation-scene__word">
        {[...word].map((character, characterIndex) => (
          <span key={`${character}-${characterIndex}`} data-ai-question-char>
            {character}
          </span>
        ))}
        {wordIndex < words.length - 1 ? "\u00a0" : null}
      </span>
    ))}
  </span>
);

const AiAutomationScene = () => (
  <div
    className="ai-automation-scene"
    data-ai-scene
    data-ai-logical-width="1680"
    data-ai-logical-height="960"
  >
    <div className="ai-automation-scene__stage" data-ai-stage>
      <div className="ai-automation-scene__camera" data-ai-camera>
        <HeroSceneGrid />
        <section
          className="ai-automation-scene__plane ai-automation-scene__plane--prompt"
          data-ai-plane="prompt"
          data-ai-prompt-plane
        >
          <header className="ai-automation-scene__plane-header">
            <strong>Ask about this workflow</strong>
            <span>Source-grounded review</span>
          </header>

          <div className="ai-automation-scene__prompt-body">
            <p className="ai-automation-scene__question" data-ai-question>
              <AiQuestion />
              <span
                className="ai-automation-scene__cursor"
                data-ai-cursor
                aria-hidden="true"
              />
            </p>
            <span
              className="ai-automation-scene__rule"
              data-ai-rule
              data-ai-prompt-rule
              aria-hidden="true"
            />
            <span
              className="ai-automation-scene__action"
              data-ai-action
              data-ai-prompt-action
            >
              Run review
            </span>
          </div>
        </section>

        <section
          className="ai-automation-scene__plane ai-automation-scene__plane--evidence"
          data-ai-plane="evidence"
          data-ai-evidence-plane
        >
          <header className="ai-automation-scene__plane-header">
            <strong>Summary</strong>
            <span>Illustrative workflow data</span>
          </header>

          <div className="ai-automation-scene__evidence-body">
            <p className="ai-automation-scene__answer" data-ai-answer>
              The first carrier request failed, the retry succeeded, and
              tracking returned to Shopify. No unresolved block remains in the
              workflow shown.
            </p>

            <div className="ai-automation-scene__summary" data-ai-summary>
              <div className="ai-automation-scene__donut-block">
                <strong className="ai-automation-scene__section-title">
                  Sources reviewed
                </strong>
                <svg
                  className="ai-automation-scene__donut"
                  data-ai-donut
                  viewBox="0 0 120 120"
                  role="img"
                  aria-label="Illustrative sources reviewed: 3PL fulfilment, carrier service, and Shopify"
                >
                  <circle
                    className="ai-automation-scene__donut-track"
                    data-ai-donut-track
                    cx="60"
                    cy="60"
                    r="44"
                    pathLength="100"
                  />
                  <circle
                    className="ai-automation-scene__donut-segment ai-automation-scene__donut-segment--fulfilment"
                    data-ai-donut-segment="fulfilment"
                    cx="60"
                    cy="60"
                    r="44"
                    pathLength="100"
                    strokeDasharray="31 69"
                    strokeDashoffset="0"
                  />
                  <circle
                    className="ai-automation-scene__donut-segment ai-automation-scene__donut-segment--carrier"
                    data-ai-donut-segment="carrier"
                    cx="60"
                    cy="60"
                    r="44"
                    pathLength="100"
                    strokeDasharray="31 69"
                    strokeDashoffset="-33"
                  />
                  <circle
                    className="ai-automation-scene__donut-segment ai-automation-scene__donut-segment--shopify"
                    data-ai-donut-segment="shopify"
                    cx="60"
                    cy="60"
                    r="44"
                    pathLength="100"
                    strokeDasharray="31 69"
                    strokeDashoffset="-66"
                  />
                </svg>
                <div className="ai-automation-scene__legend" data-ai-legend>
                  <span data-ai-legend-item="fulfilment">3PL</span>
                  <span data-ai-legend-item="carrier">Carrier</span>
                  <span data-ai-legend-item="shopify">Shopify</span>
                </div>
              </div>

              <div className="ai-automation-scene__bars" data-ai-bars>
                <strong className="ai-automation-scene__section-title">
                  Event trace
                </strong>
                {evidenceBars.map((bar) => (
                  <div
                    key={bar.id}
                    className={`ai-automation-scene__bar ai-automation-scene__bar--${bar.tone}`}
                    data-ai-bar={bar.id}
                  >
                    <span className="ai-automation-scene__bar-label">
                      {bar.label}
                    </span>
                    <span
                      className="ai-automation-scene__bar-track"
                      aria-hidden="true"
                    >
                      <span
                        className="ai-automation-scene__bar-fill"
                        data-ai-bar-fill
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="ai-automation-scene__action-table"
              data-ai-action-table
            >
              <strong className="ai-automation-scene__action-table-title">
                Evidence reviewed
              </strong>
              <div
                className="ai-automation-scene__action-row ai-automation-scene__action-row--head"
                data-ai-action-table-head
              >
                <span>Event</span>
                <span>Source</span>
                <span>Result</span>
              </div>
              {actionRows.map((row) => (
                <div
                  key={row.id}
                  className="ai-automation-scene__action-row"
                  data-ai-action-row={row.id}
                >
                  <strong>{row.event}</strong>
                  <span>{row.source}</span>
                  <span>{row.result}</span>
                </div>
              ))}
            </div>

            <footer className="ai-automation-scene__evidence-footer">
              <span>Example data based on the workflow shown.</span>
              <span
                className="ai-automation-scene__review-action"
                data-ai-review-action
              >
                Review incident log
              </span>
            </footer>
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default AiAutomationScene;
