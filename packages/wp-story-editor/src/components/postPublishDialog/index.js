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
import { useCallback, useEffect, useState } from '@googleforcreators/react';
import { __, TranslateWithMarkup } from '@googleforcreators/i18n';
import { trackClick } from '@googleforcreators/tracking';
import { Link, Text, THEME_CONSTANTS } from '@googleforcreators/design-system';
import { Dialog, useStory } from '@googleforcreators/story-editor';

function PostPublishDialog() {
  const {
    embedPostLink: confirmURL,
    link: storyURL,
    isFreshlyPublished,
  } = useStory(
    ({
      state: {
        story: { embedPostLink, link },
        meta: { isFreshlyPublished },
      },
    }) => ({
      embedPostLink,
      link,
      isFreshlyPublished,
    })
  );

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setIsOpen(Boolean(isFreshlyPublished)), [isFreshlyPublished]);

  const onAddToPostClick = useCallback((evt) => {
    trackClick(evt, 'add_story_to_new_post');
  }, []);

  const onViewStoryClick = useCallback((evt) => {
    trackClick(evt, 'view_story');
  }, []);
  const onClose = useCallback(() => setIsOpen(false), []);

  const primaryText = confirmURL ? __('Add to new post', 'web-stories') : '';

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      // Same as item_published post type label.
      title={__('Story published.', 'web-stories')}
      secondaryText={__('Dismiss', 'web-stories')}
      primaryText={primaryText}
      onPrimary={onAddToPostClick}
      primaryRest={{ href: confirmURL }}
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        <TranslateWithMarkup
          mapping={{
            a: (
              <Link
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                href={storyURL}
                target="_blank"
                onClick={onViewStoryClick}
              />
            ),
          }}
        >
          {__(
            'Your story has been successfully published! <a>View story</a>.',
            'web-stories'
          )}
        </TranslateWithMarkup>
      </Text>
      {confirmURL && (
        <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {
            /* translators: 'it' refers to a web story. */
            __('Would you like to include it on a new post?', 'web-stories')
          }
        </Text>
      )}
    </Dialog>
  );
}

export default PostPublishDialog;
