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

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined;

export type Settings = {
  dateFormat: string;
  timeFormat: string;
  gmtOffset: number;
  timezone: string;
  timezoneAbbr: string;
  weekStartsOn: WeekdayIndex;
  locale?: string;
  months?: string[];
  monthsShort?: string[];
  weekdays?: string[];
  weekdaysShort?: string[];
  weekdaysInitials?: string[];
};
