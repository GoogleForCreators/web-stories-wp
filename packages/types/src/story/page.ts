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
 * Internal dependencies
 */
import type {
  Element,
  Pattern,
  ShapeElement,
  PageAttachment,
  ShoppingAttachmentType,
} from '../element';
import type { Animation } from './animation';

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
export type Advancement = {
  autoAdvance?: boolean;
  pageDuration?: number;
};

export interface Page {
  elements: Element[];
  defaultBackgroundElement?: ShapeElement;
  animations?: Animation[];
  backgroundColor: Pattern;
  type: 'page';
  groups: Groups;
  id: string;
  pageAttachment?: PageAttachment;
  shoppingAttachment?: ShoppingAttachmentType;
  backgroundAudio?: {
    resource: {
      src: string;
      id: number;
      mimeType: string;
    };
    tracks: Track[];
    loop: boolean;
  };
  autoAdvance: boolean;
  defaultPageDuration: number;
}
