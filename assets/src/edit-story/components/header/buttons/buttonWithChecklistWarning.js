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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import {
  Button as DefaultButton,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '../../../../design-system';
import {
  ChecklistIcon,
  usePrepublishChecklist,
  PPC_CHECKPOINT_STATE,
} from '../../inspector/prepublish';

import Tooltip from '../../tooltip';

const Button = styled(DefaultButton)`
  padding: 4px 6px;
  height: 32px;
  svg {
    width: 24px;
    height: auto;
  }
`;

function ButtonWithChecklistWarning({ text, ...buttonProps }) {
  const { refreshChecklist, currentCheckpoint } = usePrepublishChecklist();

  const button = (
    <Button
      variant={BUTTON_VARIANTS.RECTANGLE}
      type={BUTTON_TYPES.PRIMARY}
      size={BUTTON_SIZES.SMALL}
      onPointerEnter={refreshChecklist}
      {...buttonProps}
    >
      {text}
      <ChecklistIcon checkpoint={currentCheckpoint} />
    </Button>
  );

  const TOOLTIP_TEXT = {
    [PPC_CHECKPOINT_STATE.ALL]: __(
      'Make updates before publishing to improve discoverability and performance on search engines',
      'web-stories'
    ),
    [PPC_CHECKPOINT_STATE.ONLY_RECOMMENDED]: __(
      'Review checklist to improve performance before publishing',
      'web-stories'
    ),
    [PPC_CHECKPOINT_STATE.UNAVAILABLE]: null,
  };

  return (
    <Tooltip title={TOOLTIP_TEXT[currentCheckpoint]} hasTail>
      {button}
    </Tooltip>
  );
}

ButtonWithChecklistWarning.propTypes = {
  text: PropTypes.node.isRequired,
};

export default ButtonWithChecklistWarning;
