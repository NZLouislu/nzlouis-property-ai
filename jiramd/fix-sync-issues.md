## Backlog

- Story: Fix Priority Field Sync
  Description: Priority field is not being synced from Markdown to Jira. All issues are created with Medium priority regardless of the Priority value specified in the markdown file.
  
  **Current Behavior:**
  - Markdown specifies Priority: High
  - Jira issue is created with Priority: Medium
  - Priority field is not included in the create issue payload
  
  **Expected Behavior:**
  - Priority specified in markdown should be synced to Jira
  - Support standard Jira priorities: Highest, High, Medium, Low, Lowest
  
  **Technical Details:**
  - Update createIssueFromStory function in md-to-jira.ts
  - Add priority field to JiraCreateIssuePayload
  - Map markdown priority values to Jira priority IDs
  - Handle priority field in updateIssueFromStory as well
  Acceptance_Criteria:
    - [ ] Priority field is included in create issue payload
    - [ ] Priority mapping works for all standard values
    - [ ] Created issues have correct priority in Jira
    - [ ] Updated issues preserve priority changes
  Priority: Highest
  Labels: [bug, priority, sync, critical]
  Assignees: Louis Lu
  Reporter: Louis Lu

- Story: Fix Bold and Italic Mixed Format Conversion
  Description: Mixed bold and italic formatting is corrupted during Markdown to Jira to Markdown round-trip conversion.
  
  **Current Behavior:**
  - Input: ***bold and italic***
  - After round-trip: _*bold and italic***
  - Format is broken and not rendered correctly
  
  **Root Cause:**
  - ADF conversion does not properly handle combined bold+italic
  - jira2md library may have limitations
  
  **Expected Behavior:**
  - ***text*** should remain ***text*** after round-trip
  - Or convert to alternative format that renders correctly
  Acceptance_Criteria:
    - [ ] Bold and italic combination converts correctly
    - [ ] Round-trip conversion preserves formatting
    - [ ] Text renders with both bold and italic styles
  Priority: High
  Labels: [bug, formatting, text-styles]
  Assignees: Louis Lu
  Reporter: Louis Lu

- Story: Fix Strikethrough Conversion Error
  Description: Strikethrough markdown is incorrectly converted to HTML sub tags instead of proper strikethrough format.
  
  **Current Behavior:**
  - Input: ~~strikethrough~~
  - After conversion: <sub></sub>strikethrough<sub></sub>
  - Completely wrong format
  
  **Expected Behavior:**
  - ~~text~~ should convert to proper Jira strikethrough
  - Should render as strikethrough text in Jira
  - Should convert back to ~~text~~ format
  
  **Technical Investigation:**
  - Check ADF strikethrough node type
  - Verify jira2md strikethrough handling
  - Test FormatConverter strikethrough conversion
  Acceptance_Criteria:
    - [ ] Strikethrough converts to correct ADF format
    - [ ] Strikethrough renders correctly in Jira
    - [ ] Round-trip preserves strikethrough formatting
    - [ ] No HTML tags in output
  Priority: High
  Labels: [bug, formatting, strikethrough]
  Assignees: Louis Lu
  Reporter: Louis Lu

- Story: Fix Code Block Template String Corruption
  Description: Template strings in code blocks are corrupted during conversion. Backticks are replaced with double curly braces.
  
  **Current Behavior:**
  ```javascript
  console.log(`Hello, ${name}!`);
  ```
  
  Becomes:
  ```javascript
  console.log({{Hello, ${name}!}});
  ```
  
  **Expected Behavior:**
  - Template strings should preserve backticks
  - Code blocks should maintain exact formatting
  - No character substitution in code content
  
  **Investigation Areas:**
  - ADF code block content handling
  - Special character escaping in code blocks
  - jira2md code block conversion
  Acceptance_Criteria:
    - [ ] Template strings preserve backticks
    - [ ] Code blocks maintain exact content
    - [ ] Round-trip conversion is lossless
    - [ ] All special characters in code are preserved
  Priority: High
  Labels: [bug, code-blocks, formatting]
  Assignees: Louis Lu
  Reporter: Louis Lu

- Story: Fix Table Format Corruption
  Description: Tables are broken into separate single-row tables instead of maintaining proper table structure.
  
  **Current Behavior:**
  - Input table with 3 rows becomes 3 separate tables
  - Each row is rendered as individual table
  - Table structure is completely broken
  
  **Expected Behavior:**
  - Tables should maintain row structure
  - All rows should be part of same table
  - Headers and data rows should be properly grouped
  
  **Technical Details:**
  - Review ADF table node structure
  - Check table row and cell conversion
  - Verify jira2md table rendering
  Acceptance_Criteria:
    - [ ] Tables maintain proper structure
    - [ ] All rows are in single table
    - [ ] Headers are properly formatted
    - [ ] Table formatting is preserved
  Priority: High
  Labels: [bug, tables, formatting]
  Assignees: Louis Lu
  Reporter: Louis Lu

- Story: Fix Content Loss in Complex Descriptions
  Description: Long and complex descriptions are truncated during sync. Significant content is lost including code blocks, blockquotes, tables, and sections.
  
  **Current Behavior:**
  - Complex story with multiple sections
  - After sync, missing code blocks, blockquotes, tables
  - Only first few sections are preserved
  
  **Missing Content Example:**
  - Section 2: Code Block with Explanation - MISSING
  - Blockquote with note - MISSING
  - Section 3: Table with Links - MISSING
  - Subsection: Important Notes - MISSING
  
  **Possible Causes:**
  - ADF conversion size limits
  - Jira API field length restrictions
  - Conversion error causing early termination
  
  **Expected Behavior:**
  - All content should be synced to Jira
  - No content should be lost during conversion
  - Complex formatting should be fully preserved
  Acceptance_Criteria:
    - [ ] All sections are synced to Jira
    - [ ] No content truncation occurs
    - [ ] Complex nested structures are preserved
    - [ ] Round-trip conversion is complete
  Priority: Highest
  Labels: [bug, critical, content-loss, sync]
  Assignees: Louis Lu
  Reporter: Louis Lu

- Story: Fix Escaped Character Conversion
  Description: Escaped characters are incorrectly converted. Underscores become asterisks during round-trip conversion.
  
  **Current Behavior:**
  - Input: \_not italic\_
  - After round-trip: \*not italic\*
  - Wrong escape character used
  
  **Expected Behavior:**
  - Escaped characters should be preserved exactly
  - \_ should remain \_
  - \* should remain \*
  - \` should remain \`
  
  **Technical Investigation:**
  - Check escape character handling in ADF
  - Review jira2md escape processing
  - Test all escape sequences
  Acceptance_Criteria:
    - [ ] Escaped underscores are preserved
    - [ ] Escaped asterisks are preserved
    - [ ] Escaped backticks are preserved
    - [ ] All escape sequences work correctly
  Priority: Medium
  Labels: [bug, formatting, escape-characters]
  Assignees: Louis Lu
  Reporter: Louis Lu

- Story: Add Priority Mapping Configuration
  Description: Implement configurable priority mapping between Markdown and Jira priority systems.
  
  **Requirements:**
  - Support custom priority names
  - Map markdown priority to Jira priority IDs
  - Handle different Jira priority schemes
  - Provide default mapping for standard priorities
  
  **Default Mapping:**
  - Highest → Jira Highest (ID: 1)
  - High → Jira High (ID: 2)
  - Medium → Jira Medium (ID: 3)
  - Low → Jira Low (ID: 4)
  - Lowest → Jira Lowest (ID: 5)
  
  **Configuration:**
  - Add priorityMap to JiraConfig
  - Support environment variable configuration
  - Allow custom priority mappings
  Acceptance_Criteria:
    - [ ] Priority mapping is configurable
    - [ ] Default mapping works for standard priorities
    - [ ] Custom mappings can be defined
    - [ ] Invalid priorities are handled gracefully
  Priority: High
  Labels: [feature, priority, configuration]
  Assignees: Louis Lu
  Reporter: Louis Lu

- Story: Improve ADF Conversion Error Handling
  Description: Add better error handling and logging for ADF conversion failures to help diagnose content loss and formatting issues.
  
  **Requirements:**
  - Log conversion errors with context
  - Identify which content failed to convert
  - Provide fallback for unsupported formats
  - Add validation for converted content
  
  **Error Scenarios:**
  - Unsupported markdown syntax
  - ADF node creation failures
  - Content size limit exceeded
  - Invalid nested structures
  
  **Logging Improvements:**
  - Log input markdown length
  - Log output ADF size
  - Warn on content truncation
  - Report unsupported features
  Acceptance_Criteria:
    - [ ] Conversion errors are logged with details
    - [ ] Failed content is identified
    - [ ] Fallback handling prevents data loss
    - [ ] Validation catches conversion issues
  Priority: Medium
  Labels: [enhancement, error-handling, logging]
  Assignees: Louis Lu
  Reporter: Louis Lu

- Story: Add Comprehensive Format Conversion Tests
  Description: Create automated tests to verify all formatting conversions work correctly for round-trip sync.
  
  **Test Coverage:**
  - Priority field sync
  - Text formatting (bold, italic, strikethrough)
  - Code blocks with special characters
  - Tables with multiple rows
  - Complex nested structures
  - Escaped characters
  - All markdown features
  
  **Test Types:**
  - Unit tests for FormatConverter
  - Integration tests for md-to-jira
  - Round-trip conversion tests
  - Edge case handling tests
  
  **Test Framework:**
  - Use existing test setup
  - Add test fixtures for each format
  - Compare input vs output
  - Validate Jira API responses
  Acceptance_Criteria:
    - [ ] All format types have tests
    - [ ] Round-trip tests pass
    - [ ] Edge cases are covered
    - [ ] Tests run in CI/CD
  Priority: High
  Labels: [testing, quality, automation]
  Assignees: Louis Lu
  Reporter: Louis Lu

- Story: Verify All Fixes with End-to-End Test
  Description: Run complete end-to-end verification of all fixes using the test-format-rendering.md file.
  
  **Verification Steps:**
  1. Clean up existing test issues in Jira
  2. Run npm run md-to-jira with test-format-rendering.md
  3. Verify all issues created with correct data
  4. Run npm run jira-to-md to export back
  5. Compare original vs exported markdown
  6. Verify all fields match exactly
  
  **Fields to Verify:**
  - Story ID and title
  - Status
  - Description content (complete, no loss)
  - Priority (High, Medium, Low)
  - Labels
  - Assignees
  - Reporter
  - Acceptance Criteria
  
  **Format Verification:**
  - Headers (H1-H6)
  - Text styles (bold, italic, strikethrough)
  - Code blocks (with template strings)
  - Lists (ordered, unordered, nested)
  - Links
  - Blockquotes
  - Tables (multi-row)
  - Special characters
  - Emojis and unicode
  
  **Build Verification:**
  - Run npm test - all tests pass
  - Run npm run build - builds successfully
  - Run npm run lint - no errors
  - Check TypeScript compilation
  
  **Documentation:**
  - Update README with verified features
  - Document known limitations
  - Add troubleshooting guide
  - Update examples
  Acceptance_Criteria:
    - [ ] All test issues sync correctly to Jira
    - [ ] Round-trip conversion is lossless
    - [ ] Priority field syncs correctly
    - [ ] All formatting is preserved
    - [ ] No content is lost
    - [ ] Tables maintain structure
    - [ ] Code blocks preserve content
    - [ ] npm test passes
    - [ ] npm run build succeeds
    - [ ] README is updated
  Priority: Highest
  Labels: [verification, testing, documentation]
  Assignees: Louis Lu
  Reporter: Louis Lu
