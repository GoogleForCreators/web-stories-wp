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
import type { Element, ElementId } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import type { HighlightType } from '../app/highlights/states';

export interface selectElementProps {
  elements?: Element[];
  elementId?: ElementId;
  pageId?: string;
}

export interface setHighlightProps {
  elements?: Element[];
  elementId?: ElementId;
  pageId?: string;
  highlight?: HighlightType;
}

export type Highlight = {
  focus: boolean;
  showEffect?: boolean;
  tab?: string;
  section?: string;
};
export type HighlightState = {
  [k in HighlightType]?: Highlight;
};

export interface HighlightsState extends HighlightState {
  tab?: string;
  section?: string;
}

export interface HighlightProviderState {
  cancelEffect: (stateKey: HighlightType) => void;
  onFocusOut: () => void;
  setHighlights: (highlights: setHighlightProps) => void;
}
