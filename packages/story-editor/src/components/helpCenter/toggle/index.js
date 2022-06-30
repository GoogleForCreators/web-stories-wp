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
import PropTypes from 'prop-types';
import { __, _n, sprintf } from '@googleforcreators/i18n';
import { Icons } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { ToggleButton } from '../../toggleButton';

function Toggle({
  isOpen = false,
  popupId = '',
  onClick = () => {},
  notificationCount = 0,
}) {
  return (
    <ToggleButton
      aria-owns={popupId}
      aria-label={
        notificationCount > 0
          ? sprintf(
              /* translators: %s:  number of unread notifications. */
              _n(
                'Help Center: %s unread notification',
                'Help Center: %s unread notifications',
                notificationCount,
                'web-stories'
              ),
              notificationCount
            )
          : __('Help Center', 'web-stories')
      }
      onClick={onClick}
      isOpen={isOpen}
      label={__('Help', 'web-stories')}
      MainIcon={Icons.QuestionMarkOutline}
      notificationCount={notificationCount}
    />
  );
}

Toggle.propTypes = {
  isOpen: PropTypes.bool,
  popupId: PropTypes.string,
  onClick: PropTypes.func,
  notificationCount: PropTypes.number,
};

export { Toggle };
