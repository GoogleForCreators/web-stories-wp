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
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { __, TranslateWithMarkup } from '@web-stories-wp/i18n';
import { trackClick } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */

import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  Dialog,
  Link,
  Text,
  THEME_CONSTANTS,
} from '../../../design-system';

function PostPublishDialog({ open, onClose, confirmURL, storyURL }) {
  const onAddToPostClick = useCallback((evt) => {
    trackClick(evt, 'add_story_to_new_post');
  }, []);

  const onViewStoryClick = useCallback((evt) => {
    trackClick(evt, 'view_story');
  }, []);

  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      title={__('Story published!', 'web-stories')}
      actions={
        <>
          <Button
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.SMALL}
            onClick={onClose}
          >
            {__('Dismiss', 'web-stories')}
          </Button>
          <Button
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.SMALL}
            href={confirmURL}
            onClick={onAddToPostClick}
          >
            {__('Add to new post', 'web-stories')}
          </Button>
        </>
      }
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL} as="p">
        <TranslateWithMarkup
          mapping={{
            a: (
              <Link
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                href={storyURL}
                target="_blank"
                rel="noopener noreferrer"
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
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL} as="p">
        {__('Would you like to include it on a new post?', 'web-stories')}
      </Text>
    </Dialog>
  );
}

PostPublishDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  confirmURL: PropTypes.string.isRequired,
  storyURL: PropTypes.string,
};

PostPublishDialog.defaultProps = {
  storyURL: '',
};

export default PostPublishDialog;
