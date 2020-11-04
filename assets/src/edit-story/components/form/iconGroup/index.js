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
import { useRef } from 'react';

/**
 * Internal dependencies
 */
import useRadioNavigation from '../shared/useRadioNavigation';
import { KEYBOARD_USER_SELECTOR } from '../../../utils/keyboardOnlyOutline';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
`;

const Button = styled.label`
  display: block;
  min-height: 30px;
  margin-right: 8px;
  flex: 1;
  cursor: pointer;
`;

// Class should contain "mousetrap" to enable keyboard shortcuts on inputs.
const Radio = styled.input.attrs({ className: 'mousetrap' })`
  opacity: 0;
  position: absolute;
  ${KEYBOARD_USER_SELECTOR} &:focus + div {
    outline: -webkit-focus-ring-color auto 5px;
  }
`;

function IconGroup({ onChange, value: selectedValue, options, ...rest }) {
  // We need manual arrow key navigation here, as we have a global listener for those keys
  // preventing default functionality.
  const ref = useRef();

  useRadioNavigation(ref);

  return (
    <Wrapper ref={ref} role="radiogroup" {...rest}>
      {options.map(({ value, Icon, label }) => (
        <Button key={value}>
          <Radio
            onChange={(evt) => onChange(evt.target.value, evt)}
            value={value}
            type="radio"
            checked={value === selectedValue}
            aria-label={`Border position mode: ${value}`}
          />
          <Icon checked={value === selectedValue} label={label} />
        </Button>
      ))}
    </Wrapper>
  );
}

IconGroup.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};

export default IconGroup;
