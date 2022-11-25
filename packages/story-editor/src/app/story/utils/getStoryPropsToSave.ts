/*
 * Copyright 2020 Google LLC
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
import { getStoryMarkup } from '@googleforcreators/output';
import type { Page } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import objectPick from '../../../utils/objectPick';
import type { Story, StorySaveData, MetaData } from '../../../types';
import getAllProducts from './getAllProducts';

interface StoryPropsToSave {
  story: Story;
  pages: Page[];
  metadata: MetaData;
  flags: Record<string, boolean>;
}
function getStoryPropsToSave({
  story,
  pages,
  metadata,
  flags,
}: StoryPropsToSave): StorySaveData {
  const { terms, ...propsFromStory } = objectPick(story, [
    'title',
    'status',
    'author',
    'date',
    'modified',
    'slug',
    'excerpt',
    'featuredMedia',
    'publisherLogo',
    'password',
    'currentStoryStyles',
    'globalStoryStyles',
    'autoAdvance',
    'defaultPageDuration',
    'backgroundAudio',
    'terms',
  ]);
  const products = getAllProducts(pages);
  // @todo Remove casting once we have the module.
  const content = getStoryMarkup(story, pages, metadata, flags) as string;
  return {
    content,
    pages,
    ...propsFromStory,
    ...terms,
    products,
  } as StorySaveData;
}

export default getStoryPropsToSave;
