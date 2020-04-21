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
