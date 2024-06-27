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
  Element,
  ElementId,
  FontData,
  FontStyle,
  FontWeight,
  GifElement,
  VideoElement,
} from '@googleforcreators/elements';
import type {
  GifResource,
  ImageResource,
  Resource,
  ResourceId,
  VideoResource,
} from '@googleforcreators/media';
import type { RefObject } from 'react';
import type { EditingState } from '@googleforcreators/rich-text';
import type { Pattern } from '@googleforcreators/patterns';

interface FontConfig {
  fontStyle: FontStyle;
  fontWeight: FontWeight;
  content: string;
  font: FontData;
}

export interface EditProps<T extends Element = Element> {
  element: T;
  box: ElementBox;
  editWrapper?: HTMLElement;
  onResize: () => void;
  setLocalProperties: (properties: Partial<T>) => void;
  getProxiedUrl: (
    resource: Pick<Resource, 'needsProxy'>,
    src?: string
  ) => string | null;
  isRTL: boolean;
  isTrimMode: boolean;
  topOffset: number;
  resource?: T extends VideoElement
    ? VideoResource
    : T extends GifElement
      ? GifResource
      : ImageResource;
  setVideoNode: (node: HTMLVideoElement) => void;
  updateElementById: (update: {
    elementId: ElementId;
    properties: Partial<T>;
  }) => void;
  deleteSelectedElements: () => void;
  maybeEnqueueFontStyle: (fonts: FontConfig[]) => Promise<boolean>;
  zIndexCanvas: Record<string, number>;
  scaleMin: number;
  scaleMax: number;
}

export interface DisplayProps<T = Element> {
  element: T;
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
}

export interface FrameProps<T = Element> {
  wrapperRef: RefObject<HTMLElement>;
  element: T;
  box: ElementBox;
  isOnlySelectedElement: boolean;
  setEditingElementWithState: (id: string, state: EditingState) => void;
}

export interface OutputProps<T = Element> {
  element: T;
  flags: Record<string, boolean>;
  box: ElementBox;
}

export interface LayerIconProps<T = Element> {
  element: T;
  getProxiedUrl: (
    resource: Pick<Resource, 'needsProxy'>,
    src?: string
  ) => string | null;
  currentPageBackgroundColor: Pattern;
  // Only provided for videos.
  showVideoPreviewAsBackup?: boolean;
}
