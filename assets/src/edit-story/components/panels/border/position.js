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

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Row, ToggleButton } from '../../form';
import { BORDER_POSITION } from '../../../constants';
import { useCommonObjectValue } from '../utils';
import { DEFAULT_BORDER } from './shared';

const PositionButton = styled(ToggleButton)`
  flex: 1;
  label {
    width: 100%;
    background-color: transparent !important;
  }
`;

const Label = styled.div`
  border: 1px solid ${({ theme }) => rgba(theme.colors.fg.white, 0.24)};
  border-radius: 50px;
  font-family: ${({ theme }) => theme.fonts.paragraph.small.family};
  font-size: ${({ theme }) => theme.fonts.paragraph.small.size};
  line-height: ${({ theme }) => theme.fonts.paragraph.small.lineHeight};
  padding: 6px;
  width: 100%;
  text-align: center;
  ${({ checked, theme }) =>
    checked &&
    `background-color: ${rgba(
      theme.colors.fg.white,
      0.24
    )}; border-color: transparent;`}
`;

const BUTTONS = [
  {
    mode: BORDER_POSITION.INSIDE,
    label: __('Inside', 'web-stories'),
  },
  {
    mode: BORDER_POSITION.CENTER,
    label: __('Center', 'web-stories'),
  },
  {
    mode: BORDER_POSITION.OUTSIDE,
    label: __('Outside', 'web-stories'),
  },
];

function Position({ selectedElements, pushUpdateForObject }) {
  const border = useCommonObjectValue(
    selectedElements,
    'border',
    DEFAULT_BORDER
  );
  const { position } = border;

  return (
    <Row>
      {BUTTONS.map(({ mode, label }) => (
        <PositionButton
          key={mode}
          value={position === mode}
          aria-label={sprintf(
            /* translators: %s: Border position mode. */
            __('Set border position mode: %s', 'web-stories'),
            label
          )}
          onChange={(value) =>
            value &&
            pushUpdateForObject(
              'border',
              { position: mode },
              DEFAULT_BORDER,
              true
            )
          }
        >
          <Label checked={position === mode}>{label}</Label>
        </PositionButton>
      ))}
    </Row>
  );
}

export default Position;
