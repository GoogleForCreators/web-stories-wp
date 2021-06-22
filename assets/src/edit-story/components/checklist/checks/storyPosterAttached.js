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
import { useStory } from '../../../app/story';
import { hasNoFeaturedMedia } from '../utils';
// import ChecklistCard from '../../../checklistCard';

export function storyHasNoPosterAttached(story) {
  return (
    typeof story.featuredMedia?.url !== 'string' || hasNoFeaturedMedia(story)
  );
}

export function StoryPosterAttached() {
  //@TODO refine this context selector and storyHasNoPosterAttached to run more selectively
  const story = useStory(({ state }) => state);
  return storyHasNoPosterAttached(story)
    ? // <ChecklistCard
      //   title={__('Add Web Story poster image', 'web-stories')}
      //   titleProps={{
      //     onClick: () => {
      //       /* perform highlight here */
      //     },
      //   }}
      //   footer={
      //     <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
      //       <ul>
      //         <li>
      //           {__('Use as a representation of the story.', 'web-stories')}
      //         </li>
      //         <li>{__('Avoid images with embedded text.', 'web-stories')}</li>
      //         <li>
      //           {__("Use an image that's at least 640x853px.", 'web-stories')}
      //         </li>
      //         <li>{__('Maintain a 3:4 aspect ratio.', 'web-stories')}</li>
      //       </ul>
      //       <Link
      //         href={'#' /* figure out what this links to */}
      //         size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
      //       >
      //         {'Learn more'}
      //       </Link>
      //     </Text>
      //   }
      //   cta={
      //     <Button
      //       size={BUTTON_SIZES.SMALL}
      //       type={BUTTON_TYPES.SECONDARY}
      //       onClick={() => {
      //         /* perform highlight here */
      //       }}
      //     >
      //       {__('Upload', 'web-stories')}
      //     </Button>
      //   }
      // />
      null
    : null;
}
