## Story: PAT-17 Fix Escaped Character Conversion

### Story ID
PAT-17

### Status
Backlog

### Description
Escaped characters are incorrectly converted. Underscores become asterisks during round-trip conversion.

**Current Behavior:**

* Input: \*not italic\*
* After round-trip: \*not italic\*
* Wrong escape character used

**Expected Behavior:**

* Escaped characters should be preserved exactly
* \_ should remain \_
* \* should remain \*
* \` should remain \`

**Technical Investigation:**

* Check escape character handling in ADF
* Review jira2md escape processing
* Test all escape sequences

### Acceptance Criteria

- [ ] Escaped underscores are preserved
- [ ] Escaped asterisks are preserved
- [ ] Escaped backticks are preserved
- [ ] All escape sequences work correctly

### Priority
Medium

### Labels
bug, escape-characters, formatting

### Assignees
Louis Lu

### Reporter
Louis Lu
