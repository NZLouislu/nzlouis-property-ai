## Story: PAJF-1 Fix Priority Field Sync

### Story ID
PAJF-1

### Status
Backlog

### Description
Priority field is not being synced from Markdown to Jira. All issues are created with Medium priority regardless of the Priority value specified in the markdown file.

**Current Behavior:**

* Markdown specifies Priority: High
* Jira issue is created with Priority: Medium
* Priority field is not included in the create issue payload

**Expected Behavior:**

* Priority specified in markdown should be synced to Jira
* Support standard Jira priorities: Highest, High, Medium, Low, Lowest

**Technical Details:**

* Update createIssueFromStory function in md-to-jira.ts
* Add priority field to JiraCreateIssuePayload
* Map markdown priority values to Jira priority IDs
* Handle priority field in updateIssueFromStory as well

### Acceptance Criteria

- [ ] Priority field is included in create issue payload
- [ ] Priority mapping works for all standard values
- [ ] Created issues have correct priority in Jira
- [ ] Updated issues preserve priority changes

### Priority
Highest

### Labels
bug, priority, sync, critical

### Assignees
Louis Lu

### Reporter
Louis Lu
