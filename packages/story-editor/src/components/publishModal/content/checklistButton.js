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
import { Icons } from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { ISSUE_TYPES } from '../../checklist/constants';
import { useCategoryCount } from '../../checklist/countContext';
import { ToggleButton } from '../../toggleButton';

const ChecklistButton = ({ handleReviewChecklist }) => {
  const priorityCount = useCategoryCount(ISSUE_TYPES.PRIORITY);

  return (
    <ToggleButton
      MainIcon={Icons.Checkbox}
      label={__('Checklist', 'web-stories')}
      aria-label={__('Checklist', 'web-stories')}
      popupZIndexOverride={10}
      onClick={handleReviewChecklist}
      notificationCount={priorityCount}
    />
  );
};

export default ChecklistButton;

ChecklistButton.propTypes = {
  handleReviewChecklist: PropTypes.func,
};
