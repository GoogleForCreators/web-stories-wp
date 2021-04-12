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
import { usePrepublishChecklist } from '../../inspector/prepublish';
import { PRE_PUBLISH_MESSAGE_TYPES } from '../../../app/prepublish';
import {
  Icons,
  Button as DefaultButton,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '../../../../design-system';
import Tooltip from '../../tooltip';

const Button = styled(DefaultButton)`
  padding: 4px 8px;
  svg {
    margin-right: -2px;
    margin-left: 2px;
  }
`;

function ButtonWithChecklistWarning({ text, ...buttonProps }) {
  const { checklist, refreshChecklist } = usePrepublishChecklist();
  const hasErrors = checklist.some(
    ({ type }) => PRE_PUBLISH_MESSAGE_TYPES.ERROR === type
  );
  const button = (
    <Button
      variant={BUTTON_VARIANTS.RECTANGLE}
      type={BUTTON_TYPES.PRIMARY}
      size={BUTTON_SIZES.SMALL}
      onPointerEnter={refreshChecklist}
      {...buttonProps}
    >
      {text}
      {hasErrors && <Icons.ExclamationOutline height={24} width={24} />}
    </Button>
  );

  return hasErrors ? (
    <Tooltip
      title={__('There are items in the checklist to resolve', 'web-stories')}
      hasTail
    >
      {button}
    </Tooltip>
  ) : (
    button
  );
}

ButtonWithChecklistWarning.propTypes = {
  text: PropTypes.node.isRequired,
};

export default ButtonWithChecklistWarning;
