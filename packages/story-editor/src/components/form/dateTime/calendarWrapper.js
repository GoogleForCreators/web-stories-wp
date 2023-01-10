/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies
 */
import styled from 'styled-components';
import {
  themeHelpers,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';

// Modified from react-calendar/dist/Calendar.css
const CalendarWrapper = styled.div`
  min-height: 236px;

  .react-calendar {
    width: 350px;
    max-width: 100%;
    background-color: ${({ theme }) => theme.colors.bg.primary};
    ${({ theme }) =>
      themeHelpers.expandPresetStyles({
        preset: theme.typography.presets.label[TextSize.Small],
        theme,
      })}
    color: ${({ theme }) => theme.colors.fg.primary};
  }

  .react-calendar,
  .react-calendar *,
  .react-calendar *:before,
  .react-calendar *:after {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .react-calendar button {
    margin: 0;
    border: 0;
    outline: none;
    ${({ theme }) =>
      themeHelpers.expandPresetStyles({
        preset: theme.typography.presets.label[TextSize.Small],
        theme,
      })}
    color: ${({ theme }) => theme.colors.fg.primary};

    &:enabled:hover {
      cursor: pointer;
    }
  }

  .react-calendar__navigation {
    display: flex;
    height: 44px;
    margin-bottom: 1em;

    button {
      min-width: 44px;
      background: none;
      color: ${({ theme }) => theme.colors.fg.secondary};

      &:disabled {
        background-color: transparent;
      }

      &:enabled:hover,
      &:enabled:focus {
        background-color: ${({ theme }) => theme.colors.bg.secondary};
        color: ${({ theme }) => theme.colors.fg.primary};
      }
    }
  }

  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 10px;
  }

  .react-calendar__month-view__weekdays__weekday {
    padding: 0.5em;
  }

  .react-calendar .react-calendar__month-view__days__day--weekend {
    color: ${({ theme }) => theme.colors.fg.secondary};
  }

  .react-calendar .react-calendar__month-view__days__day--neighboringMonth {
    color: ${({ theme }) => theme.colors.fg.tertiary};
  }

  .react-calendar__year-view .react-calendar__tile,
  .react-calendar__decade-view .react-calendar__tile,
  .react-calendar__century-view .react-calendar__tile {
    padding: 1.2em 0.5em;
  }

  .react-calendar__tile {
    max-width: 100%;
    padding: 10px 6.6667px;
    background: none;
    text-align: center;
    line-height: 16px;

    &:disabled {
      background-color: ${({ theme }) => theme.colors.bg.tertiary};
    }

    &:enabled:hover,
    &:enabled:focus {
      background-color: ${({ theme }) =>
        theme.colors.interactiveBg.tertiaryHover};
      color: ${({ theme }) => theme.colors.interactiveFg.active};
    }
  }

  .react-calendar button.react-calendar__tile--now {
    background: ${({ theme }) => theme.colors.bg.tertiary};
    color: ${({ theme }) => theme.colors.fg.primary};

    &:enabled:hover,
    &:enabled:focus {
      background-color: ${({ theme }) =>
        theme.colors.interactiveBg.secondaryHover};
      color: ${({ theme }) => theme.colors.interactiveFg.active};
    }
  }

  .react-calendar button.react-calendar__tile--active,
  .react-calendar button.react-calendar__tile--hasActive {
    background: ${({ theme }) => theme.colors.interactiveBg.brandNormal};
    color: ${({ theme }) => theme.colors.interactiveFg.brandNormal};

    &:enabled:hover,
    &:enabled:focus {
      background-color: ${({ theme }) => theme.colors.interactiveBg.brandHover};
      color: ${({ theme }) => theme.colors.interactiveFg.brandHover};
    }
  }
`;

export default CalendarWrapper;
