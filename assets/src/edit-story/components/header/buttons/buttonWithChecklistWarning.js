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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { Primary } from '../../button';
import WithTooltip from '../../tooltip';
import { usePrepublishChecklist } from '../../inspector/prepublish';
import { PRE_PUBLISH_MESSAGE_TYPES } from '../../../app/prepublish';
import { ButtonContent, WarningIcon } from './styles';

function ButtonWithChecklistWarning({ text, ...buttonProps }) {
  const { checklist, refreshChecklist } = usePrepublishChecklist();

  const tooltip = checklist.some(
    ({ type }) => PRE_PUBLISH_MESSAGE_TYPES.ERROR === type
  )
    ? __('There are items in the checklist to resolve', 'web-stories')
    : null;

  const button = (
    <Primary onPointerEnter={refreshChecklist} {...buttonProps}>
      <ButtonContent>
        {text}
        {tooltip && <WarningIcon />}
      </ButtonContent>
    </Primary>
  );

  return tooltip ? <WithTooltip title={tooltip}>{button}</WithTooltip> : button;
}

ButtonWithChecklistWarning.propTypes = {
  text: PropTypes.node.isRequired,
};

export default ButtonWithChecklistWarning;
