# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**immo-calc** is a German real estate ("Immobilien") purchase cost calculator built with Angular. It calculates Kaufnebenkosten (purchase side costs) and provides a basic mortgage/financing overview. It is intended to help customers (i.e., borrowers) compare the loan offers of one or more banks and to identify and point out any potential pitfalls. UI is in German. MIT licensed, authored by Philipp Meißner.

## Tech Stack

- **Framework**: Angular (latest, standalone components, signals, new control flow)
- **Styling**: Pure SCSS with CSS custom properties
- **Language**: TypeScript (strict mode)
- **Locale**: de-DE

## Commands

- `ng serve` — Start dev server (localhost:4200)
- `ng build` — Production build
- `ng test` — Run all tests (Vitest)
- `ng test --no-watch` — Run tests once

## Common rules
* cluster changes into meaningful commits
* do not mention that claude co-authored the commit
* ask questions if inputs were unclear or need more information
* provide warnings when applicable to inform a user when values seem off (too high/low)

