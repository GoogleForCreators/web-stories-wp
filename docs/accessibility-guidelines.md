# Accessibility Guidelines

This project follows web accessibility practices and patterns outlined by [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) to make the application more accessible to people with disabilities or people using assistive technologies.

Please submit a ticket if any discrepancies are seen that will be detrimental the accessibility of this application.

## Special Concerns

### Dynamically changing content with Javascript

When a portion of a page is updated with JavaScript, the update is usually highlighted with animation and bright colors, and is easy to see. But if you don’t have the ability to see the screen, you don’t know this has happened, unless the updated region is marked as an [ARIA live region](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions).

The `useLiveRegion` hook is a simple tool that creates and appends an ARIA live notifications area to the element where developers can dispatch text messages.

Assistive technologies will automatically announce any text change in this area. This ARIA live region has an ARIA role of “status” so it has an implicit aria-live value of polite and an implicit aria-atomic value of true.

**Note**: It’s also possible that all the region content will be announced after an update, if the ARIA live region is too large. Please only provide users with just a simple, concise message.

### Testing Concerns

Please visit the [accessibility testing](./accessibility-testing.md) documentation for more information.
