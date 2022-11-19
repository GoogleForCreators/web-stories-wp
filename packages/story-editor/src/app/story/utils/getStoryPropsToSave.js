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

/**
 * Internal dependencies
 */
import objectPick from '../../../utils/objectPick';
import getAllProducts from './getAllProducts';
import { cleanElementFontProperties } from './cleanElementFontProperties';
import { getStoryFontsFromPages } from './getStoryFontsFromPages';

function getStoryPropsToSave({ story, pages, metadata, flags }) {
  const { terms, fonts, ...propsFromStory } = objectPick(story, [
    'title',
    'fonts',
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

  // pull story fonts from pages / elements
  const cleandFonts = getStoryFontsFromPages(pages);
  const cleanedPages = cleanElementFontProperties(pages);
  const products = getAllProducts(cleanedPages);
  const content = getStoryMarkup(
    { ...story, fonts: cleandFonts },
    cleanedPages,
    metadata,
    flags
  );

  return {
    content,
    pages: cleanedPages,
    ...propsFromStory,
    fonts: cleandFonts,
    ...terms,
    products,
  };
}

export default getStoryPropsToSave;
