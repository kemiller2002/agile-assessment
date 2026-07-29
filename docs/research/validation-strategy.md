# Validation Strategy

## Intended claims

The instrument is intended to identify delivery-system constraints and generate testable improvement hypotheses at a product/service-team level. It is not initially intended to rank teams or predict individual performance.

## Phase 0: governance

- Register constructs, intended uses, prohibited uses, hypotheses, and analysis plan.
- Form a panel including psychometrics, organizational psychology, software engineering, product, reliability, privacy, and worker representation.
- Define data retention, access, minimum cells, withdrawal, and incident response.

Exit criterion: approved construct map, ethics/privacy review, and named score-use owner.

## Phase 1: content and response process

- 20–30 expert reviews using content-validity ratings and adversarial review.
- 40–60 cognitive interviews across roles, company sizes, countries, and delivery contexts.
- Translate/back-translate only after English item stabilization; use bilingual cognitive interviews.
- Remove jargon, double-barreling, and items with inconsistent recall processes.

Exit criterion: strong item relevance/clarity agreement and no material unresolved response-process defect.

## Phase 2: pilot

Recruit at least 100 teams and 800 respondents across SaaS, platform, regulated, embedded, data/ML, and legacy contexts. Avoid treating individuals within teams as independent.

- analyze missingness, “not observable,” time, straight-lining, ceiling/floor effects
- exploratory factor analysis on one split
- multilevel reliability and within-team agreement
- test–retest after 2–4 weeks in stable teams
- examine correlations with methodologically distinct criteria

Exit criterion: usable burden, interpretable factors, adequate team-level precision, and no severe safety signal.

## Phase 3: confirmation and invariance

Use a fresh sample of at least 200 teams; choose final size by simulation and expected clustering.

- multilevel confirmatory factor models
- omega and conditional standard errors
- convergent/discriminant tests from preregistered hypotheses
- measurement invariance/DIF across role, language, geography, remote status, product type, and seniority
- compare self-report-only models with triangulated evidence models

Do not compare group means where scalar invariance (or defensible partial invariance) fails.

## Phase 4: prospective criterion validation

Collect baseline diagnostic signals, then observe 6–12 months of customer, delivery, reliability, and well-being outcomes. Control for prior outcome level and major contextual variables. Hold out organizations and time periods.

Evaluate:

- incremental prediction beyond prior performance and DORA outcome measures
- calibration and out-of-sample error, not only statistical significance
- whether disagreement and evidence gaps add predictive value
- alternative causal structures and sensitivity to unmeasured confounding

No causal language from cross-sectional associations.

## Phase 5: intervention tests

For diagnostic recommendations, use cluster-randomized rollout where feasible. Otherwise use stepped-wedge, interrupted time-series, or difference-in-differences designs and publish assumptions. Measure unintended consequences and mechanism, not only endpoint change.

## Phase 6: scoring/adaptation

Only after stable constructs exist:

- compare classical, multilevel, Bayesian, and graded-response IRT models
- require monotonicity, local independence, fit, adequate item information, and limited DIF
- cross-validate adaptive stopping rules
- keep evidence quality and respondent disagreement visible

IRT is not automatically more valid; a sophisticated model cannot repair an invalid construct.

## Ongoing monitoring

- annual drift and DIF review
- outcome calibration and false-reassurance audit
- gaming indicators and metric substitution
- adverse-impact and retaliation reports
- versioned item bank and public technical manual
- external replication
- sunset items whose information or predictive contribution becomes marginal

## Decision gates

A version may be called:

- **research prototype** after Phase 1
- **reliable for facilitated diagnosis** after Phases 2–3
- **predictively supported** only after successful held-out Phase 4
- **intervention-valid** only for recommendations supported in Phase 5

