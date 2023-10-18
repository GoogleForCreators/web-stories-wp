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
import {
  ButtonAsLink,
  Link,
  Text,
  TextSize,
} from '@googleforcreators/design-system';
import { Dialog, useStory } from '@googleforcreators/story-editor';

function PostPublishDialog() {
  const {
    embedPostLink: confirmURL,
    link: storyURL,
    isFreshlyPublished,
    status,
  } = useStory(
    ({
      state: {
        story: { embedPostLink, link, status },
        meta: { isFreshlyPublished },
      },
    }) => ({
      embedPostLink,
      link,
      isFreshlyPublished,
      status,
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

  const dialogTitle =
    status === 'private'
      ? __('Story published privately.', 'web-stories')
      : status === 'future'
      ? __('Story scheduled.', 'web-stories')
      : __('Story published.', 'web-stories');

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      // Same as item_published post type label.
      title={dialogTitle}
      secondaryText={__('Dismiss', 'web-stories')}
      primaryText={primaryText}
      onPrimary={onAddToPostClick}
      PrimaryComponent={ButtonAsLink}
      primaryRest={{ href: confirmURL }}
    >
      <Text.Paragraph size={TextSize.Small}>
        <TranslateWithMarkup
          mapping={{
            a: (
              <Link
                size={TextSize.Small}
                href={storyURL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onViewStoryClick}
              />
            ),
          }}
        >
          {status === 'future'
            ? __(
                'Your story has been successfully scheduled! <a>View story</a>.',
                'web-stories'
              )
            : __(
                'Your story has been successfully published! <a>View story</a>.',
                'web-stories'
              )}
        </TranslateWithMarkup>
      </Text.Paragraph>
      {confirmURL && (
        <Text.Paragraph size={TextSize.Small}>
          {
            /* translators: 'it' refers to a web story. */
            __('Would you like to include it on a new post?', 'web-stories')
          }
        </Text.Paragraph>
      )}
    </Dialog>
  );
}

export default PostPublishDialog;
