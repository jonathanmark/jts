# Junior Engineer Onboarding Guide

A **self-paced curriculum** that takes junior software engineers from "I understand CS theory" to "I can contribute to a real production system." All six lectures are built on a real-world blueprint: a real-time, multi-tenant AI Agentic Platform on AWS.

- **Total reading time:** 4–5 hours across all 6 lectures
- **Suggested pace:** one lecture + one exercise per day
- **Cost:** $0.00 (free tiers + local tools; Exercise 5 optionally ~$0.05 in API credits)

---

## How to Use This Guide

Go sequentially (1 → 6) — each lecture builds on the previous one. Every lecture links to a hands-on exercise you can run on your own laptop.

### The Lectures

| # | Lecture | What You'll Learn |
|---|---|---|
| 1 | [System Architecture](guides/README.md#1-system-architecture) | How to read architecture diagrams, trace requests, client-server / microservices / event-driven patterns |
| 2 | [AWS Services](guides/README.md#2-aws-services) | How cloud services map to CS fundamentals, managed vs. unmanaged trade-offs |
| 3 | [Performance Strategy](guides/README.md#3-performance-strategy) | Latency budgets, caching, streaming (SSE), structured vs. unstructured data, load testing |
| 4 | [Authentication & RBAC](guides/README.md#4-authentication-rbac) | AuthN vs. AuthZ, JWT tokens, role-based access control, defense in depth |
| 5 | [Multimodal Vision Pipeline](guides/README.md#5-multimodal-vision-pipeline) | Vision-language models, image compression, prompt engineering for vision |
| 6 | [Execution Roadmap](guides/README.md#6-execution-roadmap) | How 6-month projects are structured, sub-teams, what "done" looks like |

### The Exercises

| # | Exercise | Description |
|---|---|---|
| 1 | [Draw Your First Architecture](guides/exercises/exercise-01-draw-architecture.md) | Draw a diagram with pen and paper |
| 2 | [Deploy a Serverless Web App](guides/exercises/exercise-02-cloud-services-mapping.md) | Hands-on with cloud services |
| 3 | [Measure and Optimize API Latency](guides/exercises/exercise-03-latency-budget.md) | Profile and optimize a real endpoint |
| 4 | [Build a JWT + RBAC System](guides/exercises/exercise-04-jwt-rbac.md) | Implement auth end to end |
| 5 | [Call a Vision Model API](guides/exercises/exercise-05-vision-api.md) | Interact with a vision-language model |
| 6 | [Plan a Mini Roadmap](guides/exercises/exercise-06-project-planning.md) | Structure a 6-month project plan |

---

## Quick Start

1. Set up your Python environment — see the [Prerequisites](guides/README.md#prerequisites) section.
2. Read [Lecture 1: System Architecture](guides/README.md#1-system-architecture) for the big picture.
3. Do [Exercise 1](guides/exercises/exercise-01-draw-architecture.md) — draw a diagram with pen and paper.
4. Come back tomorrow for Lecture 2. Repeat one lecture + one exercise per day.

> **New to a term?** Check the [Master Glossary](guides/README.md#master-glossary) for quick definitions of every term used across all lectures.

## The Underlying Blueprint

The whole guide is built on a real enterprise blueprint: [Requirements and Product Architecture](requirements-and-architecture.md) — a real-time, multi-tenant AI Agentic Platform on AWS.
