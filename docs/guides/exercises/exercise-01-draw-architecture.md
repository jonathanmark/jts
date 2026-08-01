# Exercise 1: Draw Your First Architecture Diagram

> **Connects to:** [Lecture 1: System Architecture](../README.md#1-system-architecture)
>
> **Time to complete:** 45-60 minutes
>
> **What you'll need:** A web browser, a piece of paper (or [Excalidraw](https://excalidraw.com), or [draw.io](https://app.diagrams.net))

---

## Objective

Draw an architecture diagram for a **simple URL shortener** (like bit.ly or TinyURL). You will identify components, draw their connections, and explain the data flow.

---

## Scenario

You're building a URL shortener with these requirements:

1. A user visits a web page, enters a long URL, and clicks "Shorten"
2. The system generates a short code (e.g., `abc123`) and stores the mapping
3. When anyone visits `https://short.link/abc123`, they're redirected to the original URL
4. The system tracks how many times each short link has been clicked

---

## Step 1: List the Components (10 minutes)

Before drawing, answer these questions on paper:

| Question | Your Answer |
|---|---|
| What does the user interact with? (Frontend) | |
| Where does the business logic run? (Backend) | |
| Where is the URL mapping stored? (Database) | |
| What handles the redirect when someone clicks a short link? | |
| Where are click counts stored? | |
| Is there a cache to make redirects faster? | |
| How does the frontend talk to the backend? (Protocol) | |

<details>
<summary><b>Click for hints after you've tried</b></summary>

- Frontend: A simple HTML page with a form (or a React app if you prefer). Hosted on a web server or CDN.
- Backend: An API server that handles two operations: (1) create short URL, (2) resolve short URL to original.
- Database: Stores `short_code → original_url → click_count → created_at`.
- Cache: Redis (or similar) to cache the most popular short codes so redirects are instant.
- Protocol: HTTP. Frontend sends POST to create; browser sends GET to resolve.
</details>

---

## Step 2: Draw the Diagram (20 minutes)

Open [Excalidraw](https://excalidraw.com) (free, no account needed) or use pen and paper.

### Rules for your diagram:

1. **Boxes** = components (Frontend, API Server, Database, Cache)
2. **Arrows** = data flow (label each arrow with the protocol and data format)
3. **Labels** = every box has a name. Every arrow says what flows across it.
4. **Flow direction** = top to bottom OR left to right

### Template to start from:

```
[User's Browser]
      │
      │  HTTP POST /api/shorten  { "url": "https://example.com/very-long-url" }
      ▼
[Web Server / API] ──── generates short code ────► [Database]
      │                                               (short_code → original_url)
      │  HTTP Response  { "short_url": "https://short.link/abc123" }
      ▼
[User's Browser] shows the short link
```

Now add:
- The **redirect flow** (what happens when someone clicks the short link)
- The **cache layer** (where does Redis fit?)
- The **analytics** (how do click counts get updated?)

---

## Step 3: Annotate Your Diagram (10 minutes)

Add these annotations next to each component:

| Component | Annotation |
|---|---|
| Frontend | **Tech:** HTML/CSS/JS or React. **Responsibility:** Capture user input, display result. |
| API Server | **Tech:** FastAPI (Python) or Express (Node.js). **Responsibility:** Generate codes, resolve codes, count clicks. |
| Database | **Tech:** PostgreSQL or DynamoDB. **Responsibility:** Store mappings persistently. |
| Cache | **Tech:** Redis. **Responsibility:** Serve popular redirects in < 1ms. |

---

## Step 4: Trace Two Requests (15 minutes)

Write a step-by-step trace for these two scenarios:

### Scenario A: User shortens a URL

```
1. User types https://example.com/very-long-url into the form and clicks "Shorten"
2. _________________________________
3. _________________________________
4. _________________________________
5. User sees: "Your short link: https://short.link/abc123"
```

### Scenario B: Someone clicks the short link

```
1. User clicks https://short.link/abc123 (or types it in their browser)
2. _________________________________
3. _________________________________
4. _________________________________
5. Browser redirects to https://example.com/very-long-url
```

<details>
<summary><b>Click for sample answers</b></summary>

**Scenario A:**
1. User types URL and clicks "Shorten"
2. Browser sends HTTP POST to `/api/shorten` with `{"url": "https://example.com/very-long-url"}`
3. API server generates a random 6-character code (e.g., `abc123`)
4. API server inserts `{short_code: "abc123", original_url: "...", click_count: 0}` into the database
5. API server returns `{"short_url": "https://short.link/abc123"}`
6. Frontend displays the short link

**Scenario B:**
1. User clicks `https://short.link/abc123`
2. Browser sends HTTP GET to `short.link/abc123`
3. API server checks Redis cache for `abc123` → cache miss
4. API server queries database for `abc123` → finds original URL
5. API server stores `abc123 → original_url` in Redis (cache it for next time)
6. API server increments `click_count` in the database
7. API server returns HTTP 302 Redirect to the original URL
8. Browser follows the redirect to `https://example.com/very-long-url`
</details>

---

## Step 5: Self-Review Checklist

Before you consider this exercise done, check:

- [ ] My diagram has at least 4 boxes (Frontend, API, Database, Cache)
- [ ] Every arrow has a label (protocol + data)
- [ ] I can trace both flows (create + redirect) step by step
- [ ] I know which component would break if the database went down
- [ ] I know which component would break if Redis went down (and why it's not catastrophic)

---

## Bonus Challenge

Add a **Rate Limiter** to your architecture. Where does it go? What does it protect?

<details>
<summary><b>Hint</b></summary>
The rate limiter sits between the API server and the outside world (or inside the API server as middleware). It protects against abuse: one user creating 10,000 short links per second. It's typically implemented with Redis (counting requests per IP per time window).
</details>

---

## Stuck?

| Symptom | Likely Cause | Fix |
|---|---|---|
| "I do not know what boxes to draw" | You are overthinking it | Start with just 3 boxes: Frontend, Backend, Database. Every system has these. Add from there. |
| "My diagram looks messy" | You are trying to fit too much | Use a separate diagram for each flow. One for "create short URL." One for "redirect." |
| "I do not know what to label the arrows" | You are guessing the protocol | Rule: Browser → Server = HTTP. Server → Database = SQL. Server → Cache = Redis protocol. |
| "I cannot decide between components" | You are unsure about separation | Rule: If it stores data, it is a database. If it processes logic, it is a server. If a user sees it, it is a frontend. |

**Expected output:** At minimum, your diagram should have 4 labeled boxes (Frontend, API Server, Database, Cache) and at least 6 labeled arrows. You should be able to trace the "create short URL" flow in under 30 seconds when someone asks.

---

## What You've Practiced

- ✅ Identifying components from requirements
- ✅ Drawing boxes and arrows with meaningful labels
- ✅ Tracing a request end-to-end through the system
- ✅ Understanding where caching fits
- ✅ Thinking about failure modes (what breaks if X goes down?)

---

**Done?** Share your diagram with a teammate or your tech lead and ask: "Does this make sense? What am I missing?" Feedback is how you get better at this.
