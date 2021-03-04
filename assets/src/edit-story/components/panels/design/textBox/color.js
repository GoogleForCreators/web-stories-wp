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
import { useCallback, useRef } from 'react';
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { BACKGROUND_TEXT_MODE } from '../../../../constants';
import { FillNone, FillFilled, FillHighlighted } from '../../../../icons/';
import { Color, Label, Row, ToggleButton } from '../../../form';
import { useKeyDownEffect } from '../../../../../design-system';
import { useCommonColorValue, getCommonValue } from '../../shared';
import { applyHiddenPadding, removeHiddenPadding } from './utils';

const FillRow = styled(Row)`
  align-items: flex-start;
  justify-content: flex-start;
`;

const FillLabel = styled(Label)`
  flex-basis: 45px;
  line-height: 32px;
`;

const FillToggleButton = styled(ToggleButton)`
  flex: 1 1 32px;
  svg {
    width: 16px;
    height: 16px;
  }
`;

const Space = styled.div`
  flex: ${({ flex }) => flex};
`;

const BUTTONS = [
  {
    mode: BACKGROUND_TEXT_MODE.NONE,
    label: __('None', 'web-stories'),
    Icon: FillNone,
  },
  {
    mode: BACKGROUND_TEXT_MODE.FILL,
    label: __('Fill', 'web-stories'),
    Icon: FillFilled,
  },
  {
    mode: BACKGROUND_TEXT_MODE.HIGHLIGHT,
    label: __('Highlight', 'web-stories'),
    Icon: FillHighlighted,
  },
];

function ColorControls({ selectedElements, pushUpdate }) {
  const backgroundColor = useCommonColorValue(
    selectedElements,
    'backgroundColor'
  );
  const backgroundTextMode = getCommonValue(
    selectedElements,
    'backgroundTextMode'
  );
  const fillRow = useRef();

  const pushBackgroundTextMode = useCallback(
    (mode) => {
      pushUpdate(
        (element) => ({
          backgroundTextMode: mode,
          padding: [
            BACKGROUND_TEXT_MODE.FILL,
            BACKGROUND_TEXT_MODE.HIGHLIGHT,
          ].includes(mode)
            ? applyHiddenPadding(element)
            : removeHiddenPadding(element),
        }),
        true
      );
    },
    [pushUpdate]
  );

  useKeyDownEffect(
    fillRow,
    ['left', 'right'],
    ({ key }) => {
      const current = BUTTONS.findIndex(
        ({ mode }) => mode === backgroundTextMode
      );
      const next = current + (key === 'ArrowRight' ? 1 : -1);
      if (next < 0 || next > BUTTONS.length - 1) {
        return;
      }
      pushBackgroundTextMode(BUTTONS[next].mode);
    },
    [backgroundTextMode, pushBackgroundTextMode]
  );

  const handleBackgroundModeButton = useCallback(
    (value, mode) => {
      if (!value) {
        return;
      }
      pushBackgroundTextMode(mode);
    },
    [pushBackgroundTextMode]
  );

  return (
    <>
      <FillRow ref={fillRow}>
        <FillLabel>{__('Fill', 'web-stories')}</FillLabel>
        {BUTTONS.map(({ mode, label, Icon }) => (
          <FillToggleButton
            key={mode}
            icon={<Icon />}
            value={backgroundTextMode === mode}
            label={label}
            aria-label={sprintf(
              /* translators: %s: Text background mode. */
              __('Set text background mode: %s', 'web-stories'),
              label
            )}
            onChange={(value) => handleBackgroundModeButton(value, mode)}
          />
        ))}
        <Space flex="2" />
      </FillRow>
      {backgroundTextMode !== BACKGROUND_TEXT_MODE.NONE && (
        <Row>
          <Label id="background-color-label">
            {__('Textbox', 'web-stories')}
          </Label>
          <Color
            data-testid="text.backgroundColor"
            hasGradient
            value={backgroundColor}
            onChange={(value) =>
              pushUpdate(
                {
                  backgroundColor: value,
                },
                true
              )
            }
            label={__('Background color', 'web-stories')}
            labelId="background-color-label"
          />
        </Row>
      )}
    </>
  );
}

ColorControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default ColorControls;
