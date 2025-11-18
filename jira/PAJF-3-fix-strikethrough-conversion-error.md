## Story: PAJF-3 Fix Strikethrough Conversion Error

### Story ID
PAJF-3

### Status
Backlog

### Description
Strikethrough markdown is incorrectly converted to HTML sub tags instead of proper strikethrough format.

**Current Behavior:**

* Input: ~~strikethrough~~
* After conversion: ~~strikethrough~~
* Completely wrong format

**Expected Behavior:**

* ~~text~~ should convert to proper Jira strikethrough
* Should render as strikethrough text in Jira
* Should convert back to ~~text~~ format

**Technical Investigation:**

* Check ADF strikethrough node type
* Verify jira2md strikethrough handling
* Test FormatConverter strikethrough conversion

### Acceptance Criteria

- [ ] Strikethrough converts to correct ADF format
- [ ] Strikethrough renders correctly in Jira
- [ ] Round-trip preserves strikethrough formatting
- [ ] No HTML tags in output

### Priority
High

### Labels
bug, formatting, strikethrough

### Assignees
Louis Lu

### Reporter
Louis Lu
