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
import styled from 'styled-components';
import { __, _n, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Icons } from '../../../../design-system';
import { ToggleButton } from '../../toggleButton';

const MainIcon = styled(Icons.Checkbox)`
  height: 32px;
  width: auto;
  display: block;
`;

function Toggle({
  isOpen = false,
  popupId = '',
  onClick = () => {},
  notificationCount = 0,
}) {
  return (
    <ToggleButton
      aria-owns={popupId}
      onClick={onClick}
      isOpen={isOpen}
      MainIcon={MainIcon}
      label={__('Checklist', 'web-stories')}
      aria-label={
        notificationCount > 0
          ? sprintf(
              /* translators: %s:  number of unaddressed issues. */
              _n(
                'Checklist: %s unaddressed issue',
                'Checklist: %s unaddressed issues',
                notificationCount,
                'web-stories'
              ),
              notificationCount
            )
          : __('Checklist', 'web-stories')
      }
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
