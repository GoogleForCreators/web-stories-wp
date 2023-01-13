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
import type { ElementBox } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import type { Element } from './element';
import type { ElementType } from './elementType';

export interface EditProps<E extends Element> {
  element: E;
  box: ElementBox;
  setLocalProperties: () => void;
  getProxiedUrl: () => string;
  updateElementById: () => void;
  zIndexCanvas: number;
  scaleMin: number;
  scaleMax: number;
}

export interface FrameProps<E extends Element> {
  element: E;
}

export interface OutputProps<E extends Element> {
  element: E;
  box: ElementBox;
  flags: Record<string, boolean>;
}

export interface LayerIconProps<E extends Element> {
  element: E;
}

export interface TextContentProps<E extends Element> {
  element: E;
  box: ElementBox;
  previewMode?: boolean;
  renderResourcePlaceholder?: boolean;
}

export interface DisplayProps<E extends Element> {
  element: E;
}

export type Direction = [0 | 1, 0 | 1];

export interface ElementDefinition<E extends Element = Element> {
  type: ElementType;
  name: string;
  isMedia?: boolean;
  getLayerText: (element: E) => string;
  defaultAttributes: Partial<E>;
  Edit: React.VoidFunctionComponent<EditProps<E>>;
  Frame: React.VoidFunctionComponent<FrameProps<E>>;
  Output: React.VoidFunctionComponent<OutputProps<E>>;
  LayerIcon: React.VoidFunctionComponent<LayerIconProps<E>>;
  TextContent: (element: E) => string;
  Display: React.VoidFunctionComponent<DisplayProps<E>>;
  canFlip: boolean;
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
  updateForResizeEvent?: (
    element: Element,
    direction: Direction,
    newWidth: number,
    newHeight: number
  ) => { height: number };
}

export type ElementTypes = Record<ElementType, ElementDefinition<Element>>;
