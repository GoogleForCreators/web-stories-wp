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
import { useCallback, useRef } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import {
  PillGroup,
  BACKGROUND_TEXT_MODE,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { Color, Row } from '../../../form';
import { useCommonColorValue, getCommonValue, focusStyle } from '../../shared';
import { applyHiddenPadding, removeHiddenPadding } from './utils';

const FillRow = styled(Row)`
  align-items: flex-start;
  justify-content: space-between;
  button {
    flex: 1;
    z-index: 1;
  }
`;

const FILL_OPTIONS = [
  { id: BACKGROUND_TEXT_MODE.NONE, label: __('None', 'web-stories') },
  { id: BACKGROUND_TEXT_MODE.FILL, label: __('Fill', 'web-stories') },
  { id: BACKGROUND_TEXT_MODE.HIGHLIGHT, label: __('Highlight', 'web-stories') },
];

function BackgroundControls({ selectedElements, pushUpdate }) {
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

  const onSelect = useCallback(
    (mode) => {
      pushBackgroundTextMode(mode);
    },
    [pushBackgroundTextMode]
  );

  return (
    <>
      <FillRow ref={fillRow}>
        <PillGroup
          value={backgroundTextMode}
          onSelect={onSelect}
          options={FILL_OPTIONS}
          pillStyleOverride={focusStyle}
        />
      </FillRow>
      {backgroundTextMode !== BACKGROUND_TEXT_MODE.NONE && (
        <Row>
          <Color
            data-testid="text.backgroundColor"
            allowsGradient
            allowsSavedColors
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
            changedStyle="background"
            hasEyedropper
          />
        </Row>
      )}
    </>
  );
}

BackgroundControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default BackgroundControls;
