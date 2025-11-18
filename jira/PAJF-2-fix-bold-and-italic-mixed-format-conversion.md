## Story: PAJF-2 Fix Bold and Italic Mixed Format Conversion

### Story ID
PAJF-2

### Status
Backlog

### Description
Mixed bold and italic formatting is corrupted during Markdown to Jira to Markdown round-trip conversion.

**Current Behavior:**

* Input: ***bold and italic***
* After round-trip: *_bold and italic***
* Format is broken and not rendered correctly

**Root Cause:**

* ADF conversion does not properly handle combined bold+italic
* jira2md library may have limitations

**Expected Behavior:**

* ***text*_ should remain _*text*** after round-trip
* Or convert to alternative format that renders correctly

### Acceptance Criteria

- [ ] Bold and italic combination converts correctly
- [ ] Round-trip conversion preserves formatting
- [ ] Text renders with both bold and italic styles

### Priority
High

### Labels
bug, formatting, text-styles

### Assignees
Louis Lu

### Reporter
Louis Lu
