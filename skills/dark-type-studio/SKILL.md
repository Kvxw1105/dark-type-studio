---
name: dark-type-studio
description: Edit Dark Type Studio project JSON through its CLI or MCP tools.
---

# Dark Type Studio Agent Workflow

1. Read a project with `studio_get_project` or `npm run dark-type -- inspect PROJECT.json`.
2. Keep the returned `revision` and submit a compact `operations` array.
3. Use `studio_apply_operations` or `npm run dark-type -- apply PROJECT.json --operations OPS.json --base-revision REVISION`.
4. Validate after every write. For visual export, open the resulting JSON in Dark Type Studio and use its existing PNG, JPG, or WebP export controls.

Use layer IDs from the project. Supported operations are listed by `studio_capabilities` and include project settings, layer edits, movement, add/delete/duplicate/reorder, and text-range styles.

Never edit project JSON by string replacement. Use an operation transaction so the revision check prevents stale overwrites.
