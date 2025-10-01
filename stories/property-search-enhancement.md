## Story: Add Property Search and Filter Functionality

### Description
As a user, I want to be able to search and filter properties by various criteria so that I can quickly find properties that match my specific requirements.

### Acceptance Criteria
- Users can search properties by suburb, property type, price range, and bedrooms
- Search results update in real-time as users adjust filters
- Filters can be cleared with a single action
- Search results show the total count of matching properties
- Users can save their filter preferences for future visits
- The UI is responsive and works well on both desktop and mobile devices

### Technical Implementation
- Create a search API endpoint that accepts multiple filter parameters
- Implement frontend components for search input and filter controls
- Add database indexes to optimize search performance
- Store user filter preferences in localStorage or cookies
- Implement responsive design for search components