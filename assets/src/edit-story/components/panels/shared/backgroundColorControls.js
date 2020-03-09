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
import { Color, Numeric } from '../../form';

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

function BackgroundColorControls({ state, setState }) {
  return (
    <>
      <Color
        value={state.backgroundColor || '#000000'}
        onChange={(value) => setState({ ...state, backgroundColor: value })}
      />
      <BoxedNumeric
        ariaLabel={__('Background Opacity', 'web-stories')}
        flexBasis={58}
        textCenter
        value={state.backgroundOpacity}
        onChange={(value) => setState({ ...state, backgroundOpacity: value })}
        postfix={_x('%', 'Percentage', 'web-stories')}
      />
    </>
  );
}

BackgroundColorControls.propTypes = {
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
};

export default BackgroundColorControls;
