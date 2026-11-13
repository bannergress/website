# UI elements and conventions

This reference describes the shared controls and conventions of the Bannergress
frontend. Use it alongside the existing components and their adjacent SCSS.
It is a guide for extending the interface, not a requirement to restyle every
existing page when making a focused change.

## Theme and layout

- The application uses Ant Design's dark and compact themes, configured in
  `src/App.tsx`.
- Shared color tokens are in `src/assets/stylesheets/base/_variables.scss`.
  Reuse `var(--color-...)` tokens instead of adding hardcoded colors per page.
- Responsive mixins are in `src/assets/stylesheets/base/_mixins.scss`: `xs`
  at 480px, `md` at 880px, and `xl` at 1200px. Reuse these breakpoints.
- Let labels and groups wrap on narrow screens. Avoid fixed button widths that
  clip translated text or force horizontal scrolling.
- Put component styling beside its implementation. Keep spacing specific to a
  page or domain wrapper out of shared primitive styles.

## Choosing among a few named options

Use [`ChoiceButtons`](src/components/choice-buttons/ChoiceButtons.tsx) for
compact, mutually exclusive choices. The selected value is controlled by the
caller; the component has no persistence or domain logic.

[`ChoiceButton`](src/components/choice-buttons/ChoiceButton.tsx) supplies the same
appearance for individual controls, including asynchronous list-status actions
and boolean switches. Its native button props include disabled and ARIA state.
The common styles live in
[`_choice-button.scss`](src/components/choice-buttons/_choice-button.scss),
which is also used for Ant Design tab buttons. Navigation links use the
`choice-button` class and `aria-current="page"` for their active destination.

Current uses:

| Context            | Choices                                                                                        | State owner                               |
| ------------------ | ---------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Browse places      | Name A–Z / Most banners                                                                        | Browse, independently per hierarchy depth |
| Arrange missions   | Manual / Automatic                                                                             | Banner creation form                      |
| Banner type        | Banner / Collection                                                                            | Banner creation form                      |
| Banner sorting     | Date / Title / Length / Mission count / Distance, with optional relevance and list-added order | Calling page's banner filter              |
| Mobile banner view | Info / Missions / Map                                                                          | Banner details or preview                 |

The filter modal uses `ChoiceButtons` for sorting. Clicking the selected sort
again reverses direction where supported; keep the direction arrow in the label.
Distance sorting still obtains location before applying the new order.
Boolean filters use `Switch`: a labelled native button with `role="switch"`,
`aria-checked`, and translated On/Off text, sharing the choice button appearance.
Offline and unofficial filters remain independent of each other and sorting.

List-status controls share the button appearance while retaining their status
colors, deselection behavior, confirmation, disabled saving state, and errors.
Desktop Info/Missions tabs retain Ant Design's tab semantics and keyboard
navigation. Mobile view buttons use the normal choice-button group semantics.

Example:

```tsx
<ChoiceButtons
  value={order}
  onChange={onOrderChanged}
  label={t('places.sort.label')}
  options={[
    { value: 'name', label: t('places.sort.name') },
    { value: 'numberOfBanners', label: t('places.sort.numberOfBanners') },
  ]}
/>
```

When a visible heading labels the control, give it a unique ID with React
`useId()` and pass that ID as `labelledBy` instead of repeating its text in
`label`. Supply one of these accessible naming mechanisms for every group.
Use a stable string value for each option and translate its displayed label.

Shared appearance is defined in
[`ChoiceButtons.scss`](src/components/choice-buttons/ChoiceButtons.scss):

| Property         | Value                                                                         |
| ---------------- | ----------------------------------------------------------------------------- |
| Layout           | Flex row with wrapping and a 6px gap                                          |
| Font size        | 16px, matching page text even inside compact Ant Design containers            |
| Target height    | At least 44px                                                                 |
| Padding / radius | 6px 10px / 4px                                                                |
| Normal           | Light-black background, gray 1px border, light text                           |
| Selected         | Dark-gray background, white border, bold text, 3px accent inset at the bottom |
| Keyboard focus   | White 2px outline with a 2px offset                                           |

Each option is a native `button` with `type="button"` and `aria-pressed`.
The container has `role="group"`. Tab moves between buttons; native Enter and
Space activate them. These are toggle buttons, not radio inputs: do not add
radio roles or promise arrow-key navigation without implementing it.
Buttons inside forms must never submit the form when switching options.

Reuse the component instead of duplicating its CSS or styling Ant Design's
internal radio markup. Keep domain spacing in wrappers such as
`PlaceOrderChooser`. Do not reuse choice styling for submit or destructive
actions.

## Preference scope

State ownership is part of the control's behavior, not its visual design.
Form choices update the current banner draft through existing callbacks.
Do not persist them globally just because Browse persists its sort choices.

Browse stores sort choices in local storage under `placeSortOrders`. Level 0
is the country list; successive depths represent the displayed administrative
hierarchy. Each depth keeps its own choice. Before an explicit choice, countries
use descending banner count and deeper levels use alphabetical order.

Desktop and mobile share the choice at the same depth. On mobile, display the
control only inside an expanded place section and keep the "All" choice before
the sorted places. Updating an ancestor's sort order does not change a child
list's order or any banner filters. Compare names using the interface locale;
break banner-count ties alphabetically. Never mutate Redux arrays while sorting.

## Other controls

| Element                | Existing implementation / convention                                                                                                               |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Boolean on/off setting | `src/components/switch/Switch.tsx`; shared choice appearance, On/Off text, `role="switch"`, `aria-checked`, and a visible heading via `labelledBy` |
| Text and numbers       | Ant Design `Input`, `Input.TextArea`, and `InputNumber`; retain field labels and validation                                                        |
| Numeric range          | Ant Design `Slider`, for example banner width in `AdvancedOptions`                                                                                 |
| Date input             | `src/components/date-picker/DatePicker.tsx`; preserve the native-picker fallback and empty state                                                   |
| Action button          | Native `button` or Ant Design `Button`; use an explicit type in forms and a clear verb                                                             |
| Primary flow action    | Follow the existing `positive-action-button` styling, for example Review in banner creation                                                        |
| Contextual help        | Ant Design `Tooltip` with the existing help icon; prefer a focusable button when help must be keyboard accessible                                  |
| Loading state          | Existing loading components or local indicators; preserve the current selection while work runs                                                    |
| Form issues            | `src/components/Issues-list`; retain the existing validation and field association                                                                 |
| Place navigation       | Desktop `PlaceList` and mobile `PlaceAccordion`; keep behavior consistent across viewport changes                                                  |

## Accessibility, text, and verification

- Use links for navigation and buttons for actions. Give icon-only actions an
  accessible name and keep keyboard focus visible.
- Keep selected state understandable through more than color: choice buttons
  also use weight, border, an accent, and `aria-pressed`.
- Translate labels and help in `src/locales/en`, `de`, and `es`. Keep business
  values such as `sequential`, `anyOrder`, and `numberOfBanners` separate from
  displayed text.
- Check narrow layouts and longer translations. Keep existing tooltips, loading
  indicators, permissions, and validation when replacing a control.
- For behavior changes, verify callbacks and selection, accessible naming,
  accidental form submission, and preference independence where relevant.
  Existing Browse integration tests cover shared desktop/mobile sort behavior.
- Run code lint, style lint for changed SCSS, applicable tests, and the build.
