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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { __ } from '@googleforcreators/i18n';
import { useCallback, memo } from '@googleforcreators/react';
import {
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  ToggleButton,
  Icons,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import Tooltip from '../../tooltip';
import { focusStyle } from './styles';

const ControlsContainer = styled.div`
  display: flex;
  justify-content: left;
  align-items: flex-start;
`;

const Space = styled.div`
  width: 8px;
`;

const StyledToggleButton = styled(ToggleButton)`
  ${focusStyle};
`;

/**
 * @callback ChangeCallback
 * @param {Object} flip Flip value.
 * @param {boolean} flip.horizontal Horizontal value.
 * @param {boolean} flip.vertical Vertical value.
 */

/**
 * Get flip controls for flipping elements horizontally and vertically.
 *
 * @param {Object} props Component props.
 * @param {Object} props.value Element's flip object.
 * @param {ChangeCallback} props.onChange Callback to flip element.
 * @return {*} Rendered component.
 */
function FlipControls({ value, onChange }) {
  const getCurrentFlipValue = useCallback(
    (prop) => value[prop] === true,
    [value]
  );
  return (
    <ControlsContainer>
      <Tooltip title={__('Flip horizontally', 'web-stories')}>
        <StyledToggleButton
          variant={BUTTON_VARIANTS.SQUARE}
          size={BUTTON_SIZES.SMALL}
          isToggled={value.horizontal === true}
          onClick={() =>
            onChange({
              ...value,
              horizontal: !getCurrentFlipValue('horizontal'),
            })
          }
          aria-label={__('Flip horizontally', 'web-stories')}
        >
          <Icons.MirrorLeftRight />
        </StyledToggleButton>
      </Tooltip>
      <Space />
      <Tooltip title={__('Flip vertically', 'web-stories')}>
        <StyledToggleButton
          variant={BUTTON_VARIANTS.SQUARE}
          size={BUTTON_SIZES.SMALL}
          isToggled={value.vertical === true}
          onClick={() =>
            onChange({ ...value, vertical: !getCurrentFlipValue('vertical') })
          }
          aria-label={__('Flip vertically', 'web-stories')}
        >
          <Icons.MirrorUpDown />
        </StyledToggleButton>
      </Tooltip>
    </ControlsContainer>
  );
}

FlipControls.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default memo(FlipControls);
