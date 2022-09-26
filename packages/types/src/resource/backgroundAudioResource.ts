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
/* eslint-disable no-restricted-imports -- Still used by other packages. */
import type { Requireable } from 'prop-types';
/* eslint-enable no-restricted-imports -- Still used by other packages. */

export interface BackgroundAudioResource {
  id: number;
  src: string;
  length: number;
  lengthFormatted: string;
  mimeType: string;
  needsProxy: boolean;
}
export interface BackgroundAudio {
  loop: boolean;
  resource: BackgroundAudioResource;
  tracks: Record<string, Requireable<unknown>>[];
  id: string;
}
