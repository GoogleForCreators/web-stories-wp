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

// Temporary workaround while this package is not fully converted yet.
// Adjust tsconfig.json and "types" field in package.json and then
// delete this file once complete.

/**
 * External dependencies
 */
import type { Page, Story as FullStory } from '@googleforcreators/elements';

export type Story = Pick<
  FullStory,
  | 'featuredMedia'
  | 'link'
  | 'title'
  | 'fonts'
  | 'autoAdvance'
  | 'defaultPageDuration'
  | 'backgroundAudio'
  | 'publisherLogo'
>;

export interface StoryMetadata {
  publisher?: string;
}

export declare function getStoryMarkup(
  story: Story,
  pages: Page[],
  metadata: StoryMetadata,
  flags: Record<string, boolean>
): string;

export * from './utils/populateElementFontData';
