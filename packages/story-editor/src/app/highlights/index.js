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
import { OUTLINE, FLASH } from './styles';

export { default as useHighlights } from './useHighlights';
export { default as useFocusHighlight } from './useFocusHighlight';
export { default as HighlightsProvider } from './provider';
export { default as states } from './states';

export const styles = {
  OUTLINE,
  FLASH,
};
