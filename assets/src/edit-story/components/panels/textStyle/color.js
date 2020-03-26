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
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Color, Label, Row, ToggleButton } from '../../form';
import { useCommonColorValue, getCommonValue } from '../utils';
import { BACKGROUND_TEXT_MODE } from '../../../constants';
import { ReactComponent as NoneIcon } from '../../../icons/fill_none_icon.svg';
import { ReactComponent as FilledIcon } from '../../../icons/fill_filled_icon.svg';
import { ReactComponent as HighlightedIcon } from '../../../icons/fill_highlighted_icon.svg';

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

function ColorControls({ selectedElements, pushUpdate }) {
  const color = useCommonColorValue(selectedElements, 'color');
  const backgroundColor = useCommonColorValue(
    selectedElements,
    'backgroundColor'
  );
  const backgroundTextMode = getCommonValue(
    selectedElements,
    'backgroundTextMode'
  );

  return (
    <>
      <Row>
        <Label>{__('Text', 'web-stories')}</Label>
        <Color
          data-testid="text.color"
          value={color}
          onChange={(value) =>
            pushUpdate(
              {
                color: value,
              },
              true
            )
          }
        />
      </Row>
      <FillRow>
        <FillLabel>{__('Fill', 'web-stories')}</FillLabel>
        <FillToggleButton
          icon={<NoneIcon />}
          value={backgroundTextMode === BACKGROUND_TEXT_MODE.NONE}
          label={__('None', 'web-stories')}
          onChange={(value) =>
            value &&
            pushUpdate(
              {
                backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
              },
              true
            )
          }
        />
        <FillToggleButton
          icon={<FilledIcon />}
          value={backgroundTextMode === BACKGROUND_TEXT_MODE.FILL}
          label={__('Fill', 'web-stories')}
          onChange={(value) =>
            value &&
            pushUpdate(
              {
                backgroundTextMode: BACKGROUND_TEXT_MODE.FILL,
              },
              true
            )
          }
        />
        <FillToggleButton
          icon={<HighlightedIcon />}
          label={__('Highlight', 'web-stories')}
          value={backgroundTextMode === BACKGROUND_TEXT_MODE.HIGHLIGHT}
          onChange={(value) =>
            value &&
            pushUpdate(
              {
                backgroundTextMode: BACKGROUND_TEXT_MODE.HIGHLIGHT,
              },
              true
            )
          }
        />
        <Space flex="2" />
      </FillRow>
      {backgroundTextMode !== BACKGROUND_TEXT_MODE.NONE && (
        <Row>
          <Label>{__('Textbox', 'web-stories')}</Label>
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
