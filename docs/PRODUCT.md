# Statuta Product Contract

## Product sentence

**Statuta helps Swiss associations understand which statutes currently apply, what those statutes require for the next General Assembly, what was decided, and which statute version becomes valid afterwards.**

## Problem

Association statutes are authoritative documents, but their operational consequences are often reconstructed manually. Committees and members need a clear answer to which version applies, what it requires for an upcoming General Assembly, where each requirement originates, and whether an approved revision has enough evidence to become current.

## User

The primary user is a committee member or administrator of a Swiss association preparing, documenting or reviewing a General Assembly. Members and professional advisers may use the same view to trace requirements, decisions and version history.

## Demonstrator purpose

This repository is an **interactive concept demonstrator for validating the Statuta workflow and product proposition**. It presents one coherent fictional association with synthetic data through one deployable URL. It is not a production system, legal engine, generic governance framework or backend prototype.

The demonstrator tests whether a visitor can understand the complete workflow without Git terminology or developer knowledge:

**Current Statute Version → General Assembly → Decision → Evidence → New Current Statute Version**

The synthetic scenario spans both the planning view of the 2027 General Assembly and its later recorded outcome so the full lifecycle can be demonstrated. Dates used for planning and activation are explicit fixture inputs.

## Four screens

### Overview

Summarises the association, current statute version, scheduled General Assembly, calculated next action and proposed amendment. It communicates the product proposition within seconds.

### Statutes

Shows one identifiable current statute version, previous versions, the 2027 revision and the decisions and source documents that support their status.

### General Assembly

Turns the governing statute version into an operational table of invitation, agenda, quorum and amendment-majority requirements. Every result links to the exact source article in the governing version.

### Revision

Compares corresponding articles by stable lineage, presents the synthetic vote and minutes evidence, evaluates the required majority, and permits evidence-gated in-memory activation. Activation updates the shared Overview, Statutes and Revision views; a reload restores the fixture.

## Current scope

- Swiss associations;
- one synthetic association and one canonical amendment workflow;
- typed in-memory domain state;
- deterministic calendar-day, provenance, comparison, vote and lifecycle functions;
- a responsive Next.js App Router interface deployable without runtime services.

## Deferred modules

Production persistence, authentication, document ingestion, human review, AI extraction, APIs and integrations are deferred. Board & Authority, Governance Passport, Policy Distribution, bank integration and white-label modules may be explored only after product and distribution validation. They are not designed or scaffolded here.
