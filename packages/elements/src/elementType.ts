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

interface BaseDefinition {
  type: string;
  name: string;
  defaultAttributes: Record<string, unknown>;
}

export interface PageElementDefinition extends BaseDefinition {
  type: 'page';
  defaultAttributes: Record<string, never>;
}

export interface ElementDefinition extends BaseDefinition {
  type: ElementType;
  name: string;
  defaultAttributes: Record<string, unknown>;
  Display: FunctionComponent;
  Edit: FunctionComponent;
  Frame: FunctionComponent;
  Output: FunctionComponent;
  TextContent: FunctionComponent;
  canFlip: boolean;
  isMedia: boolean;
  isMaskable: boolean;
  isAspectAlwaysLocked: boolean;
  hasDesignMenu: boolean;
  hasDuplicateMenu: boolean;
  hasEditMode: boolean;
  hasEditModeIfLocked: boolean;
  hasEditModeMoveable: boolean;
  editModeGrayout: boolean;
  resizeRules: {
    vertical: boolean;
    horizontal: boolean;
    diagonal: boolean;
    minWidth: number;
    minHeight: number;
  };
  panels: string[];
  getLayerText: (element: Element) => string;
  onDropHandler?: (dropTargetId: string) => void;
}

export type ElementTypeDefinition = PageElementDefinition | ElementDefinition;

// @todo Create a custom hook to manage state.

const elementTypes: Record<string, ElementTypeDefinition> = {};

function registerElementType(elementType: ElementTypeDefinition) {
  elementTypes[elementType.type] = elementType;
}

export { registerElementType, elementTypes };
