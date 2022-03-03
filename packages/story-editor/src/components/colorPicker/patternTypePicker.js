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
import { useCallback } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import {
  ToggleButton,
  Icons,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  BUTTON_TYPES,
} from '@googleforcreators/design-system';

const HEADER_FOOTER_HEIGHT = 52;

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: ${HEADER_FOOTER_HEIGHT}px;
  padding: 0 16px;
  position: relative;
  gap: 8px;
`;

function PatternTypePicker({ type, setToGradient, setToSolid }) {
  const setToLinear = useCallback(
    () => setToGradient('linear'),
    [setToGradient]
  );
  const setToRadial = useCallback(
    () => setToGradient('radial'),
    [setToGradient]
  );

  return (
    <Wrapper>
      <ToggleButton
        aria-label={__('Solid pattern type', 'web-stories')}
        onClick={setToSolid}
        type={BUTTON_TYPES.QUATERNARY}
        size={BUTTON_SIZES.SMALL}
        variant={BUTTON_VARIANTS.SQUARE}
        isToggled={type === 'solid'}
      >
        <Icons.PatternSolid />
      </ToggleButton>
      <ToggleButton
        aria-label={__('Linear gradient pattern type', 'web-stories')}
        onClick={setToLinear}
        type={BUTTON_TYPES.QUATERNARY}
        size={BUTTON_SIZES.SMALL}
        variant={BUTTON_VARIANTS.SQUARE}
        isToggled={type === 'linear'}
      >
        <Icons.PatternLinear />
      </ToggleButton>
      <ToggleButton
        aria-label={__('Radial gradient pattern type', 'web-stories')}
        onClick={setToRadial}
        type={BUTTON_TYPES.QUATERNARY}
        size={BUTTON_SIZES.SMALL}
        variant={BUTTON_VARIANTS.SQUARE}
        isToggled={type === 'radial'}
      >
        <Icons.PatternRadial />
      </ToggleButton>
    </Wrapper>
  );
}

PatternTypePicker.propTypes = {
  type: PropTypes.string.isRequired,
  setToGradient: PropTypes.func.isRequired,
  setToSolid: PropTypes.func.isRequired,
};

export default PatternTypePicker;
