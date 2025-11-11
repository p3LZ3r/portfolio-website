# Testing Checklist: Cal.com Popup Embed Integration

Change-id: add-cal-popup-embed
Owner: Kilo Code
Date: 2025-11-05

## Manual Testing Requirements

### 1. Basic Functionality Tests
- [ ] **Modal opens on click**: Click the CallButton on any page (About, Projects, Contact) and verify the Cal.com modal opens
- [ ] **Modal displays correct event type**: Verify the modal shows the "45min" booking type for tlinnecke
- [ ] **Modal loads available slots**: Confirm that available time slots are displayed in the modal
- [ ] **Modal can be closed**: Test closing the modal using the X button or escape key
- [ ] **Focus management**: Verify focus moves into the modal when opened and returns to the trigger button when closed

### 2. Prerendering Tests
- [ ] **Prerender on hover**: Hover over the CallButton and verify prerendering is triggered (check browser network tab for iframe requests)
- [ ] **Faster modal opening**: Compare modal opening speed with and without prerendering
- [ ] **Prerender analytics**: Verify `cal:prerender` events are fired when hovering over buttons
- [ ] **Prerender state indicator**: Check that screen reader announces "Booking calendar preloaded" when prerendered

### 3. Prefill Tests (Contact Page)
- [ ] **Name prefill**: Fill in the name field on Contact page, click CallButton, verify name appears in Cal.com modal
- [ ] **Email prefill**: Fill in the email field on Contact page, click CallButton, verify email appears in Cal.com modal
- [ ] **Partial prefill**: Fill in only name or only email, verify partial prefill works correctly
- [ ] **No prefill**: Click CallButton without filling form, verify modal opens without prefill data

### 4. Accessibility Tests
- [ ] **Keyboard navigation**: Tab to the CallButton and press Enter/Space to open modal
- [ ] **Screen reader**: Verify screen reader announces button purpose and modal state changes
- [ ] **Reduced motion**: Enable `prefers-reduced-motion` and verify animations are respectful
- [ ] **Focus trap**: Verify focus stays within modal when open using Tab key
- [ ] **ARIA labels**: Verify proper ARIA attributes on button and modal

### 5. Cross-browser Tests
- [ ] **Chrome/Edge**: Full functionality including prerendering and modal opening
- [ ] **Firefox**: Modal opens and functions (prerendering may not work due to View Transitions API support)
- [ ] **Safari**: Modal opens and functions (prerendering may not work due to View Transitions API support)
- [ ] **Mobile**: Test on mobile devices for touch interactions and responsive modal

### 6. Performance Tests
- [ ] **Script loading**: Verify Cal.com script is not loaded until user interaction (check network tab)
- [ ] **Bundle size impact**: Verify the addition doesn't significantly impact initial page load
- [ ] **Memory usage**: Check for memory leaks after opening/closing modal multiple times

### 7. Privacy and Security Tests
- [ ] **Query parameter forwarding**: Test with URL parameters to verify they're forwarded to Cal.com
- [ ] **No data leakage**: Verify no sensitive form data is sent before user consent
- [ ] **HTTPS only**: Ensure all Cal.com requests use HTTPS
- [ ] **Cookie policy**: Verify Cal.com cookie usage is compliant with privacy policy

### 8. Error Handling Tests
- [ ] **Network failure**: Test behavior when Cal.com script fails to load
- [ ] **Invalid calLink**: Test with invalid booking link
- [ ] **Modal timeout**: Test behavior when Cal.com modal fails to load

### 9. Analytics Tests
- [ ] **Open events**: Verify `cal:open` events are fired with correct details
- [ ] **Prefill events**: Verify `cal:prefill` events are fired when form data is available
- [ ] **Event data**: Verify event details contain expected namespace and method information

## Test Environment Setup

### Required Test Data
- Valid Cal.com booking link: `tlinnecke/45min`
- Test user credentials (if needed for booking)
- Form test data: name, email, company, project

### Browser Tools
- Browser DevTools Network tab (for script loading and API calls)
- Browser DevTools Console (for error monitoring)
- Screen reader software (for accessibility testing)
- Mobile devices (for responsive testing)

## Expected Results

### Success Criteria
1. All CallButton instances open Cal.com modal on click
2. Prerendering improves perceived performance on supported browsers
3. Form data from Contact page properly prefills Cal.com modal
4. Accessibility features work correctly across all test scenarios
5. No performance regressions or privacy issues introduced

### Failure Criteria
1. Modal fails to open or displays errors
2. Prerendering causes performance issues or errors
3. Form data is not prefilled when available
4. Accessibility barriers prevent keyboard or screen reader usage
5. New privacy or security vulnerabilities introduced

## Test Reporting

### Pass/Fail Criteria
- **Pass**: All tests in a category complete successfully
- **Partial**: Some tests pass but critical issues remain
- **Fail**: Critical functionality broken or major accessibility issues

### Bug Reporting Format
For any failed tests, report:
1. Browser and version
2. Steps to reproduce
3. Expected vs actual behavior
4. Error messages (if any)
5. Accessibility impact (if applicable)

## Automation Notes

### Future Automation Opportunities
- E2E tests for modal opening/closing
- Visual regression tests for modal appearance
- Performance monitoring for script loading
- Accessibility automated testing with axe-core

### Manual Testing Justification
- Cal.com modal is a third-party integration requiring visual verification
- Cross-browser compatibility needs manual verification
- Accessibility testing requires human evaluation
- User experience aspects are best judged manually