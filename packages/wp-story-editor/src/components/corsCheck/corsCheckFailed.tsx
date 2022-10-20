/*
 * Copyright 2022 Google LLC
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
import { useCallback } from '@googleforcreators/react';
import { __, TranslateWithMarkup } from '@googleforcreators/i18n';
import { trackClick } from '@googleforcreators/tracking';
import { Link, Text, THEME_CONSTANTS } from '@googleforcreators/design-system';
import { Dialog } from '@googleforcreators/story-editor';
import { MouseEvent } from 'react';

const DOCS_URL =
  'https://wp.stories.google/docs/troubleshooting/common-issues/';

interface CorsCheckFailed {
  isOpen: boolean;
  onClose: () => void;
}

function CorsCheckFailed({ isOpen, onClose }: CorsCheckFailed) {
  const onDocsClick = useCallback((evt: MouseEvent<HTMLAnchorElement>) => {
    trackClick(evt, 'click_cors_check_docs');
  }, []);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={__('Unable to load media', 'web-stories')}
      contentLabel={__('Unable to load media', 'web-stories')}
      onPrimary={onClose}
      primaryText={__('Dismiss', 'web-stories')}
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        <TranslateWithMarkup
          mapping={{
            a: (
              <Link
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                href={DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onDocsClick}
              />
            ),
          }}
        >
          {__(
            'We detected a potential misconfiguration that prevents media items from loading correctly. This may be due to media being hosted on an external CDN. <a>Learn how to address this</a>.',
            'web-stories'
          )}
        </TranslateWithMarkup>
      </Text>
    </Dialog>
  );
}

export default CorsCheckFailed;
