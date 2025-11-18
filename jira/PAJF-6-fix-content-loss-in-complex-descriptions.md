## Story: PAJF-6 Fix Content Loss in Complex Descriptions

### Story ID
PAJF-6

### Status
Backlog

### Description
Long and complex descriptions are truncated during sync. Significant content is lost including code blocks, blockquotes, tables, and sections.

**Current Behavior:**

* Complex story with multiple sections
* After sync, missing code blocks, blockquotes, tables
* Only first few sections are preserved

**Missing Content Example:**

* Section 2: Code Block with Explanation - MISSING
* Blockquote with note - MISSING
* Section 3: Table with Links - MISSING
* Subsection: Important Notes - MISSING

**Possible Causes:**

* ADF conversion size limits
* Jira API field length restrictions
* Conversion error causing early termination

**Expected Behavior:**

* All content should be synced to Jira
* No content should be lost during conversion
* Complex formatting should be fully preserved

### Acceptance Criteria

- [ ] All sections are synced to Jira
- [ ] No content truncation occurs
- [ ] Complex nested structures are preserved
- [ ] Round-trip conversion is complete

### Priority
Highest

### Labels
bug, critical, content-loss, sync

### Assignees
Louis Lu

### Reporter
Louis Lu
