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
  Link,
  Text,
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';
import Dialog from '../dialog';

const RECOMMENDATION_URL = __(
  'https://amp.dev/documentation/guides-and-tutorials/start/create_successful_stories/#title',
  'web-stories'
);

function TitleMissingDialog({ isOpen, onIgnore, onFix, onClose }) {
  const onClick = useCallback(
    (evt) => trackClick(evt, 'click_stories_best_practices_docs'),
    []
  );
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={__('Missing title', 'web-stories')}
      onSecondary={onFix}
      secondaryText={__('Add a title', 'web-stories')}
      primaryText={__('Publish without title', 'web-stories')}
      onPrimary={onIgnore}
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        <TranslateWithMarkup
          mapping={{
            a: (
              <Link
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                href={RECOMMENDATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClick}
              />
            ),
          }}
        >
          {__(
            'We recommend adding a title to the story prior to publishing. <a>Learn more</a>.',
            'web-stories'
          )}
        </TranslateWithMarkup>
      </Text>
    </Dialog>
  );
}

TitleMissingDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onIgnore: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onFix: PropTypes.func.isRequired,
};

export default TitleMissingDialog;
