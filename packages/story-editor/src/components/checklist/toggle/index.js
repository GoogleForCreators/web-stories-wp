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
import { useMemo } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __, _n, sprintf } from '@googleforcreators/i18n';
import { Icons } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { ToggleButton } from '../../toggleButton';
import { useCategoryCount } from '../countContext';
import { useCheckpoint } from '../checkpointContext';
import { ISSUE_TYPES, PPC_CHECKPOINT_STATE } from '../constants';
import { noop } from '../../../utils/noop';

const MainIcon = styled(Icons.Checkbox)`
  height: 32px;
  width: auto;
  display: block;
`;

const StyledToggleButton = styled(ToggleButton)`
  display: block;
  background-color: ${({ theme }) => theme.colors.bg.primary};
`;

function Toggle({ isOpen = false, popupId = '', onClick = noop }) {
  const priorityCount = useCategoryCount(ISSUE_TYPES.PRIORITY);

  const { checkpoint } = useCheckpoint(({ state: { checkpoint } }) => ({
    checkpoint,
  }));

  const notificationCount = useMemo(
    () => (checkpoint === PPC_CHECKPOINT_STATE.ALL ? priorityCount : 0),
    [checkpoint, priorityCount]
  );

  return (
    <StyledToggleButton
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
      notificationCount={notificationCount}
    />
  );
}

Toggle.propTypes = {
  isOpen: PropTypes.bool,
  popupId: PropTypes.string,
  onClick: PropTypes.func,
};

export { Toggle };
