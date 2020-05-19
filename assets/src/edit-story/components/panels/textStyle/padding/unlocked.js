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

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Toggle } from '../../../form';
import { ReactComponent as Locked } from '../../../../icons/lock.svg';
import { ReactComponent as Unlocked } from '../../../../icons/unlock.svg';
import { PaddingPropType } from '../../../../types';
import { BoxedNumeric, Space } from './common';

function UnlockedPaddingControls({ padding, handleChange }) {
  return (
    <>
      <BoxedNumeric
        data-testid="padding.horizontal"
        suffix={_x('H', 'The Horizontal padding', 'web-stories')}
        value={padding.horizontal}
        onChange={(value) =>
          handleChange({
            horizontal: value,
          })
        }
      />
      <Space />
      <Toggle
        aria-label={__('Padding ratio lock', 'web-stories')}
        icon={<Locked />}
        uncheckedIcon={<Unlocked />}
        value={false}
        onChange={() =>
          handleChange(
            {
              horizontal: padding.horizontal,
              vertical: padding.horizontal,
              locked: true,
            },
            true
          )
        }
      />
      <Space />
      <BoxedNumeric
        data-testid="padding.vertical"
        suffix={_x('V', 'The Vertical padding', 'web-stories')}
        value={padding.vertical}
        onChange={(value) =>
          handleChange({
            vertical: value,
          })
        }
      />
    </>
  );
}

UnlockedPaddingControls.propTypes = {
  padding: PaddingPropType.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default UnlockedPaddingControls;
