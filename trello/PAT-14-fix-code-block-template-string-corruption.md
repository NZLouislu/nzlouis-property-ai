## Story: PAT-14 Fix Code Block Template String Corruption

### Story ID
PAT-14

### Status
Backlog

### Description
Template strings in code blocks are corrupted during conversion. Backticks are replaced with double curly braces.

**Current Behavior:**

```javascript
console.log({{Hello, ${name}!}});
```

### Acceptance Criteria

- [ ] Template strings preserve backticks
- [ ] Code blocks maintain exact content
- [ ] Round-trip conversion is lossless
- [ ] All special characters in code are preserved

### Priority
High

### Labels
bug, code-blocks, formatting

### Assignees
Louis Lu

### Reporter
Louis Lu
