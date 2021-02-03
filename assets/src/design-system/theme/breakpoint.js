/*
 * Copyright 2021 Google LLC
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
export const raw = {
  desktop: 1121,
  tablet: 801,
  mobile: 800,
  mobileSmall: 684,
  min: 684,
};

export const breakpoint = {
  desktop: `screen and (min-width: ${raw.desktop}px)`,
  tablet: `screen and (min-width: ${raw.tablet}px)`,
  mobile: `screen and (max-width: ${raw.mobile}px)`,
  mobileSmall: `screen and (max-width: ${raw.mobileSmall}px)`,
  min: `screen and (max-width: ${raw.min}px)`,
};
