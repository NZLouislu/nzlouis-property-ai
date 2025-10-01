## Story: Implement Like Functionality on Forecast Cards

### Story ID

nzlouis-property-ai-forecast-like-function1

### Status

Backlog

### Description

As a user, I want to be able to like property cards on the forecast page so that I can save interesting properties for later review and analysis.

### Acceptance Criteria

- Users can click a "like" button/icon on each property card on the `/forecast` page
- Likes are persisted in the backend database with user and property identifiers
- Liked properties are displayed in a dedicated "Favorites" section/page
- Users can remove likes from the favorites page
- The like count is displayed on each card
- The UI provides visual feedback when a card is liked/unliked

### Technical Implementation

- Create a new API endpoint for managing likes (`/api/likes`)
- Add a likes table to the database with fields for user_id, property_id, and timestamp
- Implement frontend components for displaying and managing likes
- Add necessary service layer logic to handle like operations
- Update property card components to include like functionality
