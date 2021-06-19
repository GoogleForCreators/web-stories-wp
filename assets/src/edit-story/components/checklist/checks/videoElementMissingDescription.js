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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
/**
 * Internal dependencies
 */
import { Text, THEME_CONSTANTS } from '../../../../design-system';
import { useStory } from '../../../app';
import { ChecklistCard } from '../../checklistCard';
import { filterStoryElements } from '../utils';

export function videoElementMissingDescription(element) {
  return (
    element.type === 'video' &&
    !element.alt?.length &&
    !element.resource?.alt?.length
  );
}

const VideoElementMissingDescription = () => {
  const story = useStory(({ state }) => state);
  const elements = filterStoryElements(story, videoElementMissingDescription);
  return (
    elements.length > 0 && (
      <ChecklistCard
        title={__('Add video description', 'web-stories')}
        footer={
          <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
            {__(
              'Improves indexability and accessibility (for videos without captions)',
              'web-stories'
            )}
            {
              //       <Link
              //         href={'#' /* figure out what this links to */}
              //         size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              //       >
              //         {'Learn more'}
              //       </Link>
            }
          </Text>
        }
        /*
          todo thumbnails for pages
          thumbnailCount={elements.length}
          thumbnail={<>
              {elements.map(() => <Thumbnail onClick={ perform highlight here } />)}
            </>}
        */
      />
    )
  );
};
export default VideoElementMissingDescription;
