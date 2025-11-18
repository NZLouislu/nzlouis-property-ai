## Story: PAT-6 Enhance TrelloProvider for Checklist, Label, and Member Sync

### Story ID
PAT-6

### Status
Backlog

### Description
Extend TrelloProvider to ensure checklist creation, label alignment, and member assignment comply with the new import pipeline, including retries and detailed logging.

### Acceptance Criteria

- [ ] Checklist synchronization recreates Todos checklist when acceptance criteria change
- [ ] Label and member lookups cache Trello IDs and log unresolved entries as warnings
- [ ] findItemByStoryIdOrTitle() prefers custom field matches and only warns on title fallbacks
- [ ] Provider unit tests mock Trello REST endpoints covering success, retry, and failure paths

### Priority
High

### Labels
sync, trello, provider

### Reporter
Louis Lu
