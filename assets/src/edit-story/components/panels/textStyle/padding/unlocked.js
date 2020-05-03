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
import { BoxedNumeric, Space, DEFAULT_PADDING } from './common';

function UnlockedPaddingControls({ padding, pushUpdateForObject }) {
  return (
    <>
      <BoxedNumeric
        data-testid="padding.horizontal"
        suffix={_x('H', 'The Horizontal padding', 'web-stories')}
        value={padding.horizontal}
        onChange={(value) =>
          pushUpdateForObject(
            'padding',
            {
              horizontal: value,
            },
            DEFAULT_PADDING
          )
        }
      />
      <Space />
      <Toggle
        aria-label={__('Padding ratio lock', 'web-stories')}
        icon={<Locked />}
        uncheckedIcon={<Unlocked />}
        value={false}
        onChange={() =>
          pushUpdateForObject(
            'padding',
            {
              horizontal: padding.horizontal,
              vertical: padding.horizontal,
              locked: true,
            },
            DEFAULT_PADDING,
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
          pushUpdateForObject(
            'padding',
            {
              vertical: value,
            },
            DEFAULT_PADDING
          )
        }
      />
    </>
  );
}

UnlockedPaddingControls.propTypes = {
  padding: PropTypes.shape({
    horizontal: PropTypes.number,
    vertical: PropTypes.number,
    locked: PropTypes.PropTypes.bool,
  }).isRequired,
  pushUpdateForObject: PropTypes.func.isRequired,
};

export default UnlockedPaddingControls;
