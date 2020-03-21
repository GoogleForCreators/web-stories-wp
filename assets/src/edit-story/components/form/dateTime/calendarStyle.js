// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable header/header */
/* Disable reason: This file is based on Gutenberg Datepicker */

/**
 * External dependencies
 */
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
.CalendarMonth_caption {
  font-size: 13px;
}
.CalendarDay {
  font-size: 13px;
  border: 1px solid transparent;
  border-radius: 50%;
  text-align: center;
}
.CalendarDay__default:hover {
  border: 1px solid transparent;
}
.CalendarDay__selected {
  background: #0085ba;
}
.CalendarDay__selected:hover {
  background: rgb(0, 113, 158);
}
body.admin-color-sunrise .CalendarDay__selected {
  background: #d1864a;
}
body.admin-color-ocean .CalendarDay__selected {
  background: #a3b9a2;
}
body.admin-color-midnight .CalendarDay__selected {
  background: #e14d43;
}
body.admin-color-ectoplasm .CalendarDay__selected {
  background: #a7b656;
}
body.admin-color-coffee .CalendarDay__selected {
  background: #c2a68c;
}
body.admin-color-blue .CalendarDay__selected {
  background: #82b4cb;
}
body.admin-color-light .CalendarDay__selected {
  background: #0085ba;
}
body.admin-color-sunrise .CalendarDay__selected:hover {
  background: rgb(178, 114, 63);
}
body.admin-color-ocean .CalendarDay__selected:hover {
  background: rgb(139, 157, 138);
}
body.admin-color-midnight .CalendarDay__selected:hover {
  background: rgb(191, 65, 57);
}
body.admin-color-ectoplasm .CalendarDay__selected:hover {
  background: rgb(142, 155, 73);
}
body.admin-color-coffee .CalendarDay__selected:hover {
  background: rgb(165, 141, 119);
}
body.admin-color-blue .CalendarDay__selected:hover {
  background: rgb(111, 153, 173);
}
body.admin-color-light .CalendarDay__selected:hover {
  background: rgb(0, 113, 158);
}
.DayPickerNavigation_button__horizontalDefault {
  padding: 2px 8px;
  top: 20px; }
.DayPickerNavigation_button__horizontalDefault:focus {
  color: #191e23;
  border-color: #007cba;
  box-shadow: 0 0 0 1px #007cba;
  outline: 2px solid transparent;
}
.DayPicker_weekHeader {
  top: 50px;
}
.components-datetime__date.is-description-visible .DayPicker {
  visibility: hidden;
}
`;
