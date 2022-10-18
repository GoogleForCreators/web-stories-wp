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

/**
 * External dependencies
 */
import type { ElementType, Element } from '@googleforcreators/types';
import type { FunctionComponent } from 'react';

export interface ElementDefinition {
  type: ElementType;
  name: string;
  defaultAttributes: Record<string, unknown>;
  Display: FunctionComponent;
  Edit: FunctionComponent;
  Frame: FunctionComponent;
  Output: FunctionComponent;
  canFlip: boolean;
  isMedia: boolean;
  isMaskable: boolean;
  hasDesignMenu: boolean;
  hasDuplicateMenu: boolean;
  hasEditMode: boolean;
  hasEditModeIfLocked: boolean;
  resizeRules: {
    vertical: boolean;
    horizontal: boolean;
    diagonal: boolean;
    minWidth: number;
    minHeight: number;
  };
  getLayerText: (element: Element) => string;
}

// @todo Create a custom hook to manage state.

const elementTypes: Record<string, ElementDefinition> = {};

function registerElementType(elementType: ElementDefinition) {
  elementTypes[elementType.type] = elementType;
}

export { registerElementType, elementTypes };
