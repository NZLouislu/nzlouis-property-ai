## Story: PAT-20 Add Comprehensive Format Conversion Tests

### Story ID
PAT-20

### Status
Backlog

### Description
Create automated tests to verify all formatting conversions work correctly for round-trip sync.

**Test Coverage:**

* Priority field sync
* Text formatting (bold, italic, strikethrough)
* Code blocks with special characters
* Tables with multiple rows
* Complex nested structures
* Escaped characters
* All markdown features

**Test Types:**

* Unit tests for FormatConverter
* Integration tests for md-to-jira
* Round-trip conversion tests
* Edge case handling tests

**Test Framework:**

* Use existing test setup
* Add test fixtures for each format
* Compare input vs output
* Validate Jira API responses

### Acceptance Criteria

- [ ] All format types have tests
- [ ] Round-trip tests pass
- [ ] Edge cases are covered
- [ ] Tests run in CI/CD

### Priority
High

### Labels
automation, quality, testing

### Assignees
Louis Lu

### Reporter
Louis Lu
