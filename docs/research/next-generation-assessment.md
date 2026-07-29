# Next-Generation Organizational Delivery Diagnostic

Version: research prototype 0.1  
Referent: one named product/service team  
Recall window: previous 90 days unless stated otherwise

## Administration

Do not use for individual performance, compensation, ranking, certification, or vendor selection. Collect anonymously. Show “not observable” for every perception item. Minimum reporting cell: five respondents. Ask each participant only about events they could observe.

Response anchors for P-items:

1. Never or almost never (0–10% of relevant occasions)
2. Sometimes (11–39%)
3. About half the time (40–60%)
4. Usually (61–89%)
5. Almost always (90–100%)
6. Not observable / insufficient information

Each item also asks: “Which recent example most influenced your answer?” The example is optional and redacted before reporting.

## Core perception items

### A. Customer value and strategy

- P01. Before substantial work begins, the intended user or business outcome is stated so that success and failure can both be recognized.
- P02. When evidence contradicts an initiative’s expected value, people with authority reconsider or stop it.
- P03. The team can access recent evidence about whether delivered changes helped the intended users.
- P04. People who set priorities state the important trade-offs when goals compete.

### B. Flow and predictability

- P05. Work reaches a user-observable result in increments small enough to obtain feedback before major commitments are irreversible.
- P06. Blocked or aging work is noticed early enough for someone to act.
- P07. Forecasts are expressed as ranges with assumptions and are updated when evidence changes.
- P08. Urgent work enters through an explicit policy rather than silently displacing planned work.

### C. Quality and reliability

- P09. A change receives relevant automated or repeatable feedback soon enough to guide the person making it.
- P10. People can release a small change without coordinating a high-risk, organization-wide event.
- P11. When a service fails, responders can identify the responsible component and restore acceptable service promptly.
- P12. Recurring defects or incidents result in changes to the system, not only reminders to individuals.

### D. Sustainable developer experience

- P13. People can complete important work without excessive waiting for environments, permissions, information, or other teams.
- P14. Interruptions leave enough uninterrupted time for cognitively demanding work.
- P15. The team has the skills and access needed to own outcomes through operation and learning.
- P16. Delivery pressure does not routinely require unsustainable hours or knowingly deferred risk.

### E. Learning and experimentation

- P17. Important assumptions are recorded before an experiment or release so results can update the decision.
- P18. The team distinguishes evidence of customer impact from evidence that work was completed.
- P19. Improvement actions have an owner, a predicted effect, and a later check.
- P20. Failed experiments can be reported without being reframed as successes.

### F. Decision system and clarity

- P21. For decisions affecting this team, it is clear who decides, who contributes, and when a decision is needed.
- P22. Material decisions are recorded with rationale, evidence, and conditions that would trigger reconsideration.
- P23. Needed context is findable without depending on one person’s availability.
- P24. Independently asked, team members and sponsors describe the current outcome goal and main trade-off consistently.

### G. Ownership, dependencies, and architecture

- P25. The team can make routine product and technical decisions within explicit boundaries.
- P26. Cross-team dependencies have a named owner and observable service expectation.
- P27. The team regularly removes or redesigns dependencies that cause material waiting or failure risk.
- P28. A small product change usually requires changes in only a small, understandable part of the system.

### H. Psychological safety and information flow

- P29. People raise delivery risk or bad news early, including when a senior person prefers a different answer.
- P30. Asking for help or admitting uncertainty does not reduce a person’s standing on the team.
- P31. Reviews of failures examine system conditions without searching for a person to blame.
- P32. Relevant dissent is recorded and evaluated before an important irreversible decision.

### I. Leadership and system constraints

- P33. Leaders change policies or priorities when those policies demonstrably obstruct outcomes.
- P34. Goals remain stable long enough for meaningful progress, or changes are accompanied by explicit trade-offs.
- P35. Capacity assigned to maintenance, reliability, and architecture reflects their demonstrated risk and value.
- P36. Measures used by leaders do not reward local activity at the expense of customer or system outcomes.

## Evidence requests

Evidence is scoped to the product/service and 90 days. “Unavailable” is a valid diagnostic result.

- E01. Customer outcome: chosen product outcome, definition, baseline, current value, coverage, and owner.
- E02. Flow: median and 85th percentile time from work start to production/user availability; item inclusion rule.
- E03. Predictability: calibration of forecast ranges (percentage completed within stated ranges), not commitment hit rate.
- E04. Work in progress: aging distribution, blocked time, and top three recorded wait causes.
- E05. Delivery: deployment/change frequency and change lead time for the named service.
- E06. Instability: change failure rate, deployment rework rate, and failed-deployment recovery time.
- E07. Quality: escaped defects normalized by use or change volume, severity distribution, and detection delay.
- E08. Reliability: service-level indicator performance, significant incidents, and repeat-incident rate.
- E09. Interrupt load: unplanned-work share and on-call/interrupt burden, with definition.
- E10. Decision latency: sample of ten material decisions from request/need to decision, plus waiting cause.
- E11. Dependency burden: sample of cross-team waits, elapsed time, and whether the dependency is being removed.
- E12. Learning closure: sample of experiments/improvements with prior hypothesis, result, decision, and follow-up date.

## Adaptive follow-ups

- Low P01/P04 or high role disagreement: independently ask respondents to state the goal and top trade-off; compare semantic agreement.
- Low P05–P08: sample ten old work items and classify waiting, rework, queue, dependency, or oversized batch.
- Low P09–P12: map feedback loops from code change to production observation; identify the longest consequential delay.
- Low P13–P16: ask for the three most recent blocked episodes, not general satisfaction.
- Low P21–P24: sample material decisions and test whether authority, rationale, and reconsideration conditions were explicit.
- Low P25–P28: map dependencies and change coupling; test whether the bottleneck is architecture, policy, ownership, or scarce expertise.
- Low P29–P32 plus rosy leader scores: use a neutral facilitator and protect open text; do not run a public workshop on individual responses.
- Good perceptions but poor outcomes: inspect evidence definitions and seek omitted constraints or halo effects.
- Good outcomes but low perceptions: investigate sustainability, hidden labor, unequal burden, and lagging risk.

## Result format

For each domain show:

- response distribution and “not observable” rate
- leader/team and role deltas with privacy thresholds
- evidence coverage, freshness, and limitations
- outcome trend
- leading constraint hypothesis
- at least one rival hypothesis
- confidence range
- next discriminating observation or reversible experiment

Never show a total maturity score.

