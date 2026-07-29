# Agile Assessment Research and Redesign

Status: research prototype, not a validated test  
Date: 2026-07-29  
Scope: `agile-assessment-v2.json` (403 statements, 28 sections)

## Executive summary

The current instrument should not be interpreted as a scientifically validated measure of “Agile maturity” or organizational performance. It is primarily a checklist of prescribed practices arranged on an assumed linear path from −1 to 3. The score mixes distinct constructs, rewards method conformity, treats ordinal labels as arithmetic quantities, and relies almost entirely on unanchored self-report. A team can score well while producing poor customer or operational outcomes; a capable team can score poorly because it uses a different workflow.

The recommended replacement is a diagnostic system, not a maturity test:

1. Measure a balanced set of outcomes: customer value, delivery flow, quality/reliability, learning, and human sustainability.
2. Measure explanatory capabilities only where there is a stated causal hypothesis.
3. Combine anonymous, role-stratified perceptions with operational data and sampled evidence.
4. Report distributions, disagreement, uncertainty, and data quality—not one league-table score.
5. Use conditional follow-ups to locate constraints and test rival explanations.
6. validate predictions prospectively before using results for consequential decisions.

The proposed core has 36 perception items and 12 evidence requests. It takes about 10–12 minutes for respondents; evidence collection is separate. Its constructs are hypotheses until the validation program succeeds.

## 1. Scientific review

### 1.1 What credibility requires

Validity is not a property bestowed on a questionnaire. It is an evidence-backed argument for a particular interpretation and use of scores. The joint AERA/APA/NCME testing standards cover validity, reliability/error, fairness, design, administration, scoring, and intended use. COSMIN similarly separates content validity, structural/construct validity, reliability, measurement error, cross-cultural validity, criterion validity, responsiveness, and interpretability.

For this instrument that means:

- **Content validity:** domain definitions and items reviewed by engineers, product leaders, executives, customers, and measurement experts.
- **Response-process validity:** cognitive interviews show that respondents use the intended referent, recall window, and evidence.
- **Structural validity:** factor models support the proposed dimensions; internal consistency is examined only after dimensionality.
- **Reliability:** test–retest stability where stability is expected, inter-rater agreement where observers judge the same event, and sufficient precision at the team—not individual—level.
- **Convergent/discriminant validity:** related constructs relate, while distinct constructs remain empirically separable.
- **Criterion/predictive validity:** baseline scores predict later outcomes beyond team size, product type, legacy burden, regulation, and prior performance.
- **Measurement invariance:** comparisons across roles, languages, cultures, remote/on-site settings, and organizational levels are defensible.
- **Responsiveness:** the measure detects real change without simply training respondents to answer “correctly.”
- **Fairness and consequences:** monitor retaliation, metric gaming, perverse incentives, and misuse in performance management.

Cronbach’s alpha alone is insufficient. A high alpha can reflect redundant wording; it neither proves unidimensionality nor validity. Use omega after factor analysis, report uncertainty, and avoid universal cutoffs detached from purpose.

### 1.2 Defects in the current design

The repository instrument contains 403 statements. Its principal defects are:

- **Construct contamination:** sections mix behavior, tools, beliefs, outputs, outcomes, and organizational support.
- **Ideological criterion:** Scrum events, user-story templates, pair programming, velocity, and T-shaped skills are treated as ends rather than context-dependent means.
- **Unsupported ordering:** fixed scores imply each statement is harder and better than lower-scored statements, without calibration.
- **False arithmetic:** adding −1/0/1/2/3 assumes equal intervals and compensability.
- **Double-barreling:** many statements contain several conditions; a single response cannot locate failure.
- **Undefined terms:** “effective,” “frequent,” “strong,” “realistic,” and “valuable” lack behavioral anchors.
- **No referent or window:** “the team” and frequency statements often omit product boundary and recall period.
- **Common-source risk:** perceptions of practices and success from the same source can inflate apparent relationships.
- **Halo and acquiescence:** nearly every “healthy” answer is obvious and positively keyed.
- **Gaming:** respondents can endorse expected Agile language without evidence.
- **Context blindness:** one sequence is imposed on legacy, embedded, regulated, platform, SaaS, and research work.
- **Survey fatigue:** 403 judgments will encourage satisficing, straight-lining, and attrition.
- **Actionability illusion:** a score says where an assessor placed a team, not which constraint caused an outcome.

The complete, reproducible item audit is in `existing-item-audit.csv`. Its classifications are structured expert-screening rules, not empirical item statistics.

### 1.3 What predicts success

Evidence strength varies:

| Candidate | Recommended role | Evidence interpretation |
|---|---|---|
| Change lead time, deployment frequency, failed deployment recovery time, change fail rate, deployment rework rate | Outcome/criterion | DORA reports these as a balanced throughput/instability family predictive of organizational performance and well-being. Do not optimize one alone or compare unlike services. |
| Customer/user outcomes | Primary criterion | Necessary to prevent fast delivery of low-value work. Measures must be product-specific. |
| Reliability, escaped defects, incident burden | Primary criterion | Essential guardrails; normalize by exposure and criticality. |
| Developer experience/well-being | Outcome and mediator | SPACE argues productivity is multidimensional and cannot be reduced to activity. |
| Psychological safety | Explanatory capability | Correlated with learning and team effectiveness; self-report and local observational studies do not establish universal causality. |
| Loosely coupled architecture, continuous testing, small batches | Candidate capability | DORA reports associations and plausible mechanisms; local causal effect still needs experimentation or longitudinal evidence. |
| Autonomy, trust, alignment, decision speed | Candidate capability/mediator | Plausible and supported across organizational research, but construct definitions and boundary conditions matter. |
| Velocity, story points, utilization, lines of code, hours worked | Do not use as success criteria | Local planning/activity measures are easy to game and not comparable across teams. |
| Flow efficiency | Diagnostic metric | Useful for locating waiting; sensitive to workflow definitions and data quality. |
| Technical debt/architecture quality | Diagnostic construct | Important but no universal scalar measure; combine change difficulty, dependency evidence, incidents, and expert review. |

Most available software-delivery evidence is observational. “Predicts” or “is associated with” must not be rewritten as “causes.” Stronger local causal claims require randomized rollout where feasible, interrupted time series, difference-in-differences, or repeated-measures designs with explicit assumptions.

## 2. Review of existing assessment families

Public documentation varies sharply, and several commercial instruments do not disclose item banks, validation samples, scoring models, or independent replication. Absence of public evidence is not evidence of ineffectiveness; it limits defensibility.

| Family | Useful contribution | Main limitation for this mission |
|---|---|---|
| Scrum.org / EBM | Balances current value, unrealized value, time-to-market, and ability to innovate; encourages experiments | A management framework, not by itself a validated psychometric instrument |
| Scrum Alliance / Scrum practice assessments | Accessible method guidance | Risks equating framework adherence with capability; public predictive-validation evidence is limited |
| SAFe assessments | Broad enterprise coverage and structured improvement prompts | Framework-conformance and maturity assumptions; commercial/proprietary evidence limits scrutiny |
| Spotify Squad Health Check | Team conversation, visible disagreement, trend orientation | Context-specific facilitation tool; traffic-light judgments are not a universal performance scale |
| Comparative Agility | Benchmarking and broad capability coverage | Benchmark validity depends on sampling, comparability, item transparency, and criterion studies |
| Agile Fluency | Explicitly says there is no single right destination and connects capability to investment | Built from practitioner observation; public independent psychometric/predictive evidence is limited |
| ACI coaching models | Rich culture and leadership reflection | Often developmental rubrics rather than outcome-validated measures |
| Thoughtworks technology practices | Strong engineering-practice expertise | Practice recommendations must be separated from validated assessment claims |
| McKinsey / Deloitte / Gartner | Executive framing and large client experience | Often proprietary methods, opaque weights, and insufficient public replication |
| Accelerate / DORA | Best-developed empirical software-delivery program; balanced performance measures and capability hypotheses | Mostly observational self-report research, evolving constructs, and context/comparability cautions |

No reviewed family justifies a universal, single Agile maturity score.

## 3. Disposition of the current instrument

### Remove as scored ends

- Scrum-event attendance or format
- user-story syntax
- pair programming frequency
- velocity-based release estimation
- “T-shaped” identity
- information radiators as artifacts
- named tools or IDE integration
- blanket preference for one branching or architecture style
- “maturity,” “best practice,” or “Agile” self-identification

These may appear only as conditional evidence about a hypothesized constraint.

### Rewrite or split

- Separate access to decision-makers from communication medium.
- Separate shared standards, awareness, adherence, and learning.
- Separate dependency visibility, wait time, ownership, and removal.
- Separate goal clarity, outcome measures, evidence, and trade-off authority.
- Separate build automation, test feedback time, deployment safety, and recovery.
- Replace “often/frequently/effective” with a 90-day window and observable anchors.

### Require objective or sampled evidence

- delivery and recovery times, deployment frequency, defects/incidents
- customer outcomes and adoption
- work-item aging and blocked time
- dependency wait time
- decision latency
- unplanned work and interrupt load
- reliability objectives and error-budget/incident review
- experiment hypotheses and outcomes
- change difficulty and concentration of ownership

### Questions that should never be asked as scored health indicators

- “How Agile is your team?”
- “Do leaders support Agile?”
- “Does everyone follow best practices?”
- “Are developers productive?”
- “What is your team’s velocity compared with other teams?”
- “Do you have zero defects?”
- “Does the team always meet commitments?”

They invite social desirability, contain undefined absolutes, or create unsafe incentives.

## 4. Diagnostic model

The unit is a stable product/service team and its delivery system. Results expire after 90 days unless refreshed. The model has five outcome domains and seven explanatory domains:

- Outcomes: customer value; flow/predictability; quality/reliability; learning/adaptation; sustainable experience.
- Capabilities: goal/evidence clarity; decision system; ownership/autonomy; architecture/dependencies; engineering feedback; operational learning; psychological safety/information flow.

Each signal carries:

- observation and time window
- source type (telemetry, record, artifact, respondent, observer)
- data coverage and confidence
- role distribution and dispersion
- hypothesized link to an outcome
- alternative explanations

No overall maturity number is produced. The output is a “diagnostic case”: observed outcome, likely constraint, competing hypotheses, evidence gaps, and next discriminating test.

### Clarity integration

The prompt’s Clarity Framework is provisionally operationalized as goal specificity, shared interpretation, context access, evidence quality, alternative evaluation, decision confidence/calibration, and learning closure. These are not collapsed into one “clarity” score. Shared mental models are inferred from agreement on independently elicited goal/trade-off descriptions, not merely from “we are aligned.”

### EDF integration

Because no EDF specification was present in the repository, only a minimal Echelon-style reasoning loop is used:

1. **Outcome:** what changed, for whom, and over what window?
2. **Pattern:** where and when does it occur?
3. **Proximate constraint:** what queue, dependency, decision, feedback delay, or failure mode is visible?
4. **System condition:** what policy, architecture, incentive, information boundary, or capacity constraint sustains it?
5. **Competing explanations:** what else could produce the same observations?
6. **Discriminating evidence:** what low-cost observation would separate them?
7. **Intervention:** smallest reversible change with an owner and prediction.
8. **Update:** revise confidence after new evidence.

Calling this “EDF validation” would be unjustified until EDF is formally specified and tested.

## 5. Scoring recommendation

Use descriptive and Bayesian diagnostic scoring now; reserve IRT for later calibration.

- Report medians and full response distributions by role, with minimum-cell privacy rules.
- Report role disagreement as a signal, not as noise to average away.
- Give evidence coverage and freshness their own grade.
- For each hypothesis, begin with an explicit prior and update with conditionally relevant evidence; display probability ranges and sensitivity to priors.
- Do not weight domains into a total unless a decision-specific utility model is declared and validated.
- Use confidence questions sparingly; confidence is not correctness.
- Add adaptive follow-ups based on low outcome/high disagreement or missing evidence.
- Consider graded-response IRT only after a large, heterogeneous calibration sample supports unidimensional subscales, local independence, monotonicity, fit, and limited differential item functioning.

## 6. Blind-spot detection

- anonymous collection through a neutral channel
- role-stratified distributions rather than management averages
- “don’t know / insufficient visibility” as informative
- independent goal and priority elicitation before group discussion
- randomized item order within short modules
- behaviorally anchored time windows
- objective/sampled evidence linked after perception collection
- perception–telemetry deltas and leader–team deltas
- missingness, completion time, straight-lining, and impossible-pattern checks
- interviews with dissenting/minority patterns without exposing identities
- explicit anti-retaliation policy and prohibition on individual performance use

## 7. Sources

1. AERA, APA, & NCME, [Standards for Educational and Psychological Testing](https://www.apa.org/science/programs/testing/standards).
2. Mokkink et al., [COSMIN checklist](https://pmc.ncbi.nlm.nih.gov/articles/PMC2852520/).
3. DORA, [Software delivery performance metrics](https://dora.dev/guides/dora-metrics/).
4. DORA, [2024 Accelerate State of DevOps report](https://dora.dev/research/2024/dora-report/2024-dora-accelerate-state-of-devops-report.pdf).
5. Google Cloud, [2021 Accelerate State of DevOps](https://cloud.google.com/resources/state-of-devops).
6. Forsgren et al., [The SPACE of Developer Productivity](https://www.microsoft.com/en-us/research/publication/the-space-of-developer-productivity-theres-more-to-it-than-you-think/).
7. Google re:Work, [Understand team effectiveness](https://rework.withgoogle.com/en/guides/understanding-team-effectiveness).
8. Scrum.org, [Evidence-Based Management](https://www.scrum.org/resources/evidence-based-management).
9. Agile Fluency Project, [The Agile Fluency Model](https://www.agilefluency.org/model.php).
10. Rivers, Meade, & Fuller, [Question and context effects using IRT](https://journals.sagepub.com/doi/10.1177/1094428108315864).
11. Donaldson & Grant-Vallone, [Understanding self-report bias](https://scholarship.claremont.edu/cgu_fac_pub/591/).
