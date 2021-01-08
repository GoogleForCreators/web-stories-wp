/*
 * Copyright 2020 Google LLC
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
 * Internal dependencies
 */
import { dark as darkMode, light as lightMode } from './colors';
import { THEME_CONSTANTS } from './constants';
import * as ThemeGlobals from './global';
import * as themeHelpers from './helpers';
import { typography } from './typography';
import { borders } from './borders';

export const theme = {
  borders,
  typography,
  colors: { ...darkMode },
};

export { lightMode, THEME_CONSTANTS, themeHelpers, ThemeGlobals };
