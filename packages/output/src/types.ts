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
import type { ResourcePropTypes } from '@googleforcreators/media';
import type { Animation, Element, ProductElement } from '@googleforcreators/types';

interface BackgroundAudioPropType {
  id: number,
  src: string,
  length: number,
  lengthFormatted: string,
  mimeType: string,
  needsProxy: boolean,
};
interface BackgroundAudioTyping {
  loop: boolean,
  resource: BackgroundAudioPropType,
  tracks: ResourcePropTypes[],
}
export interface BackgroundAudioType {
  backgroundAudio: BackgroundAudioTyping,
  id: string,
}
export interface GetAutoAdvanceAfterTyping {
  animations: Animation[],
  defaultPageDuration: number,
  elements: Element[],
  backgroundAudio: BackgroundAudioTyping,
  id: number
}
export interface PreloadResource {
  url: string,
  type: string ,
}
export interface OutputElementTyping {
  element: Element,
  flags: {},
}
export interface ShoppingAttachmentType {
  products: ProductElement,
  ctaText: string,
  theme: string,
}