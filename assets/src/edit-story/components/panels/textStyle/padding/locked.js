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
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Toggle } from '../../../form';
import { Lock as Locked, Unlock as Unlocked } from '../../../../icons';
import { PaddingPropType } from '../../../../types';
import { BoxedNumeric, Space } from './common';

const FlexedBoxedNumeric = styled(BoxedNumeric)`
  flex-basis: auto;
`;

function LockedPaddingControls({ padding, handleChange }) {
  return (
    <>
      <FlexedBoxedNumeric
        suffix={_x(
          `H\u00A0&\u00A0V`,
          'The Horizontal & Vertical padding',
          'web-stories'
        )}
        value={padding.horizontal}
        onChange={(value) =>
          handleChange({
            horizontal: value,
            vertical: value,
          })
        }
        aria-label={__('Edit: Horizontal & Vertical padding', 'web-stories')}
      />
      <Space />
      <Toggle
        icon={<Locked />}
        uncheckedIcon={<Unlocked />}
        value={true}
        onChange={() => handleChange({ locked: false })}
        aria-label={__('Toggle padding ratio lock', 'web-stories')}
      />
    </>
  );
}

LockedPaddingControls.propTypes = {
  padding: PaddingPropType.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default LockedPaddingControls;
