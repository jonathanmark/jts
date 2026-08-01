# Exercise 6: Plan a Mini Roadmap

> **Connects to:** [Lecture 6: Execution Roadmap](../README.md#6-execution-roadmap)
>
> **Time to complete:** 45-60 minutes
>
> **What you'll need:** A text editor or a piece of paper. No coding required.

---

## Objective

Plan a 4-week roadmap for building a **simple internal tool**. You'll practice:
1. Breaking a project into phases
2. Defining deliverables for each phase
3. Assigning work between two sub-teams (frontend + backend)
4. Identifying dependencies and risks

---

## Scenario

Your team (2 junior developers — you and one partner) has been asked to build an **Employee Directory** for your company. It sounds simple, but there's more to it:

**Requirements (from the stakeholder):**
- Any employee can search for another employee by name, department, or role
- Each employee has a profile page showing: name, photo, department, role, email, phone, and office location
- HR can add, edit, and deactivate employee records
- An org chart view that shows the reporting hierarchy
- The data comes from the existing HR system (a CSV export that HR uploads weekly)
- It should work on mobile phones (people look up colleagues from their phones)

**Constraints:**
- You have 4 weeks
- It's just you and one partner (2 developers total)
- The backend uses FastAPI + PostgreSQL (company standard)
- The frontend uses React (company standard)
- There's an existing design system (component library) you can use

---

## Part A: Define the Phases (15 minutes)

Break the 4 weeks into phases. Each phase should be 1 week.

Fill in this table:

| Phase | Week | Theme | Goal (one sentence) |
|---|---|---|---|
| 1 | 1 | | |
| 2 | 2 | | |
| 3 | 3 | | |
| 4 | 4 | | |

### Guiding questions:
1. What must exist before anything else? (Skeleton, database schema)
2. What's the core feature? (Search + profiles)
3. What's the "nice to have" that stakeholders explicitly asked for? (Org chart)
4. What do you need for launch? (Testing, mobile polish, CSV import)

<details>
<summary><b>Click for a sample breakdown after you've tried</b></summary>

| Phase | Week | Theme | Goal |
|---|---|---|---|
| 1 | 1 | Foundation | Database schema, CSV import, empty React app with routing |
| 2 | 2 | Core Features | Search works, profile pages render, basic styling |
| 3 | 3 | Advanced Features | Org chart view, HR edit capabilities, mobile responsive |
| 4 | 4 | Polish & Launch | Bug fixes, performance, UAT with HR, deploy to production |
</details>

---

## Part B: Assign Work Between Sub-Teams (10 minutes)

For each phase, decide what the frontend developer does and what the backend developer does.

| Phase | Frontend Developer | Backend Developer |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |

### Guiding questions:
1. In Phase 1, who is blocked waiting for whom? (Hint: The frontend needs API endpoints to exist. How do you unblock the frontend?)
2. In Phase 4, do you still need separate frontend/backend work? Or should you pair up?

<details>
<summary><b>Click for sample assignments</b></summary>

| Phase | Frontend | Backend |
|---|---|---|
| 1 | Set up React project, routing, placeholder pages. Create mock API responses (hardcoded JSON) to develop against. | Design PostgreSQL schema. Build CSV import Lambda/script. Create `GET /api/employees` and `GET /api/employees/{id}` endpoints. |
| 2 | Build search bar with autocomplete. Build profile page with all fields. Integrate with real API. | Add search endpoint with filtering (`?name=`, `?department=`, `?role=`). Add pagination. Write tests. |
| 3 | Build org chart view (tree visualization). Build HR edit forms. Add mobile breakpoints. | Add `PUT /api/employees/{id}` (update). Add reporting hierarchy endpoint. Add deactivation logic. |
| 4 | Fix UI bugs. Polish mobile views. Add loading/empty/error states. Run Lighthouse audit. | Performance optimization. Add indexes on search columns. Write API docs. Set up production deploy pipeline. Both: UAT with HR team. |

Key insight: In Phase 1, the frontend uses **mock data** to avoid being blocked. The mock data matches the expected API response format — when the real API is ready, it's a one-line URL change.
</details>

---

## Part C: Identify Dependencies and Risks (10 minutes)

### Dependencies

List 3 things where one task MUST finish before another can start:

| Blocker Task | Blocked Task | Why |
|---|---|---|
| | | |
| | | |
| | | |

### Risks

List 3 things that could go wrong and delay the project:

| Risk | Likelihood (H/M/L) | Mitigation |
|---|---|---|
| | | |
| | | |
| | | |

<details>
<summary><b>Click for examples</b></summary>

**Dependencies:**
1. Database schema → API endpoints (can't build API without knowing the data shape)
2. API endpoints → Frontend integration (can't connect real data without endpoints)
3. CSV import script → HR UAT (HR needs real data to test)

**Risks:**
1. CSV format doesn't match expectations (M) → Ask HR for sample CSV in Week 1, not Week 3
2. Org chart visualization is harder than expected (M) → Research React tree libraries in Week 1, pick one early
3. HR changes requirements mid-project (H) → Show HR a clickable prototype in Week 2 to catch misunderstandings early
</details>

---

## Part D: Define "Done" (5 minutes)

Write a checklist that every feature must pass before being marked "done" in this project:

```
- [ ] _________________________________
- [ ] _________________________________
- [ ] _________________________________
- [ ] _________________________________
- [ ] _________________________________
- [ ] _________________________________
```

<details>
<summary><b>Sample "Done" checklist</b></summary>

```
- [ ] Code merged to main branch (after peer review)
- [ ] Works on Chrome, Firefox, Safari (latest versions)
- [ ] Works on mobile (iPhone SE and Pixel 5 viewport sizes)
- [ ] Loading, empty, error, and edge-case states handled
- [ ] No console errors or warnings
- [ ] API endpoint has at least one integration test
- [ ] New database columns have appropriate indexes
- [ ] PR description includes screenshots (frontend) or curl examples (backend)
```
</details>

---

## Part E: The "First Day" Plan (5 minutes)

You're the frontend developer. It's 9:00 AM on Day 1 of Phase 1. What are your first 5 actions?

```
1. _________________________________
2. _________________________________
3. _________________________________
4. _________________________________
5. _________________________________
```

<details>
<summary><b>Sample first-day plan</b></summary>

```
1. Read the full requirements document (20 min)
2. Set up the React project (Vite + React Router + company design system) (1 hour)
3. Create placeholder pages: Search, Profile, Org Chart, Admin (30 min)
4. Write mock data (20 fake employees in JSON format matching the expected API response) (30 min)
5. Sync with backend partner: confirm API response format, agree on endpoint paths (15 min)
```
</details>

---

## Part F: Reflection (5 minutes)

Answer these questions honestly:

1. **What was the hardest part of this exercise?** Breaking into phases? Assigning work? Identifying risks?
2. **Did you over-plan or under-plan?** (Over-planning = too detailed for 4 weeks. Under-planning = vague phases with no concrete tasks.)
3. **What would you do differently if this were a 6-month project instead of 4 weeks?**
4. **How does this exercise relate to our blueprint's 6-month roadmap?** What's similar? What's different?

---

## Stuck?

| Symptom | Likely Cause | Fix |
|---|---|---|
| "I cannot decide how many phases to use" | You are overthinking the granularity | For a 4-week project, use exactly 4 phases of 1 week each. Do not over-optimize the breakdown — the value is in the exercise of breaking it down, not in getting the "right" answer. |
| "I do not know what the frontend person does in Phase 1" | You are forgetting about mock data | The frontend can ALWAYS start with hardcoded JSON that matches the expected API response shape. This unblocks the frontend while the backend builds the real API. |
| "My risks all seem the same" | You are thinking at the wrong level | Specific risks: "CSV format from HR does not match our parser's expectations" is specific. "Something might go wrong" is not. Be specific about WHAT could fail and WHY. |
| "I do not know what 'done' means for a planning exercise" | Planning exercises have no code, so traditional "done" does not apply | For this exercise, "done" means all tables are filled in, all questions have answers, and you could explain your plan to another engineer in 5 minutes. |

**Expected output:** Your Phase 1-4 table should have concrete, specific tasks — not vague goals. Your dependencies table should have at least 2 entries where one task genuinely blocks another. Your risks table should name specific risks (not "things might go wrong"). Your "First Day" plan should have 5 actionable tasks with time estimates.

---

## What You've Practiced

- Broken a project into time-boxed phases with clear goals
- Assigned frontend/backend work per phase
- Identified dependencies (what blocks what)
- Assessed risks and planned mitigations
- Defined a "done" checklist
- Planned a concrete first day of work

---

**Done?** This is exactly the skill that separates junior engineers from mid-level engineers: the ability to take a vague requirement ("build an employee directory") and turn it into a concrete plan with phases, assignments, and risk mitigations. Practice this on every project — even if you're not the one making the official plan, doing it privately will sharpen your engineering judgment.
