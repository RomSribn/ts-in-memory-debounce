# 🧪 TypeScript In-Memory Storage & Debounce Utility

## 📦 Overview

This repository includes two standalone TypeScript modules, implemented with SOLID principles and full static typing:

1. **In-Memory Storage** — a lightweight store for `{ id: string; tags: string[] }` objects with filtering by `id` and `tags`.
2. **Debounce Utility** — a fully typed debounce function supporting `wait` and `forceNext()` options, preserving `this` context and written without modifying built-in prototypes.

The code is modular, testable, and production-ready.

---

## 🚀 Getting Started

```bash
git clone https://github.com/RomSribn/ts-in-memory-debounce.git
cd ts-in-memory-debounce
npm ci
npm test
