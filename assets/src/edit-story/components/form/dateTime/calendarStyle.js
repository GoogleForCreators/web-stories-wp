// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable header/header */
/* Disable reason: This file is based on Gutenberg Datepicker */

/**
 * External dependencies
 */
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
.components-datetime__time-am-button.is-toggled,
.components-datetime__time-pm-button.is-toggled {
  background: #edeff0;
  border-color: #8f98a1;
  box-shadow: inset 0 2px 5px -3px #555d66;
}
.components-button {
  display: inline-flex;
  text-decoration: none;
  font-size: 13px;
  margin: 0;
  border: 0;
  cursor: pointer;
  transition: box-shadow 0.1s linear;
  padding: 0 10px;
  line-height: 2;
  height: 28px;
  border-radius: 3px;
  white-space: nowrap;
  border-width: 1px;
  border-style: solid;
  color: rgb(0, 117, 175);
  border-color: rgb(0, 117, 175);
  background: #f3f5f6;
}

.components-button:focus:not(:disabled) {
    outline: 2px solid transparent;
}

.components-button:focus:enabled {
    background: #f3f5f6;
    color: rgb(0, 93, 140);
    border-color: rgb(0, 118, 177);
    box-shadow: 0 0 0 1px rgb(0, 118, 177);
    text-decoration: none;
}

.components-datetime__time-pm-button {
  margin-left: -1px;
  border-radius: 0 3px 3px 0;
}
.components-datetime__time-am-button {
  margin-left: 8px;
  margin-right: -1px;
  border-radius: 3px 0 0 3px;
}

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
  background: #e14d43; }
body.admin-color-ectoplasm .CalendarDay__selected {
  background: #a7b656; }
body.admin-color-coffee .CalendarDay__selected {
  background: #c2a68c; }
body.admin-color-blue .CalendarDay__selected {
  background: #82b4cb; }
body.admin-color-light .CalendarDay__selected {
  background: #0085ba; }
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
  outline: 2px solid transparent; }
.DayPicker_weekHeader {
  top: 50px; }
.components-datetime__date.is-description-visible .DayPicker,
.components-datetime__date.is-description-visible .components-datetime__date-help-button {
  visibility: hidden; }
`;
