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
/**
 * External dependencies
 */
// import { sprintf, __ } from '@web-stories-wp/i18n';
// import { Text, THEME_CONSTANTS } from '../../../../design-system';
import { useStory } from '../../../app';
// import { ChecklistCard } from '../../checklistCard';
import { filterStoryElements } from '../utils';

const LINK_TAPPABLE_REGION_MIN_WIDTH = 48;
const LINK_TAPPABLE_REGION_MIN_HEIGHT = 48;

export function elementLinkTappableRegionTooSmall(element) {
  if (
    !['text', 'image', 'shape', 'gif', 'video'].includes(element.type) ||
    !element.link?.url?.length
  ) {
    return false;
  }

  return (
    element.width < LINK_TAPPABLE_REGION_MIN_WIDTH ||
    element.height < LINK_TAPPABLE_REGION_MIN_HEIGHT
  );
}

const ElementLinkTappableRegionTooSmall = () => {
  const story = useStory(({ state }) => state);
  const elements = filterStoryElements(
    story,
    elementLinkTappableRegionTooSmall
  );
  return (
    elements.length > 0 && null
    // <ChecklistCard
    //   title={sprintf(
    //     /* translators: %s: minimum tappable region size width x minimum tappable region size height. */
    //     __('Increase tap area size to at least %s', 'web-stories'),
    //     `${LINK_TAPPABLE_REGION_MIN_WIDTH}x${LINK_TAPPABLE_REGION_MIN_HEIGHT}px`
    //   )}
    //   /* titleProps={{ onClick: () => { perform highlight here } }} */
    //   footer={
    //     <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
    //       {__(
    //         'Make the linked element large enough for users to easily tap it',
    //         'web-stories'
    //       )}
    //       {
    //         //       <Link
    //         //         href={'#' /* figure out what this links to */}
    //         //         size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
    //         //       >
    //         //         {'Learn more'}
    //         //       </Link>
    //       }
    //     </Text>
    //   }
    //   /*
    //     todo thumbnails for pages
    //     thumbnailCount={elements.length}
    //     thumbnail={<>
    //         {elements.map(() => <Thumbnail />)}
    //       </>}
    //   */
    // />
  );
};

export default ElementLinkTappableRegionTooSmall;
