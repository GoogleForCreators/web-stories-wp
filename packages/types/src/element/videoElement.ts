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
 * Internal dependencies
 */
import type { VideoResource } from '../resource';
import type { MediaElement } from './mediaElement';
import type { ElementType } from './element';

export interface VideoTrack {
  id: string;
  track: string;
  trackId?: number;
  kind?: string;
  srclang?: string;
  label?: string;
  needsProxy?: boolean;
}

export interface VideoElement extends MediaElement {
  resource: VideoResource;
  poster?: string;
  tracks?: VideoTrack[];
  loop?: boolean;
  type: ElementType.Video;
}
