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
import { useState, useEffect, useCallback } from '@googleforcreators/react';
import { __, TranslateWithMarkup } from '@googleforcreators/i18n';
import { trackClick, trackEvent } from '@googleforcreators/tracking';
import {
  Text,
  Link,
  THEME_CONSTANTS,
  LOCAL_STORAGE_PREFIX,
  localStore,
} from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import Dialog from '../../../../dialog';

const TERMS_URL = 'https://wp.stories.google/docs#Terms';

function TermsDialog() {
  const hasAcknowledgedTerms3p = localStore.getItemByKey(
    `${LOCAL_STORAGE_PREFIX.TERMS_MEDIA3P}`
  );

  const [dialogOpen, setDialogOpen] = useState(!hasAcknowledgedTerms3p);

  const acknowledgeTerms = useCallback(() => {
    setDialogOpen(false);
    localStore.setItemByKey(`${LOCAL_STORAGE_PREFIX.TERMS_MEDIA3P}`, true);
    trackEvent('media3p_terms_acknowledged');
  }, []);

  useEffect(() => {
    setDialogOpen(!hasAcknowledgedTerms3p);
  }, [hasAcknowledgedTerms3p]);

  const onTermsClick = useCallback((evt) => {
    trackClick(evt, 'click_terms_of_service');
  }, []);

  if (hasAcknowledgedTerms3p) {
    return null;
  }

  return (
    <Dialog
      isOpen={dialogOpen}
      contentLabel={__('Third party stock content terms', 'web-stories')}
      onClose={acknowledgeTerms}
      ariaHideApp={false}
      onPrimary={acknowledgeTerms}
      primaryText={__('Dismiss', 'web-stories')}
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        <TranslateWithMarkup
          mapping={{
            a: (
              <Link
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                href={TERMS_URL}
                target="_blank"
                aria-label={__(
                  'Learn more by visiting Web Stories for WordPress',
                  'web-stories'
                )}
                onClick={onTermsClick}
              />
            ),
          }}
        >
          {__(
            'Your use of stock content is subject to third party terms. <a>Learn more.</a>',
            'web-stories'
          )}
        </TranslateWithMarkup>
      </Text>
    </Dialog>
  );
}

export default TermsDialog;
