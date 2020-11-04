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
import { rgba } from 'polished';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { IconGroup, Row } from '../../form';
import { BORDER_POSITION } from '../../../constants';
import { useCommonObjectValue } from '../utils';
import { DEFAULT_BORDER } from './shared';

const Label = styled.div`
  border: 1px solid ${({ theme }) => rgba(theme.colors.fg.white, 0.24)};
  border-radius: 50px;
  font-family: ${({ theme }) => theme.fonts.paragraph.small.family};
  font-size: ${({ theme }) => theme.fonts.paragraph.small.size};
  line-height: ${({ theme }) => theme.fonts.paragraph.small.lineHeight};
  padding: 6px;
  width: 100%;
  text-align: center;
  margin-right: 8px;
  ${({ checked, theme }) =>
    checked &&
    `
    background-color: ${rgba(theme.colors.fg.white, 0.24)};
    border-color: transparent;
    `}
`;

function Icon({ label, checked }) {
  return <Label checked={checked}>{label}</Label>;
}

Icon.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
};

function Position({ selectedElements, pushUpdateForObject }) {
  const border = useCommonObjectValue(
    selectedElements,
    'border',
    DEFAULT_BORDER
  );
  const { position } = border;

  const options = [
    {
      value: BORDER_POSITION.INSIDE,
      Icon,
      label: __('Inside', 'web-stories'),
    },
    {
      value: BORDER_POSITION.CENTER,
      Icon,
      label: __('Center', 'web-stories'),
    },
    {
      value: BORDER_POSITION.OUTSIDE,
      Icon,
      label: __('Outside', 'web-stories'),
    },
  ];

  return (
    <Row>
      <IconGroup
        options={options}
        onChange={(value) =>
          pushUpdateForObject(
            'border',
            { position: value },
            DEFAULT_BORDER,
            true
          )
        }
        value={position}
        aria-label={__('Border mode', 'web-stories')}
      />
    </Row>
  );
}

Position.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdateForObject: PropTypes.func.isRequired,
};

export default Position;
