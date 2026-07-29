# Visual Architecture and UX Redesign

Status: implementation-oriented audit  
Date: 2026-07-29  
Visual Engineering context: `0.9.1`  
Source commit: `b76476e733de05fceead8ea94fffec284616f1a0`

## 1. Executive summary

The product currently exposes its implementation model—survey files, encoded
URLs, instrument IDs, group IDs, modes, and scores—more clearly than its user
model. A visitor cannot readily tell which instrument fits their question,
whether a result is scientifically validated, how individual and comparative
assessments differ, or what to do after receiving a score.

The recommended architecture is a **diagnostic workspace** organized around a
closed learning loop:

1. Frame the outcome or concern.
2. Choose the smallest relevant instrument.
3. Collect independent perspectives and evidence.
4. Inspect distributions, disagreement, and evidence quality.
5. Form competing explanations.
6. commit to one reversible next test.
7. Revisit the outcome.

The first implementation slice replaces file-oriented landing-page behavior
with task-oriented wayfinding, honest research-status language, semantic
disclosure, and valid interactive markup. The full transition should be staged
because the current assessment and reporting models encode scientifically weak
assumptions that cannot be repaired through styling.

## 2. UX audit

### Critical findings

| Finding | Consequence | Severity | Evidence |
|---|---|---:|---|
| The interface calls results “maturity” while repository research rejects a universal maturity score | False confidence and unsafe comparison | Critical | `agile-assessment-research-and-redesign.md` |
| A 403-statement instrument is presented like an ordinary survey | Survey fatigue, satisficing, abandonment | Critical | Current v2 instrument and research audit |
| Total and section scores reduce heterogeneous ordinal responses to arithmetic | Misleading interpretation | Critical | Current instrument scoring code |
| State is serialized into long route parameters | Fragile sharing, privacy exposure, poor recovery | High | Router and compression workflow |
| Landing-page cards expose filenames and two equally styled actions | Implementation leakage and decision fatigue | High | Previous dashboard |
| Clicking a card produced a modal whose Continue action did nothing | Dead end and broken expectation | High | Previous dashboard |
| Custom accordion triggers did not control disclosure state | False affordance | High | Previous accordion implementation |
| Links wrapped buttons | Invalid nested interaction and ambiguous accessibility tree | High | Previous dashboard |
| Hidden radio controls remove native focus and selection affordance | Keyboard and screen-reader risk | Critical | `survey.css` |
| Color and spatial position carry response meaning | Color-vision and narrow-width failure | High | `survey.css` |
| Fixed score and absolute menu can obscure content | Zoom/reflow failure | High | `survey.css` |
| IDs and metadata precede the instrument title | Wrong first-glance hierarchy | Medium | Instrument layout |

### What should remain

- Native React routing is adequate for the current prototype.
- JSON instruments are a useful content boundary, though their schema needs
  versioning and semantic validation.
- Independent and comparative collection are genuinely different workflows and
  should remain distinct.
- Existing research artifacts provide a strong basis for truthful product copy.

## 3. Information architecture review

The current hierarchy is `instrument list → mode → questionnaire → encoded
result/report`. It assumes users know which named assessment they need and what
the resulting score means.

The proposed hierarchy is:

```text
Workspace
├── Start a diagnostic
│   ├── Define concern and observation window
│   ├── Select focused signal set
│   └── Choose participants and evidence
├── Active diagnostics
│   ├── Collection status
│   ├── Evidence coverage
│   └── Privacy thresholds
├── Findings
│   ├── Outcomes
│   ├── Role distributions and disagreement
│   ├── Evidence-perception deltas
│   └── Competing explanations
├── Experiments
│   ├── Prediction and owner
│   └── Review date and result
└── Instrument library
    ├── Outcome signals
    ├── Explanatory capabilities
    └── Legacy instruments
```

Search is unnecessary at the present ten-instrument scale. Add it only after
the content inventory grows enough that category scanning measurably fails.

## 4. Workflow analysis

### Current workflow

Users choose among similar names, enter metadata, answer many statements,
receive scores, and manually infer meaning. The design repeatedly asks them to
translate product concepts into implementation concepts. Recovery is unclear,
progress is not visible, and the next action is “Send Results” rather than
interpret, verify, or test.

### Proposed workflow

The system should begin with an observed concern (“releases are unpredictable”)
and a 90-day window. It should recommend the smallest relevant signal set,
explain time and evidence expectations, collect perceptions privately, and
show completion without exposing responses. Findings should lead with the
observed outcome and evidence quality, then expose disagreement and alternative
explanations. The terminal action is “Plan a test,” not “Finish assessment.”

Draft saving, expiry, participant reminders, privacy thresholds, and accessible
error recovery are requirements—not polish.

## 5. Visual hierarchy review

Each screen needs one primary perceptual path:

- Home: purpose → limitations → instrument choice.
- Setup: scope → participants → evidence → review.
- Questionnaire: progress → statement → response → optional context.
- Findings: observed outcome → confidence → likely constraints → next test.

Metadata, IDs, filenames, and utilities should be secondary or hidden until
needed. Score color must never dominate the evidence or uncertainty that
qualifies it. The implemented home uses typography, position, relational
spacing, and one reserved semantic accent instead of a grid of equally weighted
cards.

## 6. Interaction design review

- Use native `details/summary` for simple library disclosure.
- Use a visible radio group or segmented choice with native inputs for answers.
- Autosave with explicit “Saved”/“Saving”/“Couldn’t save” feedback.
- Preserve the last safe state and offer retry; never discard a completed page.
- Confirm only consequential, difficult-to-reverse actions. Provide undo for
  participant removal and archive operations.
- Loading should retain layout and name the operation.
- Empty states should explain why the state exists and offer one next action.
- Motion should clarify spatial/state change, remain under roughly 200 ms for
  routine transitions, and respect reduced motion.

## 7. Accessibility review

Target WCAG 2.2 AA and validate, at minimum:

- semantic landmarks and a single descriptive `h1`;
- keyboard completion of every workflow;
- visible, unobscured focus and logical focus restoration;
- native controls or fully equivalent accessible behavior;
- 44-by-44 CSS pixel coarse-pointer targets where practical;
- errors connected to fields with actionable text;
- status announced without stealing focus;
- no state communicated only by color;
- 200% text size and 400% zoom/reflow;
- reduced motion, forced colors, and screen-reader smoke tests;
- participant privacy that does not reveal an identity through small cohorts.

The legacy questionnaire fails several of these checks. It should not be
declared accessible until its hidden radio controls, source/visual order,
fixed-position UI, and state semantics are corrected and tested.

## 8. Component standardization recommendations

Build components around durable meaning:

- `AppShell`, `PageHeader`, and `TaskNavigation`
- `InstrumentSummary` and `ResearchStatus`
- `DiagnosticScope`
- `ResponseGroup` with native radio semantics
- `ProgressSummary`
- `EvidenceRequest` and `EvidenceQuality`
- `DistributionPlot` with table alternative
- `HypothesisPanel`
- `SystemStatus` and `RecoveryAction`

Avoid a generic card component as the default information model. Buttons own
actions; links own navigation. Every component must define empty, loading,
error, disabled, read-only, narrow, long-content, and forced-color behavior
where applicable.

## 9. Design-system improvements

Use four token layers: source palette, semantic roles, theme mapping, and
component consumption. Start with a deliberately small set:

- text: primary, muted, inverse, link;
- surface: canvas, raised, selected;
- border: subtle, strong, focus;
- status: informative, caution, critical, positive;
- spacing: relational steps rather than component-specific numbers;
- type: display, heading, body, label, data;
- motion: instant, routine, spatial.

The implemented landing page uses a warm neutral canvas, dark green action
accent, and high-chroma lime only as a small research-status signal. This is a
product-specific expression, not a universal visual rule.

## 10. Proposed navigation architecture

For the near-term prototype:

- Home / Instrument library
- Compare perspectives
- Active assessment (contextual, not global)
- Findings (contextual, not global)

For the diagnostic workspace:

- Overview
- Diagnostics
- Findings
- Experiments
- Instruments
- Settings

Utilities and compression tools belong in development/admin surfaces, never
primary navigation.

## 11. Screen-by-screen redesign

### Home

Lead with the product’s purpose and limitation. Group instruments by the
question they help explore. Describe each in plain language; never display its
filename. Distinguish starting an assessment from creating a group assessment.

### Diagnostic setup

Use a short stepped flow: concern and scope, respondent groups, evidence,
privacy/review. Explain why each item is requested and show estimated burden.

### Questionnaire

Show one coherent section at a time, not one item per artificial page. Pin
progress only when it does not obscure content. Use anchored response labels,
“not observed,” and optional evidence/context. Do not expose a running score.

### Collection status

Show invited, started, completed, and privacy-threshold status without showing
individual answers. Provide resend, copy invitation, close collection, and
expiry controls.

### Findings

Lead with outcomes and data quality. Show full distributions by role only above
privacy thresholds. Separate observations, interpretations, alternative
explanations, and recommendations. Every recommendation names its evidence and
uncertainty.

### Experiment

Capture the predicted change, baseline, owner, review date, guardrail, and
result. Make “inconclusive” a first-class outcome.

### Error and empty states

Name what happened, what remains safe, and the next recovery action. Never use
“Something went wrong” alone.

## 12. Quick wins

1. Replace the landing page’s file-centered card grid and dead modal.
2. Remove filenames and unsupported maturity claims from user-facing copy.
3. Mark all current instruments as research/legacy instruments.
4. Replace nested buttons/links and false accordion behavior.
5. Hide running total scores during response.
6. Restore native radio accessibility and add textual response anchors.
7. Move IDs and administrative metadata below the task heading.
8. Add a persistent prototype/non-performance-use notice.

## 13. Medium-term improvements

- Introduce a versioned instrument schema and content linting.
- Implement draft persistence outside route parameters.
- Build setup, participant, collection-status, and evidence workflows.
- Replace maturity reports with distributions and evidence coverage.
- Add automated axe checks plus keyboard, zoom, and forced-color test cases.
- Instrument task completion, abandonment, error recovery, and time-on-task.

## 14. Long-term vision

Evolve into a longitudinal diagnostic workspace that connects perceptions,
operational signals, customer outcomes, hypotheses, and experiments without
pretending that correlation proves causality. Support adaptive follow-ups only
after item behavior is calibrated. Preserve raw observations and provenance so
teams can reinterpret earlier conclusions when new evidence arrives.

## 15. Alternative architectures, recommendation, and risks

### A. Polished instrument catalog

Philosophy: make the existing assessment library easier to browse and complete.
It is fast and low risk but preserves the score-centric mental model. Best for
short-term continuity.

### B. Guided diagnostic journey — recommended

Philosophy: organize the product around a concern-to-evidence-to-experiment
loop, while retaining instruments as modular tools. It improves actionability
and matches the scientific redesign. Its risk is greater workflow and data
model work.

### C. Evidence operations platform

Philosophy: continuously integrate telemetry, surveys, artifacts, and causal
experiments. It offers the strongest longitudinal model but has high integration,
privacy, governance, and false-precision risk. Best only after the guided
journey is validated.

Recommendation B is the smallest architecture that changes the harmful mental
model instead of cosmetically reinforcing it. Assumptions: teams have a concrete
concern, can access at least some evidence, and will revisit an experiment.
Contradicting evidence may show that users primarily need a lightweight
facilitation aid. Validate that before building platform depth.

Cross-cutting risks include retaliation through identifiable responses,
leadership treating probabilities as grades, evidence integrations producing
false comparability, scope expansion, and transition costs for existing links.
Mitigate with privacy thresholds, explicit interpretation guidance, versioned
data migrations, and reversible releases.

## 16. Research questions remaining

- Which user initiates the workflow, and who acts on findings?
- What decision is made after an assessment today?
- Where do users abandon the 403-item instrument?
- Which response anchors produce stable interpretation across roles?
- What cohort threshold protects identity in each organization?
- Which operational sources are available and trustworthy?
- Do disagreement displays improve inquiry or increase defensiveness?
- Does a concern-first entry reduce time to a useful next action?
- What formally constitutes the Echelon Diagnostic Framework?
- Which accessibility needs exist among actual participants?

## 17. Prioritized implementation roadmap

### Phase 0 — safety and truthfulness (now–2 weeks)

Ship the home redesign, research-status labeling, semantic interaction fixes,
running-score removal, and critical questionnaire accessibility repairs.
Success: zero critical axe violations; keyboard completion; users correctly
identify instrument purpose and limitations.

### Phase 1 — coherent collection (2–6 weeks)

Create versioned drafts, diagnostic setup, participant status, privacy rules,
autosave, and recovery. Success: higher completion, lower setup errors, no state
loss, and reduced support requests.

### Phase 2 — diagnostic findings (6–12 weeks)

Replace aggregate maturity scoring with distributions, disagreement, evidence
coverage, and hypothesis framing. Success: users can identify evidence gaps and
state a testable next action without facilitator correction.

### Phase 3 — learning loop (3–6 months)

Add experiment tracking and longitudinal outcome review. Success: teams revisit
predictions and update conclusions rather than merely repeating assessments.

### Phase 4 — calibrated adaptation (after validation)

Evaluate adaptive questions, Bayesian updates, and selective integrations.
Proceed only with adequate samples, invariance checks, privacy review, and
predictive validation.

## Verification and justified deviations

Applied principles: one primary path, recognition over recall, meaningful
grouping, semantic/native interaction, proportional emphasis, color-independent
state, truthful status, responsive recomposition, reduced motion, and bounded
component semantics.

Required verification for the implemented slice: production build, keyboard
navigation, wide and narrow visual inspection, text scaling/zoom, reduced
motion, forced colors, color-independent status, and screen-reader landmark and
disclosure semantics.

Deviation: the landing page uses a serif display face paired with the system
sans stack. No research source establishes this as intrinsically more readable;
it is a reversible contextual choice used to distinguish orientation content
from operational UI. Body and control text remain familiar system sans.
