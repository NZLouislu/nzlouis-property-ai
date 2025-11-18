## Story: PAT-15 Fix Table Format Corruption

### Story ID
PAT-15

### Status
Backlog

### Description
Tables are broken into separate single-row tables instead of maintaining proper table structure.

**Current Behavior:**

* Input table with 3 rows becomes 3 separate tables
* Each row is rendered as individual table
* Table structure is completely broken

**Expected Behavior:**

* Tables should maintain row structure
* All rows should be part of same table
* Headers and data rows should be properly grouped

**Technical Details:**

* Review ADF table node structure
* Check table row and cell conversion
* Verify jira2md table rendering

### Acceptance Criteria

- [ ] Tables maintain proper structure
- [ ] All rows are in single table
- [ ] Headers are properly formatted
- [ ] Table formatting is preserved

### Priority
High

### Labels
bug, formatting, tables

### Assignees
Louis Lu

### Reporter
Louis Lu
