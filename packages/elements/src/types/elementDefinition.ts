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
import type {
  GifResource,
  ImageResource,
  Resource,
  VideoResource,
  ResourceId,
} from '@googleforcreators/media';
import type { RefObject, VoidFunctionComponent } from 'react';
import type { Pattern } from '@googleforcreators/patterns';

/**
 * Internal dependencies
 */
import type { Element, ElementId, GifElement, VideoElement } from './element';
import type { ElementType } from './elementType';
import type { FontData, FontStyle, FontWeight } from './data';

interface FontConfig {
  fontStyle: FontStyle;
  fontWeight: FontWeight;
  content: string;
  font: FontData;
}

export interface EditProps<E extends Element> {
  element: E;
  box: ElementBox;
  editWrapper?: HTMLElement;
  onResize: () => void;
  setLocalProperties: (properties: Partial<E>) => void;
  getProxiedUrl: (
    resource: Pick<Resource, 'needsProxy'>,
    src?: string
  ) => string | null;
  isRTL: boolean;
  isTrimMode: boolean;
  topOffset: number;
  resource?: E extends VideoElement
    ? VideoResource
    : E extends GifElement
      ? GifResource
      : ImageResource;
  setVideoNode: (node: HTMLVideoElement) => void;
  updateElementById: (update: {
    elementId: ElementId;
    properties: Partial<E>;
  }) => void;
  deleteSelectedElements: () => void;
  maybeEnqueueFontStyle: (fonts: FontConfig[]) => Promise<boolean>;
  zIndexCanvas: Record<string, number>;
  scaleMin: number;
  scaleMax: number;
}

interface EditingState {
  hasEditMenu?: boolean;
  showOverflow?: boolean;
  selectAll?: boolean;
  offset?: number;
}

export interface FrameProps<E extends Element> {
  wrapperRef: RefObject<HTMLElement>;
  element: E;
  box: ElementBox;
  isOnlySelectedElement: boolean;
  setEditingElementWithState: (id: string, state: EditingState) => void;
}

export interface OutputProps<E extends Element> {
  element: E;
  box: ElementBox;
  flags: Record<string, boolean>;
}

export interface LayerIconProps<E extends Element> {
  element: E;
  getProxiedUrl: (
    resource: Pick<Resource, 'needsProxy'>,
    src?: string
  ) => string | null;
  currentPageBackgroundColor: Pattern;
  // Only provided for videos.
  showVideoPreviewAsBackup?: boolean;
}

export type LayerTextFunction<E> = (element: E) => string;
export type TextContentFunction<E> = (element: E) => string;

export interface DisplayProps<E extends Element> {
  element: E;
  previewMode: boolean;
  box: ElementBox;
  getProxiedUrl: (
    resource: Pick<Resource, 'needsProxy'>,
    src?: string
  ) => string | null;
  isCurrentResourceProcessing?: (resourceId: ResourceId) => boolean;
  isCurrentResourceUploading?: (resourceId: ResourceId) => boolean;
  maybeEnqueueFontStyle: (fonts: FontConfig[]) => Promise<boolean>;
  siblingCount: number;
  renderResourcePlaceholder: (args: {
    blurHash?: string;
    baseColor?: string;
  }) => void;
  cdnUrl: string;
}

export type Direction = [0 | 1, 0 | 1];

export interface ElementDefinition<E extends Element = Element> {
  type: ElementType;
  name: string;
  isMedia?: boolean;
  getLayerText: LayerTextFunction<E>;
  defaultAttributes: Partial<E>;
  // Only text & media elements have an edit mode.
  Edit?: VoidFunctionComponent<EditProps<E>>;
  Frame?: VoidFunctionComponent<FrameProps<E>>;
  Output: VoidFunctionComponent<OutputProps<E>>;
  LayerIcon: VoidFunctionComponent<LayerIconProps<E>>;
  // TODO: Make mandatory? Used for copy/pasting.
  TextContent?: TextContentFunction<E>;
  Display: VoidFunctionComponent<DisplayProps<E>>;
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
    element: E,
    direction: Direction,
    newWidth: number,
    newHeight: number
  ) => { height: number };
}

export type ElementTypes<E extends Element = Element> = Record<
  E['type'],
  ElementDefinition<E>
>;
