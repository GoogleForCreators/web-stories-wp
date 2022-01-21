/*
 * Copyright 2021 Google LLC
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
import { useMemo, useRef } from '@googleforcreators/react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import {
  Radio,
  ThemeGlobals,
  themeHelpers,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import useRadioNavigation from '../shared/useRadioNavigation';

const VisuallyHiddenLabel = styled.h3`
  ${themeHelpers.visuallyHidden};
`;

const StyledRadio = styled(Radio)`
  input:focus + span,
  input&.${ThemeGlobals.FOCUS_VISIBLE_SELECTOR} + span {
    ${({ theme }) =>
      `box-shadow: 0px 0px 0 2px ${theme.colors.bg.secondary}, 0px 0px 0 4px ${theme.colors.border.focus} !important;`};
  }
`;

function RadioGroup({
  className,
  groupLabel,
  id,
  name,
  options,
  value: selectedValue,
  ...radioButtonProps
}) {
  const groupId = useMemo(() => id || uuidv4(), [id]);
  const groupRef = useRef(null);
  useRadioNavigation(groupRef);

  return (
    <div
      className={className}
      ref={groupRef}
      role="radiogroup"
      aria-labelledby={groupId}
    >
      <VisuallyHiddenLabel id={groupId}>{groupLabel}</VisuallyHiddenLabel>
      {options.map(({ helper = '', label, value }) => (
        <StyledRadio
          key={value}
          name={name}
          value={value}
          checked={value === selectedValue}
          label={label}
          hint={helper}
          {...radioButtonProps}
        />
      ))}
    </div>
  );
}
RadioGroup.propTypes = {
  className: PropTypes.string,
  groupLabel: PropTypes.string.isRequired,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      helper: PropTypes.string,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
};

export default RadioGroup;
