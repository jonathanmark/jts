# Junior Engineer Onboarding Guide

> **Based on:** [Requirements and Product Architecture](../requirements-and-architecture.md) — the enterprise blueprint for a real-time, multi-tenant AI Agentic Platform on AWS.
>
> **For:** Junior software engineers with CS/CPE degrees and little to no practical experience.

---

## How to Use This Guide

This is a **self-paced curriculum** designed to take you from "I understand CS theory" to "I can contribute to a real production system." 

All six lectures are contained in this single file. Each lecture explains a section of our blueprint in plain English — no jargon without explanation, no assumptions about what you already know. Each lecture links to a **hands-on exercise** (separate `.md` file) you can run on your own laptop.

**Recommended order:** Go sequentially (1 → 6). Each lecture builds on the previous one.

⏱️ **Estimated total reading time:** 4-5 hours across all 6 lectures
📅 **Suggested pace:** One lecture + one exercise per day
💰 **Total cost to complete:** $0.00 (using free tiers and local tools). Exercise 5 optionally costs ~$0.05 in API credits if you use OpenAI.

---

## Start Here (15 minutes)

If you only have time for the essentials right now:

1. Set up your Python environment using the [Prerequisites](#prerequisites) section below
2. Read [Lecture 1: System Architecture](#1-system-architecture) — understand the big picture
3. Do [Exercise 1](exercises/exercise-01-draw-architecture.md) — draw a diagram with pen and paper
4. Come back tomorrow for Lecture 2. Repeat one lecture + one exercise per day.

> **New to a term?** Jump to the [Master Glossary](#master-glossary) at the bottom of this document for quick definitions of every term used across all lectures.

---

## Table of Contents

| # | Lecture | What You'll Learn | Exercise |
|---|---|---|---|
| 1 | [System Architecture](#1-system-architecture) | How to read architecture diagrams, trace requests, understand client-server/microservices/event-driven patterns | [Draw your first architecture diagram](exercises/exercise-01-draw-architecture.md) |
| 2 | [AWS Services](#2-aws-services) | How cloud services map to CS fundamentals, what each AWS service does, managed vs. unmanaged trade-offs | [Deploy a serverless web app](exercises/exercise-02-cloud-services-mapping.md) |
| 3 | [Performance Strategy](#3-performance-strategy) | Latency budgets, caching strategies, streaming (SSE), structured vs. unstructured data, load testing | [Measure and optimize API latency](exercises/exercise-03-latency-budget.md) |
| 4 | [Authentication & RBAC](#4-authentication-rbac) | AuthN vs. AuthZ, JWT tokens (how they work and why they're brilliant), role-based access control, defense in depth | [Build a JWT + RBAC system](exercises/exercise-04-jwt-rbac.md) |
| 5 | [Multimodal Vision Pipeline](#5-multimodal-vision-pipeline) | How vision-language models work, image compression, prompt engineering for vision, debugging model output | [Call a vision model API](exercises/exercise-05-vision-api.md) |
| 6 | [Execution Roadmap](#6-execution-roadmap) | How 6-month projects are structured, what each phase means for you, working in sub-teams, what "done" looks like | [Plan a mini roadmap](exercises/exercise-06-project-planning.md) |

---

## Role-Based Learning Paths

If you are in a specific role, focus on these lectures first — you can read the others afterward.

### Frontend-Focused (Team Alpha in our blueprint)

| Priority | Lecture | Why |
|---|---|---|
| 1 | [Lecture 1](#1-system-architecture) | Understand the big picture — every developer needs this |
| 2 | [Lecture 2](#2-aws-services) | Focus on S3, CloudFront, Cognito |
| 3 | [Lecture 4](#4-authentication-rbac) | JWT handling on the client side |
| 4 | [Lecture 6](#6-execution-roadmap) | What "done" means for frontend work |

⏱️ ~2.5 hours

### Backend-Focused (Team Beta in our blueprint)

| Priority | Lecture | Why |
|---|---|---|
| 1 | [Lecture 1](#1-system-architecture) | Understand the big picture — every developer needs this |
| 2 | [Lecture 2](#2-aws-services) | All services, especially ECS, Aurora, Bedrock |
| 3 | [Lecture 3](#3-performance-strategy) | Caching, streaming, load testing |
| 4 | [Lecture 4](#4-authentication-rbac) | Middleware, server-side enforcement |
| 5 | [Lecture 5](#5-multimodal-vision-pipeline) | Bedrock integration |

⏱️ ~3.5 hours

---

## Prerequisites

Before starting, make sure you have:

- **Python 3.10+** installed (`python3 --version`)
- **pip** installed (`pip --version`)
- **A code editor** (VS Code recommended)
- **A terminal** you're comfortable with
- **A GitHub account** (for Exercise 2, you may also want an AWS free tier account)

### Quick Environment Setup

```bash
# Create a directory for all exercises
mkdir -p ~/junior-eng-lab
cd ~/junior-eng-lab

# Create a shared virtual environment
python3 -m venv venv
source venv/bin/activate

# Install pinned dependencies (tested together, won't break unexpectedly)
pip install -r guides/exercises/requirements.txt
```

---

## The Exercises

Each exercise is designed to be:
- ✅ **Local-first:** Runs on your laptop. No cloud account required (except Exercise 2, which uses AWS free tier).
- ✅ **45-75 minutes:** Fits in a focused work session. Not an all-day ordeal.
- ✅ **Real tools:** You'll use the same libraries and patterns we use in production (FastAPI, Redis, boto3, JWT, Locust).
- ✅ **Self-checking:** Each exercise has a checklist so you know when you're done.

| Exercise | Topic | Tools You'll Use |
|---|---|---|
| [Exercise 1](exercises/exercise-01-draw-architecture.md) | Architecture diagrams | Excalidraw / pen & paper |
| [Exercise 2](exercises/exercise-02-cloud-services-mapping.md) | Cloud services | AWS S3, Lambda, DynamoDB, boto3 |
| [Exercise 3](exercises/exercise-03-latency-budget.md) | Performance & caching | Python, Flask, Redis, Locust |
| [Exercise 4](exercises/exercise-04-jwt-rbac.md) | Auth & RBAC | Python, FastAPI, PyJWT |
| [Exercise 5](exercises/exercise-05-vision-api.md) | Vision AI | Python, Pillow, OpenAI/Bedrock API | ⚠️ Requires API key (~$0.01/image). See exercise for zero-cost alternatives. |
| [Exercise 6](exercises/exercise-06-project-planning.md) | Project planning | Text editor / paper |

---

# 1. System Architecture

## What You'll Learn

- What "system architecture" actually means
- How to read an architecture diagram without feeling lost
- The key patterns: client-server, microservices, event-driven
- How to think about the system in our blueprint

---

## 1.1 What Is System Architecture?

Think of system architecture as the **blueprint of a building**. Before anyone lays a single brick, an architect draws plans showing where the walls go, how the plumbing connects, and where the electrical wiring runs. 

In software, system architecture is exactly the same idea:

| Building Analogy | Software Equivalent |
|---|---|
| Floor plan | Architecture diagram |
| Plumbing pipes | Data flow between services |
| Electrical wiring | Network connections (HTTP, WebSockets) |
| Rooms with specific purposes | Services (database, cache, API server) |
| Building code | Security rules, RBAC, encryption |

**Definition:** System architecture is the high-level structure of a software system — what components exist, how they communicate, and what responsibilities each one has.

---

## 1.2 Why Architecture Matters (Even for Juniors)

You might think architecture is "senior engineer stuff." It's not. Here's why you need to understand it from day one:

1. **Debugging:** When something breaks, you need to know which component is failing. Is it the database? The cache? The API? Without understanding the architecture, you're debugging blind.

2. **Code placement:** You'll be asked to "add a feature." Knowing the architecture tells you *where* to put that code. Does it belong in the frontend? The API layer? A new microservice?

3. **Communication:** Senior engineers and architects will describe the system to you. If you understand the vocabulary, you can ask better questions and learn faster.

4. **Interview growth:** "Explain the architecture of a system you worked on" is one of the most common mid-level interview questions. Start building that mental model now.

---

## 1.3 How to Read an Architecture Diagram

Let's break down the architecture diagram from our blueprint step by step. Here's the full diagram:

```
[ Agent UI (React + WebSockets/SSE) ]
                 │
                 ▼
     [ CloudFront + S3 (CDN) ]
                 │
                 ▼
    [ Application Load Balancer ]
                 │
                 ▼
[ FastAPIs on AWS ECS Fargate (Auto-scaling) ] ◄── Authentication via AWS Cognito (JWT)
   │               │                 │
   ├── (Cache) ────┼── (Structured) ─┼── (Vector)
   ▼               ▼                 ▼
[ ElastiCache ]  [ Aurora Postgres ] [ OpenSearch Serverless ]
(Redis Session)  (Customer/Sales)    (Wiki Embeddings)
   │
   └───────────────► [ Amazon Bedrock ]
                     (Claude 3.5 Haiku / Sonnet Vision LLM)
```

### How to Read It (Step by Step)

**Step 1 — Start at the top (the user):** Every system exists to serve someone. Here, it's the support agent using a web browser. The top box `[Agent UI]` is the **frontend** — what the user sees and interacts with.

**Step 2 — Follow the arrows down (the request path):** Arrows show how data flows. A user clicks "search" → the request travels down through CloudFront → hits the Load Balancer → reaches the FastAPI backend.

**Step 3 — Identify the branches (data sources):** Notice how the FastAPI box has THREE arrows going down? That means the backend talks to three different data stores depending on what it needs:
- **Cache (ElastiCache/Redis):** "Have I seen this question before? Give me the cached answer."
- **Structured DB (Aurora PostgreSQL):** "What's the order status for customer #12345?" (exact lookups)
- **Vector DB (OpenSearch):** "Find wiki articles similar to 'printer paper jam'" (semantic search)

**Step 4 — Find the external services:** The arrow from ElastiCache to Bedrock shows that cached responses may route to the LLM. Bedrock is an external AI service — our code calls it via API, we don't host it ourselves.

### The Golden Rule of Reading Diagrams

> **Boxes = things that do work. Arrows = how those things talk to each other.**

Every box is something that either stores data, processes data, or displays data. Every arrow is a communication protocol (HTTP, WebSocket, SQL query, etc.).

---

## 1.4 The Three Core Architecture Patterns

Almost every system you'll encounter uses one or more of these patterns:

### Pattern 1: Client-Server (The Foundation)

```
[Client (Browser)] ───HTTP Request───► [Server (API)]
[Client (Browser)] ◄──HTTP Response── [Server (API)]
```

- **Client:** Initiates requests (your React app, a mobile app, `curl` in terminal)
- **Server:** Listens for requests and sends back responses (FastAPI, Express.js, Spring Boot)
- **This is the basis of everything.** If you understand request → response, you understand 50% of web architecture.

### Pattern 2: Microservices (Separation of Concerns)

```
[Auth Service] ──► [User DB]
[Order Service] ──► [Order DB]
[Search Service] ──► [Search Index]
      ▲                ▲
      └───[API Gateway]───┘
              ▲
         [Client]
```

Instead of one giant server doing everything (a "monolith"), each service owns one business domain. Our blueprint uses a **modular monolith** approach — one FastAPI service, but with clear internal separation between auth, search, and data pipelines.

### Pattern 3: Event-Driven (React to Changes)

```
[File Upload] ──► [S3 Bucket] ──triggers──► [Lambda Function] ──► [Database]
```

Something happens (a file is uploaded), and that event automatically triggers downstream work. Our blueprint uses this for the ETL pipeline: upload a spreadsheet → Lambda parses it → data lands in PostgreSQL.

---

## 1.5 Practical Mental Model: "Follow the Request"

When exploring any new system, trace ONE request end-to-end. Here's the exercise:

> *"A customer support agent types 'What is the status of order #8821?' and presses Enter. What happens?"*

Let's trace it through our architecture:

1. **React UI** captures the text, sends it as an HTTP POST to `/api/chat` with the agent's JWT token.
2. **CloudFront** receives the request. Since it's an API call (not a static file), it forwards to the **Application Load Balancer**.
3. **ALB** picks a healthy FastAPI container and forwards the request.
4. **FastAPI middleware** validates the JWT token against Cognito. It extracts `department: "General"`.
5. **FastAPI router** checks Redis: "Have I answered this exact question recently?" If yes → return cached response instantly (~40ms).
6. **Cache miss.** The AI orchestration layer sees "order #8821" and determines this is a **structured data query**. It generates a SQL tool call: `SELECT * FROM orders WHERE id = 8821`.
7. **Aurora PostgreSQL** executes the query in <20ms. Returns the order record.
8. **FastAPI** sends the order data + system prompt to **Bedrock (Claude 3.5 Haiku)**. Bedrock streams tokens back via SSE.
9. **React UI** renders each token as it arrives. The agent sees the answer appearing in real time.

Total time: ~1.2 seconds. This is the power of understanding architecture — you can pinpoint exactly where time is spent.

---

## 1.6 Key Vocabulary Cheat Sheet

| Term | Plain English |
|---|---|
| **Frontend / Client** | What the user sees (browser, mobile app) |
| **Backend / Server** | Code that runs on a remote machine, handles business logic |
| **API (Application Programming Interface)** | A contract: "Send me data in this format, I'll respond in that format" |
| **Load Balancer** | Traffic cop that distributes requests across multiple servers |
| **CDN (Content Delivery Network)** | Copies of your static files stored in data centers worldwide for fast delivery |
| **Cache** | A temporary, super-fast storage layer. "Remember this answer so I don't have to recompute it." |
| **Database** | Permanent storage for structured data (tables with rows and columns) |
| **Vector Database** | Storage for "meaning" — finds similar content by comparing mathematical embeddings |
| **Latency** | How long one operation takes (measured in milliseconds) |
| **Throughput** | How many operations you can handle at once (e.g., 1,000 requests/second) |
| **Microservice** | A small, independent service that does one thing well |
| **Monolith** | One big application that does everything |
| **JWT (JSON Web Token)** | A secure, self-contained token that proves who you are and what you can access |

---

## 1.7 Common Junior Mistakes (and How to Avoid Them)

| Mistake | Why It Happens | How to Fix It |
|---|---|---|
| **Not knowing which database to query** | You don't understand the data separation (structured vs. vector) | Always ask: "Is this exact data (SQL) or similar content (Vector)?" |
| **Ignoring the cache layer** | You go straight to the database for every query | Check: "Could this have been answered before? Check the cache first." |
| **Confusing sync vs. async** | You write blocking code that freezes the UI | Rule: Network calls = async. Database queries = async. UI updates = sync. |
| **Not tracing errors through the stack** | You see "500 Internal Server Error" and panic | Follow the request: Frontend → API → DB → LLM. Test each layer. |
| **Over-engineering as a junior** | You try to build a microservice for a 10-line feature | Start simple. A single well-organized file is better than 5 microservices you don't understand. |

---

## 1.8 Summary

- System architecture = blueprint of how software components connect and communicate.
- Read diagrams **top to bottom**, following the arrows (data flow).
- Every system can be understood by tracing **one request end-to-end**.
- Know the three patterns: Client-Server, Microservices, Event-Driven.
- **Your job as a junior is not to design the architecture — it's to understand it well enough to place your code in the right spot and debug effectively.**

👉 **Exercise:** [Exercise 1: Draw Your First Architecture Diagram](exercises/exercise-01-draw-architecture.md)

---

# 2. AWS Services

## What You'll Learn

- How cloud services map to Computer Science fundamentals you already know
- The AWS services used in our blueprint and what each one does
- How to think about "managed services" vs. "running it yourself"
- The mental model for choosing the right service

---

## 2.1 The Big Idea: Cloud = Leased Computers + Managed Software

You learned about operating systems, databases, and networks in university. The cloud doesn't replace those concepts — it **rents them to you by the second.**

| CS Concept You Know | Running It Yourself | AWS Equivalent |
|---|---|---|
| File System | `ext4` on a hard drive | **S3** (Simple Storage Service) |
| Database (SQL) | PostgreSQL installed on a Linux VM | **Aurora PostgreSQL** (managed PostgreSQL) |
| Key-Value Store / Hash Map | Redis installed on a server | **ElastiCache** (managed Redis) |
| Search Index | Elasticsearch on a cluster | **OpenSearch Serverless** |
| Running a Python Script | `python script.py` on your laptop | **Lambda** (serverless function) |
| Docker Container | `docker run myapp` | **ECS Fargate** (managed containers) |
| User Login System | Custom auth database + sessions | **Cognito** (managed auth) |
| Load Balancer | Nginx manually configured | **ALB** (Application Load Balancer) |
| CDN / Static File Server | Nginx serving files from disk | **CloudFront + S3** |
| AI Model | Download and run Llama locally | **Bedrock** (API to Claude & others) |

**Key insight:** You already know the *concepts*. AWS just gives you a URL, an API key, and a dashboard instead of a terminal with `apt-get install`.

---

## 2.2 Our Blueprint's AWS Services — Deep Dive

### S3 (Simple Storage Service) — "Infinite Cloud Hard Drive"

```
What it stores: .xlsx spreadsheets, product images, wiki export dumps
How we use it:   Drop zone for file uploads. Lambda picks files up automatically.
```

**Mental model:** S3 is like a global `Dictionary<string, File>`. You give it a key (file path) and it returns the file. No folder hierarchy — just flat key-value storage with `/` in key names to fake folders.

**Key facts:**
- 99.999999999% annual durability (designed for 11 nines of durability). Your data is copied across 3+ physical data centers automatically.
- You pay per GB stored + per request. No servers to manage.
- Files can be public (website assets) or private (customer spreadsheets).

### CloudFront — "Global CDN"

```
What it does:      Copies static files to 400+ edge locations worldwide
How we use it:     Serves the React app's HTML/CSS/JS to agents with near-zero latency
```

**Mental model:** Imagine you have a library book that 1,000 students need. Instead of all of them walking to the main library, you place copies in mini-libraries in every dorm. CloudFront is those mini-libraries — for your web app files.

**Key facts:**
- A user in Tokyo gets files from the Tokyo edge location, not from Virginia.
- Works hand-in-hand with S3. S3 stores the original; CloudFront caches copies globally.
- Also protects against DDoS attacks (AWS Shield integration).

### Cognito — "User Directory + OAuth Server"

```
What it does:      Handles sign-up, login, password reset, MFA, and issues JWT tokens
How we use it:     Agents log in → Cognito verifies credentials → returns a JWT with department info
```

**Mental model:** Cognito is the bouncer at a club. It checks your ID (username/password), stamps your hand (JWT token), and the stamp says which areas you can enter (department role). Every time you try to enter a restricted area, the bouncer checks your stamp.

**Key facts:**
- JWT tokens are **stateless** — the server doesn't need to check a session database. The token itself proves who you are.
- Tokens expire (configurable, typically 1 hour). After expiry, you need a refresh token or re-login.
- Cognito handles ALL the scary auth stuff: password hashing (bcrypt), brute-force protection, MFA via SMS/TOTP.

### ECS Fargate — "Docker Without the Headaches"

```
What it does:      Runs your Docker containers on AWS-managed servers
How we use it:     Hosts our FastAPI backend. Auto-scales from 2 → 50 containers based on traffic.
```

**Mental model:** ECS (Elastic Container Service) is a Docker daemon in the sky. You give it a Docker image, tell it "run 3 copies," and it figures out which physical servers to place them on. **Fargate** means "serverless containers" — AWS manages the underlying EC2 instances. You never SSH into a server.

**Key facts:**
- You define a **task definition** (like a `docker-compose.yml`): CPU, memory, Docker image, environment variables.
- A **service** maintains N copies of a task running at all times. If one crashes, ECS replaces it.
- **Auto-scaling:** When CPU > 70% across all tasks, spin up more. When CPU < 30%, spin down.
- ECS Fargate billing: per vCPU-hour and GB-hour. You pay only for what your containers use.

### Aurora PostgreSQL — "Managed Relational Database"

```
What it stores:    Customer records, orders, transactions (structured spreadsheet data)
How we use it:     Fast SQL queries. LLM calls SQL tool functions that hit Aurora.
```

**Mental model:** Aurora is PostgreSQL, but AWS handles backups, replication, failover, and patching. Your code connects to it with the exact same `psycopg2` or `asyncpg` library you'd use with local PostgreSQL.

**Key facts:**
- Aurora stores data across 3 Availability Zones (physically separate data centers) automatically.
- Up to 5x faster than standard PostgreSQL on the same hardware (AWS's custom storage layer).
- **Serverless v2** option: scales from 0.5 to 128 ACUs (Aurora Capacity Units) based on demand. Goes to zero when idle (saves money in dev).

### OpenSearch Serverless — "Search Engine + Vector Store"

```
What it stores:    Vector embeddings of product wiki pages
How we use it:     Semantic search: "find wiki pages similar to this user's question"
```

**Mental model:** Regular search matches keywords. OpenSearch with vectors matches **meaning**. If a user types "screen is flickering" and the wiki says "display exhibits intermittent artifacts," a keyword search would miss it. A vector search finds it because the mathematical embeddings are close.

**Key facts:**
- Uses **HNSW** (Hierarchical Navigable Small World) indexing — a graph algorithm for fast approximate nearest neighbor search.
- Embeddings are generated by a model (e.g., Amazon Titan Embeddings via Bedrock) and stored as float arrays (e.g., 1,536 dimensions).
- Serverless = no cluster management. Pay per OCU (OpenSearch Compute Unit).

### ElastiCache — "In-Memory Speed Layer (Redis)"

```
What it stores:    Agent sessions, frequent SQL query results, LLM response cache
How we use it:     Check Redis BEFORE hitting the database or LLM. Sub-millisecond lookups.
```

**Mental model:** Redis is a giant `HashMap<String, String>` that lives entirely in RAM. Reading from RAM is ~1,000x faster than reading from disk (database). The trade-off: RAM is expensive and data disappears if power is lost. Use it for **temporary, recomputable** data.

**Key facts:**
- Redis data structures: Strings, Hashes, Lists, Sets, Sorted Sets, Streams. Way more than just key-value.
- TTL (Time To Live): Every key can have an expiration. Cache an LLM response for 5 minutes → auto-deleted after that.
- Our caching strategy: Semantic cache (hash the user's question → check Redis → return cached LLM response if exists).

### Bedrock — "Serverless AI Model Gateway"

```
What it does:      API access to Claude, Titan, and other foundation models
How we use it:     Text generation (Claude 3.5 Haiku), vision/image analysis (Claude 3.5 Sonnet)
```

**Mental model:** Bedrock is like an API wrapper around multiple AI models. Instead of downloading model weights (hundreds of GB), managing GPU servers, and handling inference optimization, you just call `bedrock.invoke_model()`.

**Key facts:**
- **No infrastructure.** No GPUs to provision. Pay per input/output token.
- **Streaming:** Bedrock supports Server-Sent Events (SSE). Tokens arrive one by one — you render them immediately.
- **Model choice:** Haiku = fast + cheap (text). Sonnet = powerful + multimodal (text + images).
- **Private:** Your data doesn't leave your AWS account. Not used to train models.

---

## 2.3 Managed vs. Unmanaged — The Trade-Off Spectrum

```
More Control ◄──────────────────────────────────────────► Less Control
Less Managed                                                More Managed

EC2 (Your VM)    ECS (Your Containers)   Lambda (Your Code)    Bedrock (API Call)
    │                    │                      │                    │
    ▼                    ▼                      ▼                    ▼
You manage OS,     You manage Docker      You manage code      You manage prompt
patches, scaling   AWS manages servers    AWS manages everything  AWS manages model
```

**Rule of thumb for our project:** We lean toward managed/serverless wherever possible. Our team is 4 developers. We don't have time to manage servers, apply security patches, or tune PostgreSQL configs. Let AWS handle that.

---

## 2.4 How to Learn AWS as a Junior

### The "One Service Per Week" Approach

Don't try to learn all 200+ AWS services. Master these 8 from our blueprint first:

| Week | Service | Hands-On Task |
|---|---|---|
| 1 | S3 | Upload a file via console, make it public, access via URL |
| 2 | IAM | Create a user with S3-read-only permissions |
| 3 | Lambda | Write a function that triggers on S3 upload |
| 4 | DynamoDB | Create a table, insert/query items via Python |
| 5 | API Gateway | Create a REST endpoint that triggers Lambda |
| 6 | Cognito | Set up a user pool, get a JWT, decode it locally |
| 7 | ECS | Dockerize a simple Flask app, deploy to Fargate |
| 8 | Bedrock | Call Claude via `boto3`, stream a response |

### The Free Tier Is Your Playground

Almost every AWS service has a **free tier**. You can learn all 8 services above without spending a dollar if you stay within limits. Create a personal AWS account (not the company one) and experiment.

### The Console vs. CLI vs. IaC Progression

```
Phase 1: AWS Console (click around, learn visually)
    ↓
Phase 2: AWS CLI (`aws s3 ls`, `aws lambda invoke`)
    ↓
Phase 3: Infrastructure as Code (Terraform, CDK, CloudFormation)
```

You're expected to reach Phase 2 within your first month. Phase 3 (IaC) by month 3.

---

## 2.5 Key Vocabulary Cheat Sheet

| Term | Plain English |
|---|---|
| **Region** | A physical geographic area with multiple data centers (e.g., `us-east-1` = Northern Virginia) |
| **Availability Zone (AZ)** | One or more discrete data centers within a Region |
| **Serverless** | You don't see or manage servers. You provide code/config, AWS runs it. |
| **Managed Service** | AWS handles operations (backups, patching, scaling). You just use the service. |
| **IAM (Identity & Access Management)** | The permission system: who can do what to which resources |
| **ARN (Amazon Resource Name)** | A unique ID for every AWS resource: `arn:aws:s3:::my-bucket/file.txt` |
| **boto3** | The official Python SDK for AWS. Every AWS service has a boto3 client. |
| **IaC (Infrastructure as Code)** | Define your AWS resources in code files (Terraform `.tf`, CDK `.ts/.py`), not by clicking in the console |

---

## 2.6 Common Junior Mistakes

| Mistake | Why It Happens | How to Fix It |
|---|---|---|
| **Hardcoding AWS credentials** | You copy-paste access keys into `config.py` | Use IAM Roles (ECS task role, Lambda execution role). Never use long-term access keys in code. |
| **Not setting spending alerts** | "It's just a dev account, what could go wrong?" | Set a $10 budget alert on day 1. A forgotten GPU instance can cost $1,000/month. |
| **Using the wrong region** | You create resources in `us-east-1` but your team is in `eu-west-1` | Always check the region dropdown in the top-right corner of the console. |
| **Confusing DynamoDB with RDS** | You use a NoSQL key-value store for complex SQL joins | Rule: Need JOINs and transactions? → RDS/Aurora. Need simple lookups by ID? → DynamoDB. |
| **Deploying without IaC** | You click around the console to set up dev, then can't reproduce it for prod | Even as a junior, write a simple `terraform apply` or `cdk deploy` for your work. |

---

## 2.7 Summary

- Cloud services = CS fundamentals you already know, but managed and billed by usage.
- In our blueprint: S3 (files), CloudFront (CDN), Cognito (auth), ECS Fargate (containers), Aurora (SQL DB), OpenSearch (search+vectors), ElastiCache (Redis), Bedrock (AI models).
- Learn one service per week using the free tier.
- Progression: Console → CLI → Infrastructure as Code.
- **The cloud is not magic — it's just someone else's computer, with a very good API.**

👉 **Exercise:** [Exercise 2: Cloud Services Mapping](exercises/exercise-02-cloud-services-mapping.md)

---

# 3. Performance Strategy

## What You'll Learn

- What a "latency budget" is and how to read one
- Why caching is the #1 performance tool
- How streaming (SSE/WebSockets) changes user experience
- The difference between structured and unstructured data for AI performance

---

## 3.1 The Latency Budget — "Where Does the Time Go?"

Our blueprint sets a hard target: **< 1.5 seconds end-to-end** for 1,000 concurrent agents. A latency budget breaks that target into pieces and assigns a time limit to each piece:

```
Total Latency Target: < 1,500 ms
├─ Network round-trip + Load Balancer: ~50 ms    (3.3% of budget)
├─ JWT validation:                   ~10 ms     (0.7%)
├─ Cache lookup / SQL query:         ~40 ms     (2.7%)
├─ Context retrieval (RAG):          ~150 ms    (10%)
└─ LLM time-to-first-token:          ~800-1000 ms (53-67%)
─────────────────────────────────────────────────
                           Total:  ~1,050-1,250 ms
```

### How to Read a Latency Budget

1. **The biggest number dominates everything.** In our case, the LLM takes 53-67% of the total time. Optimizing JWT validation from 10ms to 5ms is pointless — it only saves 0.3% of the total. Optimize the LLM call, or you're wasting effort.

2. **Budgets force trade-off conversations.** "If the LLM takes 1000ms, we have 500ms left for everything else. Can we fit network + auth + cache + RAG in 500ms?" If not, you need a faster model or a different approach.

3. **Budgets are contracts between teams.** The frontend team knows they have ~1000ms before the first token arrives. They design the loading state accordingly. The backend team knows they can't spend more than 150ms on RAG retrieval.

### The Universal Formula

```
Total Response Time = Network + Processing + Waiting

Network:    Time for data to travel physically (fiber optic cables, routers)
Processing: Time your code spends computing (parsing, querying, transforming)
Waiting:    Time spent waiting for external services (database, LLM API, third-party)
```

Every performance problem falls into one of these three buckets. Your first diagnostic question should always be: **"Are we spending time on Network, Processing, or Waiting?"**

---

## 3.2 Caching — "Don't Compute It Twice"

### The Cache Hierarchy (Fastest → Slowest)

```
L1: In-Memory (Python dict, Redis local)        ~0.001 ms   (nanoseconds)
L2: Redis/ElastiCache (networked, in-RAM)       ~1 ms       (microseconds)
L3: Database (Aurora, disk-backed)              ~20 ms      (milliseconds)
L4: LLM API Call (Bedrock)                      ~1000 ms    (seconds)
```

Every time you move down a level, you pay a **1,000x performance penalty**. Your job: serve requests from the highest (fastest) possible level.

### Our Three-Layer Caching Strategy

**Layer 1 — Semantic Response Cache (Redis):**
```python
# Pseudocode: Before calling the LLM, check if we've answered this before
import hashlib

def get_answer(question: str, department: str):
    cache_key = hashlib.sha256(f"{department}:{question}".encode()).hexdigest()
    
    cached = redis.get(cache_key)
    if cached:
        return cached  # ~1ms response. LLM never called.
    
    answer = call_bedrock(question, department)  # ~1000ms
    redis.setex(cache_key, 300, answer)  # Cache for 5 minutes
    return answer
```

**Layer 2 — SQL Result Cache (Redis):**
```python
# Frequent queries like "top 10 products" don't need to hit Aurora every time
def get_top_products():
    cached = redis.get("top_products")
    if cached:
        return json.loads(cached)
    
    products = db.query("SELECT * FROM products ORDER BY sales DESC LIMIT 10")
    redis.setex("top_products", 60, json.dumps(products))  # Cache 1 minute
    return products
```

**Layer 3 — Session Cache (Redis):**
```python
# Store agent conversation history in Redis instead of the database
# Each agent has a session that expires after 30 minutes of inactivity
def get_session(agent_id: str):
    session = redis.get(f"session:{agent_id}")
    if session:
        return json.loads(session)
    return {"history": [], "created_at": time.time()}
```

### The Golden Rule of Caching

> **Cache data that is: (1) frequently accessed, (2) expensive to compute, and (3) doesn't change often.**

Cache invalidation is the hard part. "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

---

## 3.3 Streaming — "Don't Make Users Wait for the Whole Thing"

### The Problem with Traditional Requests

```
Traditional (Request → Wait → Full Response):
[Send request] ────────────────────────────────── [Receive full response]
                ⏳ User stares at spinner for 1.5s

Streaming (Request → Stream tokens → Build response):
[Send request] ── [token1] ── [token2] ── [token3] ── ... ── [Done]
                 👁️ User sees text appearing within 300ms
```

### How SSE (Server-Sent Events) Works

```python
# FastAPI streaming endpoint
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import asyncio

app = FastAPI()

async def token_generator(prompt: str):
    """Simulates streaming tokens from Bedrock"""
    response = bedrock.converse_stream(
        modelId="anthropic.claude-3-5-haiku-20241022-v1:0",
        messages=[{"role": "user", "content": [{"text": prompt}]}]
    )
    
    for event in response["stream"]:
        if "contentBlockDelta" in event:
            token = event["contentBlockDelta"]["delta"]["text"]
            yield f"data: {json.dumps({'token': token})}\n\n"
    
    yield "data: [DONE]\n\n"

@app.get("/api/chat/stream")
async def chat_stream(prompt: str):
    return StreamingResponse(
        token_generator(prompt),
        media_type="text/event-stream"
    )
```

**Frontend (React) consumption:**
```javascript
const response = await fetch('/api/chat/stream?prompt=hello');
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const text = decoder.decode(value);
    // Parse SSE format: "data: {...}\n\n"
    // Append token to chat UI
    setMessages(prev => [...prev, { token }]);
}
```

### Why Streaming Matters Psychologically

Research shows that users perceive a system as "fast" if they see **something** within 400ms — even if the full response takes 2 seconds. Streaming gives users that immediate feedback. A 1.5s streaming response feels faster than a 1.0s non-streaming response.

---

## 3.4 Structured vs. Unstructured Data — The Performance Fork

This is the single most important performance decision in our architecture:

### The Wrong Way (What NOT to Do)

```
❌ Embed EVERYTHING (spreadsheets + wiki) into vectors
❌ Every user question → vector search → find similar content → feed to LLM
❌ "What's order #8821 status?" → vector search through 50,000 spreadsheet rows → LLM guesses → WRONG
```

**Problem:** Vector search is ~150ms. SQL lookup is ~20ms. Using vectors for exact data is 7.5x slower AND less accurate.

### The Right Way (Our Approach)

```
User asks: "What's the status of order #8821?"
    │
    ▼
LLM classifies: "This is a STRUCTURED data query"
    │
    ▼
LLM generates SQL: SELECT status FROM orders WHERE id = 8821
    │
    ▼
Aurora PostgreSQL executes query: ~20ms
    │
    ▼
LLM formats result: "Order #8821 was shipped on July 28 and is in transit."

───────────────────────────────────────────────────

User asks: "How do I fix a paper jam on an HP LaserJet?"
    │
    ▼
LLM classifies: "This is an UNSTRUCTURED knowledge query"
    │
    ▼
Vector search in OpenSearch: ~150ms
    │
    ▼
Returns top 3 wiki articles about printer troubleshooting
    │
    ▼
LLM synthesizes answer from retrieved articles
```

### The Decision Tree

```
Incoming question
    │
    ├── Contains order ID, date, account number, dollar amount?
    │       └── YES → SQL Tool Call → Aurora PostgreSQL
    │
    ├── Contains "how to", "what is", "troubleshoot", product name?
    │       └── YES → Vector Search → OpenSearch → RAG
    │
    └── Contains image attachment?
            └── YES → Vision Model (Claude Sonnet) → Multimodal Pipeline
```

---

## 3.5 Load Testing — "Prove It Works Under Pressure"

### What Is Load Testing?

You simulate 1,000 users hitting your system simultaneously to verify it doesn't collapse. If your system handles 10 users fine but crashes at 100, you have a scalability problem.

### Load Testing with Locust (Python)

```python
# locustfile.py
from locust import HttpUser, task, between

class AgentUser(HttpUser):
    wait_time = between(1, 3)  # Wait 1-3 seconds between requests
    
    def on_start(self):
        """Login and get JWT token before starting"""
        response = self.client.post("/api/auth/login", json={
            "username": "agent_test@company.com",
            "password": "test_password_123"  # Demo only: use AWS Secrets Manager or env vars in production
        })
        self.token = response.json()["access_token"]
    
    @task(3)  # Weight: this task runs 3x more often
    def search_knowledge_base(self):
        self.client.post("/api/chat", 
            json={"message": "How do I reset a customer password?"},
            headers={"Authorization": f"Bearer {self.token}"}
        )
    
    @task(1)
    def check_order_status(self):
        self.client.post("/api/chat",
            json={"message": "What is the status of order #4521?"},
            headers={"Authorization": f"Bearer {self.token}"}
        )
```

Run it:
```bash
# Start Locust with 1,000 users, spawning 50 users/second
locust -f locustfile.py --host=https://api.staging.company.com --users 1000 --spawn-rate 50
```

### Key Metrics to Watch

| Metric | What It Means | Our Target |
|---|---|---|
| **P50 Latency** | 50% of requests are faster than this | < 800ms |
| **P95 Latency** | 95% of requests are faster than this | < 1,200ms |
| **P99 Latency** | 99% of requests are faster than this | < 1,500ms |
| **RPS (Requests Per Second)** | How many requests the system handles per second | > 200 |
| **Error Rate** | Percentage of requests that fail | < 0.1% |
| **Concurrent Users** | Number of simulated users hitting the system | 1,000 |

**P50 vs. P99 matters:** If your P50 is 500ms but P99 is 5,000ms, 1% of your users have a terrible experience. P99 is often the most important number.

---

## 3.6 Key Vocabulary Cheat Sheet

| Term | Plain English |
|---|---|
| **Latency** | How long one operation takes (time, not speed) |
| **Throughput** | How many operations per second (rate) |
| **P50/P95/P99** | "X% of requests are faster than this value" |
| **Cache Hit / Miss** | Hit = found in cache (fast). Miss = not in cache (slow, must compute). |
| **Cache Invalidation** | Deciding when cached data is stale and must be refreshed |
| **TTL (Time To Live)** | How long cached data lives before auto-deletion |
| **RAG (Retrieval-Augmented Generation)** | Look up relevant documents → feed them to LLM → better answer |
| **SSE (Server-Sent Events)** | Server pushes data to client as a stream (one-way) |
| **WebSocket** | Two-way persistent connection (chat, live collaboration) |
| **TTFT (Time To First Token)** | How long until the first word of the LLM response appears |

---

## 3.7 Common Junior Mistakes

| Mistake | Why It Happens | How to Fix It |
|---|---|---|
| **Premature optimization** | "I'll make this loop 0.1ms faster!" (on code that runs once per hour) | Profile first. Optimize the slowest 5% of code — it accounts for 95% of the time. |
| **Not measuring before optimizing** | You refactor code without benchmarks | Always measure (before and after): `time.perf_counter()`, Locust, CloudWatch. |
| **Caching everything** | "Redis is fast, let's cache ALL the things!" | Cache what's expensive + frequent + stable. Caching volatile data = serving stale answers. |
| **Ignoring cold starts** | Your code is fast after warmup, but the first request takes 3 seconds | Lambda cold starts, DB connection pools, model loading. Test the first request, not just the 100th. |
| **Not setting TTLs** | Cache grows infinitely until Redis runs out of memory | Every `redis.set()` needs a `redis.setex()` (with expiry). Default: 5 minutes for LLM responses, 1 minute for SQL results. |

---

## 3.8 Summary

- **Latency budget** = break the time target into pieces and hold each piece accountable.
- **Caching** is the #1 performance tool. Check Redis before your database. Check Redis before the LLM.
- **Streaming** (SSE) makes 1.5s feel like 300ms. Users care about time-to-first-byte, not time-to-complete.
- **Structured data → SQL. Unstructured data → Vector search.** Never embed spreadsheet rows.
- **Load test** before you launch. If you haven't tested 1,000 concurrent users, you don't know if your system works.

👉 **Exercise:** [Exercise 3: Measure and Optimize Latency](exercises/exercise-03-latency-budget.md)

---

# 4. Authentication & RBAC

## What You'll Learn

- Authentication vs. Authorization (they're different!)
- How JWT tokens work (and why they're everywhere)
- Role-Based Access Control (RBAC) — the standard permission model
- How our blueprint enforces department-level access

---

## 4.1 Authentication vs. Authorization — The Two "Auth"s

These are the most commonly confused terms in software engineering. Let's settle it forever:

| | Authentication (AuthN) | Authorization (AuthZ) |
|---|---|---|
| **Question it answers** | "Who are you?" | "What are you allowed to do?" |
| **Real-world analogy** | Showing your driver's license at a bar | The bartender checking if you're over 21 |
| **How it works** | Username/password, MFA, biometrics | Roles, permissions, access control lists |
| **When it happens** | At login | On every single request |
| **Failure response** | 401 Unauthorized (you didn't prove who you are) | 403 Forbidden (you proved who you are, but you can't do that) |

**Memory trick:** Authentication = **Identity**. Authorization = **Permissions**. They happen in that order. You can't check permissions until you know who someone is.

---

## 4.2 JWT (JSON Web Token) — The Passport of the Internet

### What Is a JWT?

A JWT is a **self-contained, cryptographically signed** piece of data that proves:
1. Who you are (the `sub` claim — subject)
2. What you can access (custom claims like `department`)
3. When the token expires (the `exp` claim)
4. That it hasn't been tampered with (the signature)

### The Structure of a JWT

A JWT looks like this:
```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZ2VudDQyIiwicm9sZSI6IkZpbmFuY2UiLCJleHAiOjE3MjI1MDAwMDB9.abc123def456
```

It's three Base64-encoded strings joined by dots:

```
HEADER.PAYLOAD.SIGNATURE
```

**Header** (algorithm info):
```json
{
  "alg": "RS256",
  "kid": "abc123"
}
```

**Payload** (the actual data — called "claims"):
```json
{
  "sub": "agent42@computerstore.com",       // Subject (who)
  "custom:department": "Finance",            // Custom claim (our department)
  "custom:allowed_tools": ["process_refund", "verify_bank_transaction"],
  "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_abc123",  // Issuer
  "exp": 1722500000,                         // Expiration (Unix timestamp)
  "iat": 1722496400                          // Issued at
}
```

**Signature** (cryptographic proof):
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret_key
)
```

### Why JWT Is Stateless (And Why That's Brilliant)

**Old way (Session Tokens):**
```
1. User logs in → Server creates a session → Stores session in database
2. Every request → Server looks up session in database → Checks if valid
3. Problem: Database is a bottleneck. 1,000 users × every request = massive DB load.
```

**JWT way (Stateless):**
```
1. User logs in → Server creates JWT → Returns it to client
2. Every request → Client sends JWT → Server verifies SIGNATURE (no DB lookup!)
3. Advantage: Server just checks the math. No database needed. Scales infinitely.
```

The trade-off: You can't "revoke" a JWT before it expires. Once issued, it's valid until `exp`. For our use case (1-hour agent sessions), this is acceptable. For banking apps, you'd add a token blacklist in Redis.

### How to Decode a JWT (NEVER Trust the Payload Without Verifying!)

```python
# ❌ WRONG — Never decode without verification!
import base64, json
payload = json.loads(base64.b64decode(token.split('.')[1] + '=='))
# Attacker could modify the payload and you'd never know!

# ✅ CORRECT — Always verify the signature
import jwt
from jwt.algorithms import RSAAlgorithm
import requests

# Fetch Cognito's public keys (JWKS — JSON Web Key Set)
jwks_url = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_abc123/.well-known/jwks.json"
jwks = requests.get(jwks_url).json()

# Decode and verify
decoded = jwt.decode(
    token,
    key=jwks,  # The public key proves AWS Cognito signed this
    algorithms=["RS256"],
    options={"verify_exp": True}  # Check expiration
)

print(decoded["custom:department"])  # "Finance"
```

---

## 4.3 RBAC (Role-Based Access Control) — The Standard Model

### The Three Concepts

```
User ──has──► Role ──has──► Permissions

Agent Sarah ──► Finance ──► [process_refund, verify_bank_transaction, view_product_info]
Agent Mike  ──► Logistics ─► [track_shipment, report_shipping_damage, view_product_info]
Agent Priya ──► General ───► [view_product_info, troubleshoot_hardware, update_account]
```

- **User:** The actual person (agent Sarah)
- **Role:** A named collection of permissions (Finance)
- **Permission:** A specific action that can be performed (process_refund)

**The key insight:** You NEVER assign permissions directly to users. You assign roles to users, and permissions to roles. This scales: 1,000 agents × 3 roles = 3 role definitions, not 1,000 individual permission sets.

### Our Department Access Control Matrix

```
                          ┌───────────────────────────┐
                          │    Agent Authenticated    │
                          │   (Cognito JWT Scope)     │
                          └─────────────┬─────────────┘
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             ▼                          ▼                          ▼
     [ Dept: General ]          [ Dept: Finance ]          [ Dept: Logistics ]
   - Account Details          - Account Details          - Account Details
   - Product Wiki             - Product Wiki             - Product Wiki
   - Tech Troubleshooting     - Tech Troubleshooting     - Tech Troubleshooting
   - basic_info_tool          - refund_process_tool      - shipment_tracking_tool
```

Every agent can do the **common tasks** (view products, troubleshoot). Each department adds **specialized tools** that other departments cannot access.

### How the Backend Enforces This

```python
# app/core/security.py
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

security = HTTPBearer()

# Define what each department can do
DEPARTMENT_PERMISSIONS = {
    "General":   ["view_product_info", "troubleshoot_hardware", "update_account"],
    "Finance":   ["view_product_info", "troubleshoot_hardware", "process_refund", "verify_bank_transaction"],
    "Logistics": ["view_product_info", "troubleshoot_hardware", "track_shipment", "report_shipping_damage"]
}

def get_current_agent(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Extract and validate agent identity from JWT"""
    token = credentials.credentials
    try:
        payload = decode_cognito_jwt(token)
        department = payload.get("custom:department")
        
        if department not in DEPARTMENT_PERMISSIONS:
            raise HTTPException(status_code=403, detail=f"Unknown department: {department}")
        
        return {
            "agent_id": payload["sub"],
            "department": department,
            "allowed_tools": DEPARTMENT_PERMISSIONS[department]
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired. Please log in again.")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid session credentials")

# Usage in a route
@app.post("/api/tools/process_refund")
async def process_refund(
    refund_data: RefundRequest,
    agent: dict = Depends(get_current_agent)
):
    if "process_refund" not in agent["allowed_tools"]:
        raise HTTPException(
            status_code=403,
            detail=f"Department '{agent['department']}' cannot process refunds. Transfer to Finance."
        )
    # ... process the refund
```

---

## 4.4 AI Department Routing — The Prompt-Level Guardrail

Even with backend RBAC, the AI itself needs rules. Without them, a General agent could ask the AI "how do I process a refund?" and the AI might hallucinate an answer.

### The System Prompt as a Security Control

```python
SYSTEM_ROUTER_PROMPT = """
You are an AI Agentic Assistant for a Computer Store specializing in laptops, printers, and accessories.
Agent Assigned Department: {agent_department}
Allowed Capabilities: {allowed_tools}

RULES:
1. You may ONLY assist directly if the user query falls under your allowed capabilities.
2. If the customer query requires actions outside your department scope (e.g. Finance or Logistics), 
   DO NOT execute or hallucinate an answer.
3. Immediately issue a structured routing alert:
   "ROUTING REQUIRED: This query involves [Finance/Logistics/General]. 
    Please transfer this ticket to the [Department] department."
"""
```

### How the Router Works at Runtime

```
Agent (General Dept) asks: "Issue a refund for order #5521"
    │
    ▼
AI checks: allowed_tools = [view_product_info, troubleshoot_hardware, update_account]
    │
    ▼
"process_refund" is NOT in allowed_tools
    │
    ▼
AI response: "ROUTING REQUIRED: This query involves Finance. 
              Please transfer this ticket to the Finance department."
    │
    ▼
Frontend: Shows a "Transfer to Finance" button
    │
    ▼
Finance agent receives ticket → has "process_refund" permission → handles refund
```

This is **defense in depth**: the backend blocks unauthorized API calls, AND the AI prompt prevents the model from even attempting to help with out-of-scope requests.

---

## 4.5 Security Best Practices (What You Must Never Do)

### The "Never Do This" List

| ❌ Never | ✅ Always |
|---|---|
| Store JWT in `localStorage` (vulnerable to XSS) | Store JWT in an `httpOnly` cookie or secure memory |
| Hardcode secrets in source code | Use environment variables or AWS Secrets Manager |
| Log JWT tokens or passwords | Mask sensitive fields in logs: `token[:10] + "..."` |
| Skip signature verification "for testing" | Verify signatures even in dev. Use a dev-only secret key. |
| Use `HS256` (symmetric) for distributed systems | Use `RS256` (asymmetric). Private key signs, public key verifies. |
| Trust the JWT payload without verifying `exp` | Always check `exp`, `iss` (issuer), and `aud` (audience) |
| Return detailed errors to the client | Return generic "Invalid credentials" — don't reveal if the username or password was wrong |

### The Minimum Security Checklist for Every PR

Before you merge any code that touches auth, verify:
- [ ] JWT signature is verified on every request
- [ ] Expired tokens are rejected
- [ ] RBAC check happens BEFORE any business logic
- [ ] Department/permission checks are server-side (never client-side only)
- [ ] No secrets in code, logs, or error messages
- [ ] HTTPS is enforced (no HTTP in production)

---

## 4.6 Key Vocabulary Cheat Sheet

| Term | Plain English |
|---|---|
| **Authentication (AuthN)** | Proving who you are |
| **Authorization (AuthZ)** | Checking what you're allowed to do |
| **JWT** | A signed JSON blob that proves identity without a database lookup |
| **Claim** | A key-value pair inside a JWT (e.g., `"department": "Finance"`) |
| **Signature** | Cryptographic proof that the JWT wasn't tampered with |
| **JWKS (JSON Web Key Set)** | Public keys used to verify JWT signatures |
| **RBAC** | Assign permissions to roles, assign roles to users |
| **Middleware** | Code that runs on every request BEFORE your route handler (perfect for auth) |
| **Bearer Token** | A token sent in the `Authorization: Bearer <token>` HTTP header |
| **401 vs. 403** | 401 = "I don't know who you are." 403 = "I know who you are, but no." |
| **Defense in Depth** | Multiple layers of security. If one fails, the next catches it. |

---

## 4.7 Common Junior Mistakes

| Mistake | Why It Happens | How to Fix It |
|---|---|---|
| **Auth on the client only** | "I'll just hide the refund button for General agents." | Client-side checks are UI convenience, NOT security. Anyone can open DevTools. Always enforce server-side. |
| **Confusing 401 and 403** | You return 401 when the user lacks permission | 401 = authentication problem (no token, expired token). 403 = authorization problem (wrong department). |
| **Storing plain-text passwords** | "It's just a prototype." | Never. Not even in dev. Use `bcrypt` with cost factor 12+. Better yet, use Cognito and never touch passwords. |
| **Not setting token expiry** | You create tokens that last forever | Always set `exp`. Our standard: 1 hour for access tokens, 24 hours for refresh tokens. |
| **Checking permissions after processing** | You do the work, THEN check if the user was allowed | Check FIRST. If unauthorized, fail fast before any database writes or LLM calls. |

---

## 4.8 Summary

- Authentication = "Who are you?" Authorization = "What can you do?"
- JWT is a self-contained, signed token. No database lookup needed — verify the signature.
- RBAC: Users → Roles → Permissions. Never assign permissions directly to users.
- Our blueprint: 3 departments (General, Finance, Logistics) × specific tool sets.
- Defense in depth: Backend middleware blocks API calls. AI system prompt prevents hallucinated answers.
- **Security is not a feature. It's a property of every feature.**

👉 **Exercise:** [Exercise 4: Build a JWT + RBAC System](exercises/exercise-04-jwt-rbac.md)

---

# 5. Multimodal Vision Pipeline

## What You'll Learn

- What "multimodal" means in AI
- How vision-language models (VLMs) work at a conceptual level
- The image pipeline: from customer photo to AI diagnosis
- Best practices for handling images in web apps

---

## 5.1 What Does "Multimodal" Mean?

**Multimodal AI** = models that can process more than one type of input simultaneously.

| Modality | Examples | Traditional Approach | Multimodal Approach |
|---|---|---|---|
| **Text** | Chat messages, documents, code | Text-only models (GPT-2, BERT) | Same model handles text + images |
| **Image** | Photos, screenshots, diagrams | Separate vision model (ResNet, YOLO) | Same model "sees" the image and "reads" the text |
| **Audio** | Voice messages, call recordings | Separate speech-to-text (Whisper) | Single model transcribes + understands |
| **Video** | Screen recordings, security footage | Frame extraction + image model | Model processes temporal sequence |

**In our blueprint:** Claude 3.5 Sonnet is the multimodal model. It takes text + images as input and produces text as output. A support agent uploads a photo of a broken laptop screen → Claude sees the damage → Claude describes the problem and suggests fixes.

### The Simple Mental Model

```
Text-only LLM:    "Read this book and answer questions about it."
Vision LLM:       "Look at this photo AND read this caption. What's happening?"
Multimodal LLM:   "Watch this video, listen to the audio, AND read the transcript. Summarize."
```

It's the same underlying technology (transformer architecture) — but trained on images paired with text descriptions.

---

## 5.2 How Vision-Language Models Work (Simplified)

You don't need to understand the math, but you should understand the pipeline:

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Customer   │     │  Image Encoding  │     │  LLM Processing │     │  Text Output │
│  Photo      │ ──► │  (Vision Encoder)│ ──► │  (Transformer)  │ ──► │  Diagnosis   │
│  (JPEG)     │     │  → Token IDs     │     │  + Text Prompt  │     │  + Steps     │
└─────────────┘     └──────────────────┘     └─────────────────┘     └──────────────┘
```

**Step 1 — Image Encoding:** The image is split into patches (like words in a sentence). Each patch is converted into a vector embedding (a list of numbers). These embeddings are fed into the transformer as "image tokens."

**Step 2 — Combined Processing:** The transformer processes image tokens AND text tokens together in the same sequence. It learns relationships between visual features and textual concepts.

**Step 3 — Text Generation:** The model generates text tokens one by one, just like a text-only LLM — but now it can "refer to" things it saw in the image.

### What This Means for You (The Developer)

You don't need to:
- ❌ Train a vision model
- ❌ Run image preprocessing pipelines
- ❌ Manage GPU memory for inference
- ❌ Understand convolutional neural networks

You DO need to:
- ✅ Send images in the right format (base64 or S3 URL)
- ✅ Compress images before sending (network bandwidth matters)
- ✅ Write good text prompts that reference the image
- ✅ Handle the structured diagnostic output

---

## 5.3 Our Image Pipeline — End to End

### The Full Flow

```
Customer sends photo of broken laptop screen to support agent
    │
    ▼
[Step 1] React frontend: Agent drags image into chat window
    │
    ├── Client-side compression: Resize to max 1024px, compress to <500KB JPEG
    │
    ▼
[Step 2] React: Convert to base64 string (for direct send) 
    │      OR upload to S3 presigned URL (for large/batch images)
    │
    ▼
[Step 3] FastAPI: Receive image + text prompt
    │      "Customer says: Screen is cracked and shows lines. What should I do?"
    │
    ▼
[Step 4] FastAPI: Call Bedrock with Claude 3.5 Sonnet
    │      Messages = [
    │        {"role": "user", "content": [
    │          {"type": "image", "source": {"bytes": base64_image}},
    │          {"type": "text", "text": "Diagnose this laptop screen issue..."}
    │        ]}
    │      ]
    │
    ▼
[Step 5] Claude Sonnet: Vision analysis
    │      "I can see a cracked LCD panel with horizontal lines across the display.
    │       The damage appears to be physical impact damage, not a GPU failure..."
    │
    ▼
[Step 6] FastAPI: Parse structured output
    │      identified_hardware, visual_evidence, action_plan
    │
    ▼
[Step 7] React: Display diagnosis with expandable sections
```

### Step-by-Step Code

**Step 1 & 2 — Frontend Image Handling (React):**

```typescript
// components/ImageUpload.tsx
import { useState, useCallback } from 'react';

const MAX_WIDTH = 1024;
const MAX_FILE_SIZE_KB = 500;

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }
        
        // Draw resized image to canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to compressed JPEG base64
        const base64 = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
        resolve(base64.split(',')[1]); // Remove "data:image/jpeg;base64," prefix
      };
      img.src = e.target?.result as string;  // Demo code: use proper TypeScript types in production
    };
    reader.readAsDataURL(file);
  });
}

export function ImageUpload({ onImageReady }: { onImageReady: (b64: string) => void }) {
  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size before compression
    if (file.size > 10 * 1024 * 1024) { // 10MB raw limit
      alert('Image too large. Please use a photo under 10MB.');
      return;
    }
    
    const compressed = await compressImage(file);
    onImageReady(compressed);
  }, [onImageReady]);
  
  return (
    <input 
      type="file" 
      accept="image/jpeg,image/png,image/webp" 
      onChange={handleFile}
    />
  );
}
```

**Step 4 & 5 — Backend Bedrock Call (FastAPI):**

```python
# app/services/vision.py
import boto3
import json

bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')

VISION_SYSTEM_PROMPT = """
You are a hardware diagnostic assistant for a computer store. 
When you receive an image of a device, provide a structured diagnosis:

1. IDENTIFIED HARDWARE: What device/model do you see?
2. VISUAL EVIDENCE: What specific damage or error indicators are visible?
3. ACTION PLAN: Step-by-step troubleshooting for the support agent to follow.
4. SEVERITY: [Low / Medium / High / Critical]
"""

async def diagnose_image(image_base64: str, user_description: str) -> dict:
    """Send an image to Claude Sonnet for vision-based hardware diagnosis."""
    
    response = bedrock.converse(
        modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
        system=[{"text": VISION_SYSTEM_PROMPT}],
        messages=[{
            "role": "user",
            "content": [
                {
                    "image": {
                        "format": "jpeg",
                        "source": {"bytes": image_base64}
                    }
                },
                {
                    "text": f"Customer description: {user_description}\n\nPlease diagnose this issue."
                }
            ]
        }]
    )
    
    diagnosis_text = response["output"]["message"]["content"][0]["text"]
    
    return {
        "raw_diagnosis": diagnosis_text,
        "model": "claude-3.5-sonnet",
        "tokens_used": response["usage"]["inputTokens"] + response["usage"]["outputTokens"]
    }
```

**FastAPI Route:**

```python
# app/routes/vision.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from app.core.security import get_current_agent
from app.services.vision import diagnose_image

router = APIRouter(prefix="/api/vision", tags=["vision"])

class VisionRequest(BaseModel):
    image_base64: str = Field(..., description="Base64-encoded JPEG/PNG image")
    user_description: str = Field(..., description="Customer's description of the issue")
    max_tokens: int = Field(default=1024, le=4096)

@router.post("/diagnose")
async def diagnose(
    request: VisionRequest,
    agent: dict = Depends(get_current_agent)
):
    # Size check: base64 is ~33% larger than binary
    if len(request.image_base64) > 700_000:  # ~500KB binary equivalent
        raise HTTPException(status_code=413, detail="Image too large. Max 500KB after compression.")
    
    result = await diagnose_image(request.image_base64, request.user_description)
    return result
```

---

## 5.4 Image Handling Best Practices

### Compression Guidelines

| Use Case | Max Resolution | Max File Size | Format |
|---|---|---|---|
| Chat image upload | 1024px longest edge | 500KB | JPEG (quality 70%) |
| Document/screenshot | 2048px longest edge | 2MB | PNG or JPEG |
| Thumbnail preview | 256px | 50KB | JPEG (quality 60%) |
| Archival/original | No limit | No limit | Original format → S3 |

### When to Use base64 vs. S3 Presigned URLs

```
base64 (inline):
  ✅ Simpler — one request, no upload step
  ✅ Good for images < 500KB
  ❌ ~33% size overhead
  ❌ Slower for large images (blocking request)

S3 Presigned URL:
  ✅ No size limit within reason
  ✅ Async upload (non-blocking)
  ✅ Better for batch processing
  ❌ Two-step: upload to S3, then send URL to API
  ❌ S3 costs (negligible but non-zero)
```

**Our rule:** Use base64 for chat images (< 500KB). Use S3 presigned URLs for batch uploads, reports, and archival.

### The Vision Prompt Template

A good vision prompt has four parts:

```python
VISION_PROMPT_TEMPLATE = """
[ROLE] You are a {role_description}.

[IMAGE CONTEXT] The attached image shows {what_image_contains}.

[TASK] {specific_task}.

[OUTPUT FORMAT] Respond in the following structure:
- Identified Hardware:
- Visual Evidence:
- Action Plan:
- Severity:
"""
```

Example filled in:
```
[ROLE] You are a hardware diagnostic assistant for a computer store.

[IMAGE CONTEXT] The attached image shows a customer's laptop screen.

[TASK] Diagnose the visible issue and provide a step-by-step action plan 
for the support agent to follow. Consider both hardware and software causes.

[OUTPUT FORMAT] Respond in the following structure:
- Identified Hardware:
- Visual Evidence:
- Action Plan:
- Severity:
```

---

## 5.5 Common Issues and How to Debug Them

### "The model didn't see the detail I expected."

**Cause:** Image resolution too low or compression too aggressive.
**Fix:** Increase max resolution to 2048px for detailed diagnostics. Claude Sonnet supports up to 8,000px images.

### "The model hallucinated a problem that isn't there."

**Cause:** The prompt is too leading. "Is this a cracked screen?" assumes a crack.
**Fix:** Use neutral prompts. "Describe what you see in this image. Note any damage or anomalies."

### "The API call takes too long (> 3 seconds)."

**Cause:** Large image + complex analysis.
**Fix:** 
1. Compress more aggressively for initial triage.
2. Use Claude Haiku for simple "is this damaged? yes/no" questions.
3. Only use Sonnet for detailed diagnosis.

### "The model identified the wrong hardware model."

**Cause:** Low-resolution image or obscure angle.
**Fix:** Ask the customer for the model number. Provide it as text alongside the image. Multimodal models use BOTH — give them all the information.

---

## 5.6 Key Vocabulary Cheat Sheet

| Term | Plain English |
|---|---|
| **Multimodal** | AI that processes multiple input types (text + image + audio) |
| **Vision Encoder** | Converts image pixels into number arrays the LLM can understand |
| **Image Token** | A patch of an image, converted to numbers — like a "word" for vision |
| **base64** | Binary data (like an image) encoded as text so it can travel in JSON |
| **Presigned URL** | A temporary S3 URL that allows upload/download without AWS credentials |
| **JPEG vs. PNG** | JPEG = photos (lossy, small). PNG = screenshots/diagrams (lossless, larger). |
| **Hallucination** | The model confidently says something that isn't true |

---

## 5.7 Common Junior Mistakes

| Mistake | Why It Happens | How to Fix It |
|---|---|---|
| **Sending raw 12MP photos** | You grab the file directly from the camera roll | Always compress client-side. A 12MP photo is 4,000×3,000 pixels — the model needs maybe 1,024×768. |
| **base64 without the format prefix** | You forget `data:image/jpeg;base64,` | Bedrock wants raw base64 bytes (no prefix). But some APIs want the data URI. Read the docs. |
| **Not specifying image format** | You assume the model auto-detects | Always specify `format: "jpeg"` or `format: "png"` in the Bedrock request. |
| **Prompt doesn't reference the image** | You ask "How do I fix a laptop?" without saying "Look at the attached image" | Explicitly reference the image: "The attached image shows..." or "In this photo..." |
| **No fallback for vision failures** | The entire request fails if the image is corrupted | Wrap vision calls in try/except. On failure, fall back to text-only: "I couldn't analyze the image. Please describe the issue." |

---

## 5.8 Summary

- Multimodal = same model handles text + images together.
- Vision pipeline: compress → encode (base64) → send to Bedrock → Claude "sees" the image → structured diagnosis.
- Always compress images client-side. 12MP → 1024px. 5MB → 500KB.
- Good vision prompts: ROLE + IMAGE CONTEXT + TASK + OUTPUT FORMAT.
- Use Haiku for quick triage ("damaged or not?"). Use Sonnet for detailed diagnosis.
- **The model is a tool, not magic. Give it good images and good prompts, and it will give you good answers.**

👉 **Exercise:** [Exercise 5: Call a Vision Model API](exercises/exercise-05-vision-api.md)

---

# 6. Execution Roadmap

## What You'll Learn

- How a 6-month project plan is structured
- What each phase means and what YOU do in it
- How to work in a 2-person sub-team
- What "done" looks like at each milestone

---

## 6.1 The Big Picture — Why Roadmaps Exist

A roadmap is NOT a rigid schedule. It's a **shared understanding of priorities**. Here's what it does for you as a junior:

1. **Tells you what to work on next.** You never wonder "what should I do today?" — look at the current phase.
2. **Shows dependencies.** "I can't build the chat UI until the API endpoint exists." The roadmap makes this visible.
3. **Sets expectations.** Your tech lead knows you'll take 2 weeks on the auth UI, not 2 days.
4. **Protects you from scope creep.** When a stakeholder says "Can we also add video calls?", the answer is "That's not in the current roadmap phase."

---

## 6.2 Our 6-Month Roadmap — Phase by Phase

```
       Month 1          Month 2          Month 3          Month 4          Month 5          Month 6
  ┌────────────────┬────────────────┬────────────────┬────────────────┬────────────────┬────────────────┐
  │ Phase 1: Setup │ Phase 2: Ingest│ Phase 3: RAG   │ Phase 4: UI    │ Phase 5: Perf  │ Phase 6: Launch│
  │ Infra & Auth   │ Data & APIs    │ & Vision Engine│ & Workflows    │ & Optimization │ & Hardening    │
  └────────────────┴────────────────┴────────────────┴────────────────┴────────────────┴────────────────┘
```

### Phase 1: Foundation & Auth Setup (Month 1)

**Goal:** A running (empty) system with secure login.

**What it means in plain English:**
You're building the skeleton. Nothing is "smart" yet — no AI, no data, no fancy UI. But a user can open a browser, see a login page, enter credentials, and get redirected to an empty dashboard. Behind the scenes, the cloud infrastructure exists (databases, containers, networking) and is ready for code.

**Team Alpha (Frontend + Auth):**
- Create a new React project using Vite + Tailwind CSS + Zustand (state management)
- Build the login page (email/password fields, "Sign In" button, error states)
- Integrate with AWS Cognito via `aws-amplify` or direct API calls
- Store JWT securely, attach to all subsequent API requests
- Set up CloudFront + S3 hosting for the static React build

**Team Beta (Backend + Infra):**
- Write Terraform/CDK scripts for: Cognito User Pool, Aurora PostgreSQL cluster, ElastiCache, ECS Fargate cluster, ALB
- Create a minimal FastAPI app with one endpoint: `GET /api/health` (returns `{"status": "ok"}`)
- Dockerize the FastAPI app
- Deploy to ECS Fargate manually (first time) to validate the infrastructure
- Set up CI/CD pipeline (GitHub Actions → build Docker image → push to ECR → deploy to ECS)

**Deliverable:** Login page that works. `GET /api/health` returns 200. Infrastructure exists as code.

**Your job as a junior:**
- If on Team Alpha: Build the login page. Learn React hooks (`useState`, `useEffect`), form validation, and JWT storage patterns.
- If on Team Beta: Write one Terraform resource (start with the S3 bucket for frontend hosting). Learn `docker build`, `docker run`, and `docker push`.

---

### Phase 2: Data Engineering & Parsing Pipeline (Month 2)

**Goal:** Data flows into the system automatically. Upload a spreadsheet → it appears in the database.

**What it means in plain English:**
The system now has "muscles." Real customer data, product catalogs, and wiki articles are loaded into databases. The AI can't answer questions yet, but the data is ready. This is the most backend-heavy phase.

**Team Alpha (Frontend + Auth):**
- Build an admin dashboard page: a simple table showing "Recent Uploads"
- Build a file upload UI (drag-and-drop .xlsx upload with progress bar)
- Display upload status: "Parsing...", "Done — 1,243 rows imported", "Error: invalid format"

**Team Beta (Backend + Infra):**
- Write Lambda functions (Python) triggered by S3 upload events
- Parse .xlsx files using `openpyxl`: extract rows, validate columns, insert into Aurora PostgreSQL
- Parse wiki Markdown files: chunk into sections, generate embeddings, store in OpenSearch
- Create API endpoints: `POST /api/upload/spreadsheet`, `GET /api/data/customers`
- Write the SQL schema: `customers`, `orders`, `products`, `transactions` tables

**Deliverable:** Upload a customer spreadsheet → Lambda parses it → data appears in Aurora. Queryable via API.

**Your job as a junior:**
- If on Team Alpha: Build the file upload component. Learn `FormData`, `axios`/`fetch` with progress events, and optimistic UI updates.
- If on Team Beta: Write the `openpyxl` parsing Lambda. Learn S3 event triggers, Lambda permissions (IAM roles), and PostgreSQL `INSERT` statements.

---

### Phase 3: Core AI Engine & Multimodal RAG (Month 3)

**Goal:** The system is "smart." Ask a question → get an AI-powered answer.

**What it means in plain English:**
This is the heart of the product. The FastAPI backend now calls Bedrock (Claude), retrieves relevant wiki articles from OpenSearch (RAG), queries Aurora for structured data (SQL tool calling), and streams responses back. The frontend has a working chat interface.

**Team Alpha (Frontend + Auth):**
- Build the chat window: message bubbles (user/AI), typing indicator, scroll-to-bottom
- Implement SSE streaming: read the event stream, append tokens to the AI message in real time
- Add drag-and-drop image upload to the chat (for the vision pipeline)
- Build the "department badge" UI: shows General/Finance/Logistics in the header

**Team Beta (Backend + Infra):**
- Integrate Bedrock SDK (`boto3.client('bedrock-runtime')`) with Claude 3.5 Haiku
- Define tool definitions for the LLM: `check_order_status`, `lookup_customer`, `search_wiki`
- Implement RAG: embed user question → search OpenSearch → retrieve top 3 articles → inject into prompt
- Implement SSE streaming from Bedrock to the client
- Build vision endpoint: accept base64 image → call Claude Sonnet → return diagnosis

**Deliverable:** Working chat that answers product questions (RAG), checks order status (SQL tool calling), and diagnoses hardware from images (vision).

**Your job as a junior:**
- If on Team Alpha: Build the chat UI with streaming. Learn `EventSource`, `ReadableStream`, and React state management for real-time updates.
- If on Team Beta: Write the RAG pipeline. Learn embeddings (what they are), vector search (HNSW), and prompt engineering (how to inject context into a prompt).

---

### Phase 4: Department Guardrails & Routing Workflows (Month 4)

**Goal:** The system enforces who can do what. General agents can't process refunds.

**What it means in plain English:**
The AI is smart, but now it's also secure. The system prompt prevents the AI from answering out-of-scope questions. The backend blocks unauthorized API calls. The frontend shows visual indicators of department boundaries and "transfer to Finance" buttons.

**Team Alpha (Frontend + Auth):**
- Build department-specific UI: Finance agents see "Process Refund" buttons; General agents don't
- Build the "Transfer Ticket" workflow: button → confirmation dialog → notification
- Add visual routing alerts: yellow banner "This query requires Finance department. Transfer?"

**Team Beta (Backend + Infra):**
- Implement FastAPI RBAC middleware (see Lecture 4)
- Program the AI system prompt with department rules and routing logic
- Create internal API for ticket transfers: `POST /api/tickets/{id}/transfer`
- Add audit logging: every refund, every transfer, every restricted action is logged

**Deliverable:** Full department enforcement. A General agent CANNOT access Finance tools, even by asking the AI directly.

**Your job as a junior:**
- If on Team Alpha: Build the transfer workflow UI. Learn conditional rendering, modal dialogs, and optimistic UI with rollback.
- If on Team Beta: Write the RBAC middleware. Learn FastAPI `Depends()`, decorators, and HTTP 403 error handling.

---

### Phase 5: Performance Tuning, Caching & Load Testing (Month 5)

**Goal:** The system handles 1,000 concurrent agents at < 1.5s latency.

**What it means in plain English:**
The system works, but it's slow under load. This phase is about making it fast. You add Redis caching, optimize database queries, compress assets, and run load tests to prove it handles 1,000 users.

**Team Alpha (Frontend + Auth):**
- Optimize React bundle: code splitting (`React.lazy`), tree shaking, image lazy loading
- Implement virtualized chat lists (render only visible messages, not all 500)
- Reduce initial page load time: measure with Lighthouse, target < 2s First Contentful Paint
- Add client-side caching: store recent conversations in IndexedDB

**Team Beta (Backend + Infra):**
- Implement three-layer Redis caching (semantic, SQL, session) — see Lecture 3
- Add database connection pooling (`asyncpg` pool)
- Write Locust load test scripts (see Lecture 3)
- Run iterative load tests: 100 users → 500 → 1,000 → tune → repeat
- Set up CloudWatch dashboards: P50/P95/P99 latency, error rate, cache hit ratio

**Deliverable:** System validated at 1,000 concurrent users with P95 < 1.5s. Load test results documented.

**Your job as a junior:**
- If on Team Alpha: Run Lighthouse audits and fix the top 3 issues. Learn webpack/Vite bundle analysis.
- If on Team Beta: Write Locust test scripts and run them. Learn to read percentiles, identify bottlenecks, and tune caching.

---

### Phase 6: UAT, Hardening & Production Rollout (Month 6)

**Goal:** The system is live, stable, and monitored.

**What it means in plain English:**
The final push. You're not building new features — you're making sure nothing breaks. Security audits, monitoring alerts, user acceptance testing with real agents, documentation, and the actual production deployment.

**Team Alpha & Beta (combined effort):**
- Security audit: OWASP Top 10 check, dependency vulnerability scan (`npm audit`, `pip audit`)
- Set up CloudWatch alarms: API error rate > 1% → page on-call engineer
- Run UAT (User Acceptance Testing): 5-10 real support agents use the system for a week, report bugs
- Write API documentation (OpenAPI/Swagger auto-generated from FastAPI)
- Write runbooks: "What to do if Bedrock is down", "How to roll back a deployment"
- Production deployment: Blue-green deployment, canary release (10% → 50% → 100% traffic)

**Deliverable:** Live production system with monitoring, docs, and a support runbook.

**Your job as a junior:**
- Write documentation. Seriously. API docs, setup guides, runbooks. Juniors who write great docs get promoted.
- Participate in UAT: watch real users, note every confusion point, file bugs with clear reproduction steps.
- Learn the deployment process: observe the senior doing the prod deploy. Ask questions.

---

## 6.3 How to Work in a 2-Person Sub-Team

### The Daily Rhythm

```
09:00 — Standup (15 min): What I did yesterday, what I'm doing today, what's blocking me
09:15 — Code (2-3 hrs): Focused solo work. Slack notifications off.
12:00 — Lunch
13:00 — Pair programming or code review (1 hr)
14:00 — Code (2-3 hrs)
16:30 — Check-in with sub-team partner: "Are we on track for this week's deliverable?"
17:00 — Wrap up: commit, push, update task board
```

### The Sub-Team Contract

With your partner, agree on these things in Week 1:

1. **Code review policy:** Every PR gets reviewed by your partner before merging. Max 24-hour turnaround.
2. **Branch naming:** `feature/PHASE1-login-page`, `fix/PHASE2-upload-error-handling`
3. **Communication:** Urgent = Slack DM. Non-urgent = Slack channel. Async = GitHub issue comment.
4. **Definition of Done:** Code merged + tests pass + deployed to dev + manual smoke test passed.

### What to Do When You're Stuck

```
Level 1 (0-30 min): Google it. Read the docs. Try different search terms.
Level 2 (30-60 min): Ask your sub-team partner. "I'm stuck on X. I've tried Y and Z."
Level 3 (60-90 min): Ask the other sub-team. Fresh eyes often spot the issue.
Level 4 (90+ min):   Ask your tech lead. Come with: (1) what you're trying to do, 
                      (2) what you've tried, (3) your best guess at the problem.
```

**Never sit stuck for 2+ hours without asking for help.** That's not "being independent" — that's wasting company time.

---

## 6.4 What "Done" Looks Like for Each Role

### Junior Frontend Developer

Your work is done when:
- [ ] The UI matches the Figma/mockup (pixel-perfect isn't required, but intent must match)
- [ ] It works on Chrome, Firefox, and Safari (latest 2 versions)
- [ ] It works on mobile (responsive down to 375px width)
- [ ] Loading, empty, error, and edge-case states are handled (no white screen of death)
- [ ] Forms have validation with clear error messages
- [ ] Accessibility: all `input` elements have labels, all images have alt text, color contrast passes AA
- [ ] No console errors or warnings
- [ ] PR has a screenshot/GIF of the working feature

### Junior Backend Developer

Your work is done when:
- [ ] The endpoint handles valid input and returns correct output
- [ ] It handles invalid input with clear 4xx error responses (not 500 crashes)
- [ ] It has at least one integration test (call the endpoint → check the response)
- [ ] Database queries use parameterized statements (no SQL injection)
- [ ] Errors are logged with enough context to debug (which user, which endpoint, what input)
- [ ] The endpoint is documented in the OpenAPI/Swagger schema
- [ ] Environment variables are used for all configuration (no hardcoded URLs or keys)
- [ ] PR includes a `curl` example in the description that the reviewer can copy-paste to test

---

## 6.5 Key Vocabulary Cheat Sheet

| Term | Plain English |
|---|---|
| **Sprint** | A fixed time period (usually 2 weeks) with a specific set of tasks to complete |
| **Deliverable** | A concrete, demonstrable thing produced at the end of a phase |
| **Milestone** | A checkpoint marking the completion of a major piece of work |
| **Scope Creep** | New requirements added mid-project without adjusting the timeline |
| **MVP (Minimum Viable Product)** | The smallest version that delivers value to users |
| **UAT (User Acceptance Testing)** | Real users test the system before launch |
| **Canary Release** | Deploy to a small % of users first, monitor for errors, then roll out to everyone |
| **Blue-Green Deployment** | Two identical environments. Deploy to inactive one, switch traffic, keep old one as rollback |
| **Runbook** | A step-by-step guide for handling operational incidents |

---

## 6.6 Common Junior Mistakes

| Mistake | Why It Happens | How to Fix It |
|---|---|---|
| **Gold-plating** | You spend 3 days perfecting a button animation | Ask: "Does this directly contribute to the phase deliverable?" If not, note it for later. |
| **Not asking for clarification** | You guess what "build the admin dashboard" means | Always restate the task in your own words: "So I'm building a table that shows recent uploads with status, right?" |
| **Working on the wrong phase** | You get excited about Phase 5 caching and start building it in Phase 1 | Stick to the current phase. Future phases will change based on what you learn now. |
| **Siloed work** | You code for 2 weeks without pushing or asking for review | Push daily. Open a "Draft PR" on day 1. Get feedback early, not after you've built the wrong thing. |
| **Not updating the task board** | You move tickets to "Done" but forget to move your current ticket to "In Progress" | Update the board at standup. It's how your team knows what you're working on. |

---

## 6.7 Summary

- The roadmap is your compass. Each phase has a clear goal and deliverable.
- Phase 1 = skeleton. Phase 2 = data. Phase 3 = intelligence. Phase 4 = security. Phase 5 = speed. Phase 6 = stability.
- Work in pairs. Review each other's code. Ask for help within 90 minutes of being stuck.
- "Done" has a checklist. Use it.
- **The best junior engineers are not the ones who write the most code — they're the ones who reliably deliver complete, tested, documented features on time.**

👉 **Exercise:** [Exercise 6: Plan a Mini Roadmap](exercises/exercise-06-project-planning.md)

---

## How to Get Help

Stuck on an exercise? Each exercise also includes a "Stuck?" section with specific troubleshooting hints for the most common failure modes — check that first.

If those do not help, follow this escalation path:

1. **0-15 min:** Check the internal wiki. Search Slack history for the error message. Read the official docs for the tool you are using.
2. **15-30 min:** Google the specific error message. Look for GitHub issues on the relevant repository.
3. **30-60 min:** Ask your sub-team partner. Share your screen and walk through what you tried.
4. **60-90 min:** Ask the other sub-team. They may have hit the same issue.
5. **90+ min:** Ask your tech lead. Come prepared with: (1) what you are trying to do, (2) everything you have tried, (3) your best theory about the cause.

**Never sit stuck for 2+ hours without asking for help.** That is not independence — it is wasted time.

---

## After Completing All Lectures

You should be able to:
- Read and explain our blueprint's architecture diagram to another engineer
- Choose the right AWS service for a given task
- Reason about latency, caching, and performance trade-offs
- Implement JWT-based authentication with RBAC
- Call a vision model API with proper image compression and prompting
- Break a project into phases and define what "done" means

**Next step:** Pick a real task from the current phase of our project and apply what you have learned. Start with something small — a single endpoint, a single UI component. Ship it. Get feedback. Repeat.

---

## Master Glossary

Consolidated definitions from all six lectures. If you encounter an unfamiliar term, find it here.

### Architecture & System Design

| Term | Plain English |
|---|---|
| **Frontend / Client** | What the user sees and interacts with (browser, mobile app) |
| **Backend / Server** | Code that runs on a remote machine, handles business logic |
| **API (Application Programming Interface)** | A contract: "Send me data in this format, I will respond in that format" |
| **Load Balancer** | Traffic cop that distributes requests across multiple servers |
| **CDN (Content Delivery Network)** | Copies of your static files stored in data centers worldwide for fast delivery |
| **Cache** | A temporary, super-fast storage layer that remembers answers to avoid recomputing them |
| **Database** | Permanent storage for structured data (tables with rows and columns) |
| **Vector Database** | Storage for "meaning" — finds similar content by comparing mathematical embeddings |
| **Microservice** | A small, independent service that does one thing well |
| **Monolith** | One big application that does everything |
| **Event-Driven** | Components react to events (e.g., a file upload triggers a processing pipeline) |

### Performance

| Term | Plain English |
|---|---|
| **Latency** | How long one operation takes, measured in milliseconds |
| **Throughput** | How many operations you can handle per second |
| **P50/P95/P99** | "X% of requests are faster than this value" — P99 is often the most important |
| **Cache Hit / Miss** | Hit = found in cache (fast). Miss = not in cache (slow, must compute) |
| **Cache Invalidation** | Deciding when cached data is stale and must be refreshed |
| **TTL (Time To Live)** | How long cached data lives before automatic deletion |
| **RAG (Retrieval-Augmented Generation)** | Look up relevant documents, feed them to the LLM, get a better answer |
| **SSE (Server-Sent Events)** | Server pushes data to the client as a one-way stream |
| **WebSocket** | Two-way persistent connection for chat and live collaboration |
| **TTFT (Time To First Token)** | How long until the first word of the LLM response appears |

### Authentication & Security

| Term | Plain English |
|---|---|
| **Authentication (AuthN)** | Proving who you are |
| **Authorization (AuthZ)** | Checking what you are allowed to do |
| **JWT (JSON Web Token)** | A signed JSON blob that proves identity without a database lookup |
| **Claim** | A key-value pair inside a JWT (e.g., `"department": "Finance"`) |
| **Signature** | Cryptographic proof that the JWT was not tampered with |
| **JWKS (JSON Web Key Set)** | Public keys used to verify JWT signatures |
| **RBAC** | Role-Based Access Control: assign permissions to roles, assign roles to users |
| **Middleware** | Code that runs on every request BEFORE your route handler |
| **Bearer Token** | A token sent in the `Authorization: Bearer <token>` HTTP header |
| **401 vs. 403** | 401 = "I do not know who you are." 403 = "I know who you are, but no." |
| **Defense in Depth** | Multiple layers of security — if one fails, the next catches it |

### AI & Vision

| Term | Plain English |
|---|---|
| **Multimodal** | AI that processes multiple input types (text + image + audio) |
| **Vision Encoder** | Converts image pixels into number arrays the LLM can understand |
| **Image Token** | A patch of an image, converted to numbers — like a "word" for vision |
| **base64** | Binary data (like an image) encoded as text so it can travel in JSON |
| **Presigned URL** | A temporary S3 URL that allows upload/download without AWS credentials |
| **JPEG vs. PNG** | JPEG = photos (lossy, small). PNG = screenshots/diagrams (lossless, larger) |
| **Hallucination** | The model confidently states something that is not true |

### AWS & Cloud

| Term | Plain English |
|---|---|
| **Region** | A physical geographic area with multiple data centers (e.g., `us-east-1` = Northern Virginia) |
| **Availability Zone (AZ)** | One or more discrete data centers within a Region |
| **Serverless** | You do not see or manage servers — you provide code/config, the cloud runs it |
| **Managed Service** | The cloud handles operations (backups, patching, scaling). You just use the service |
| **IAM (Identity & Access Management)** | The permission system: who can do what to which resources |
| **ARN (Amazon Resource Name)** | A unique ID for every AWS resource: `arn:aws:s3:::my-bucket/file.txt` |
| **boto3** | The official Python SDK for AWS. Every AWS service has a boto3 client |
| **IaC (Infrastructure as Code)** | Define cloud resources in code files (Terraform, CDK), not by clicking in the console |

### Project Management

| Term | Plain English |
|---|---|
| **Sprint** | A fixed time period (usually 2 weeks) with a specific set of tasks |
| **Deliverable** | A concrete, demonstrable thing produced at the end of a phase |
| **Milestone** | A checkpoint marking the completion of a major piece of work |
| **Scope Creep** | New requirements added mid-project without adjusting the timeline |
| **MVP (Minimum Viable Product)** | The smallest version that delivers value to users |
| **UAT (User Acceptance Testing)** | Real users test the system before launch |
| **Canary Release** | Deploy to a small percentage of users first, monitor, then roll out to everyone |
| **Blue-Green Deployment** | Two identical environments — deploy to inactive, switch traffic, keep old as rollback |
| **Runbook** | A step-by-step guide for handling operational incidents |
