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
// import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
// import { Text, THEME_CONSTANTS } from '../../../../design-system';
import { useStory } from '../../../app';
// import { ChecklistCard } from '../../checklistCard';

export function storyMissingExcerpt(story) {
  return !story.excerpt?.length;
}

const StoryMissingExcerpt = () => {
  const story = useStory(({ state }) => state);
  return (
    storyMissingExcerpt(story) && null
    // <ChecklistCard
    //   title={__('Add Web Story description', 'web-stories')}
    //   /* titleProps={{ onClick: () => { perform highlight here } }} */
    //   footer={
    //     <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
    //       {__(
    //         'Incorporate a brief description for better user experience',
    //         'web-stories'
    //       )}
    //       {
    //         //  <Link
    //         //   href={'#' /* figure out what this links to */
    //         //   size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
    //         // >
    //         //   {'Learn more'}
    //         // </Link>
    //       }
    //     </Text>
    //   }
    // />
  );
};

export default StoryMissingExcerpt;
