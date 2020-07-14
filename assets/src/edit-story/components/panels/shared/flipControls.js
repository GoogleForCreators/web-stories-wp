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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { FlipHorizontal, FlipVertical } from '../../../icons';
import Toggle from '../../form/toggle';

const ToggleContainer = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${({ margin }) => (margin ? margin : 0)}px;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: left;
  align-items: flex-start;
`;

/**
 * Get flip controls for flipping elements horizontally and vertically.
 *
 * @param {Object} props Component props.
 * @param {Object} props.value Element's flip object.
 * @param {function(boolean)} props.onChange Callback to flip element.
 * @param {number} props.elementSpacing Space between the two flip toggles (defaults to 8).
 * @return {*} Rendered component.
 */
function FlipControls({ value, onChange, elementSpacing }) {
  return (
    <ControlsContainer>
      <ToggleContainer margin={elementSpacing}>
        <Toggle
          title={__('Flip horizontally', 'web-stories')}
          aria-label={__('Flip horizontally', 'web-stories')}
          icon={<FlipHorizontal />}
          value={value.horizontal === true}
          onChange={(horizontal) => onChange({ ...value, horizontal })}
        />
      </ToggleContainer>
      <ToggleContainer>
        <Toggle
          title={__('Flip vertically', 'web-stories')}
          aria-label={__('Flip vertically', 'web-stories')}
          icon={<FlipVertical />}
          value={value.vertical === true}
          onChange={(vertical) => onChange({ ...value, vertical })}
        />
      </ToggleContainer>
    </ControlsContainer>
  );
}

FlipControls.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  elementSpacing: PropTypes.number,
};

FlipControls.defaultProps = {
  elementSpacing: 8,
};

export default FlipControls;
