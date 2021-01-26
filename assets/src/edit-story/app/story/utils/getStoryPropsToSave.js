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
 * Internal dependencies
 */
import objectPick from '../../../utils/objectPick';
import getStoryMarkup from '../../../output/utils/getStoryMarkup';

function getStoryPropsToSave({ story, pages, metadata, flags }) {
  const propsFromStory = objectPick(story, [
    'title',
    'status',
    'author',
    'date',
    'modified',
    'slug',
    'excerpt',
    'featuredMedia',
    'password',
    'publisherLogo',
    'currentStoryStyles',
    'globalStoryStyles',
    'autoAdvance',
    'defaultPageDuration',
  ]);

  const content = getStoryMarkup(story, pages, metadata, flags);
  return {
    content,
    pages,
    ...propsFromStory,
  };
}

export default getStoryPropsToSave;
