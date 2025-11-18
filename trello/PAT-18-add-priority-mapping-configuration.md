## Story: PAT-18 Add Priority Mapping Configuration

### Story ID
PAT-18

### Status
Backlog

### Description
Implement configurable priority mapping between Markdown and Jira priority systems.

**Requirements:**

* Support custom priority names
* Map markdown priority to Jira priority IDs
* Handle different Jira priority schemes
* Provide default mapping for standard priorities

**Default Mapping:**

* Highest → Jira Highest (ID: 1)
* High → Jira High (ID: 2)
* Medium → Jira Medium (ID: 3)
* Low → Jira Low (ID: 4)
* Lowest → Jira Lowest (ID: 5)

**Configuration:**

* Add priorityMap to JiraConfig
* Support environment variable configuration
* Allow custom priority mappings

### Acceptance Criteria

- [ ] Priority mapping is configurable
- [ ] Default mapping works for standard priorities
- [ ] Custom mappings can be defined
- [ ] Invalid priorities are handled gracefully

### Priority
High

### Labels
configuration, feature, priority

### Assignees
Louis Lu

### Reporter
Louis Lu
