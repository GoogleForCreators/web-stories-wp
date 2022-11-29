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
import type { Pattern } from '@googleforcreators/patterns';
import type { StoryAnimation } from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
import type { DefaultBackgroundElement, Element, ElementId } from './element';

export interface Group {
  name: string;
  isLocked: boolean;
  isCollapsed?: boolean;
}

export type Track = {
  track: string;
  trackId: number;
  trackName: string;
  id: string;
  srcLang?: string;
  label?: string;
  kind: string;
};

export type Groups = Record<string, Group>;

export interface Page {
  id: ElementId;
  elements: Element[];
  defaultBackgroundElement?: DefaultBackgroundElement;
  animations?: StoryAnimation[];
  backgroundColor: Pattern;
  groups?: Groups;
  backgroundAudio?: {
    resource: {
      src: string;
      id: number;
      mimeType: string;
    };
    tracks: Track[];
    loop: boolean;
  };
  autoAdvance?: boolean;
  defaultPageDuration?: number;
  pageAttachment?: {
    url: string;
    ctaText: string;
    theme: string;
  };
}
