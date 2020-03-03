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
import { rgba } from 'polished';
import { useEffect, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SelectMenu, Row, Numeric } from '../form';
import { useFont } from '../../app';
import { MIN_FONT_SIZE, MAX_FONT_SIZE } from '../../constants';
import { calculateTextHeight } from '../../utils/textMeasurements';
import calcRotatedResizeOffset from '../../utils/calcRotatedResizeOffset';
import { ReactComponent as VerticalOffset } from '../../icons/offset_vertical.svg';
import { ReactComponent as HorizontalOffset } from '../../icons/offset_horizontal.svg';
import { dataPixels } from '../../units/dimensions';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';
import removeUnsetValues from './utils/removeUnsetValues';

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

const ExpandedNumeric = styled(BoxedNumeric)`
  flex-grow: 1;

  svg {
    color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.3)};
    width: 16px;
    height: 16px;
  }
`;

const Space = styled.div`
  flex: 0 0 10px;
`;

function FontPanel({ selectedElements, onSetProperties }) {
  const fontFamily = getCommonValue(selectedElements, 'fontFamily');
  const fontSize = getCommonValue(selectedElements, 'fontSize');
  const fontWeight = getCommonValue(selectedElements, 'fontWeight');
  const fontWeights = getCommonValue(selectedElements, 'fontWeights');
  const fontStyle = getCommonValue(selectedElements, 'fontStyle');
  const fontFallback = getCommonValue(selectedElements, 'fontFallback');

  const {
    state: { fonts },
    actions: { getFontWeight, getFontFallback },
  } = useFont();
  const [state, setState] = useState({
    fontFamily,
    fontStyle,
    fontSize,
    fontWeight,
    fontFallback,
    fontWeights,
  });
  useEffect(() => {
    const currentFontWeights = getFontWeight(fontFamily);
    const currentFontFallback = getFontFallback(fontFamily);
    setState({
      fontFamily,
      fontStyle,
      fontSize,
      fontWeight,
      fontWeights: currentFontWeights,
      fontFallback: currentFontFallback,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontFamily, fontStyle, fontSize, fontWeight, getFontWeight]);
  const handleSubmit = (evt) => {
    onSetProperties((properties) => {
      const { width, height: oldHeight, rotationAngle, x, y } = properties;
      const updatedState = removeUnsetValues(state);
      const newProperties = { ...properties, ...updatedState };
      const newHeight = dataPixels(calculateTextHeight(newProperties, width));
      const [dx, dy] = calcRotatedResizeOffset(
        rotationAngle,
        0,
        0,
        0,
        newHeight - oldHeight
      );
      return {
        ...updatedState,
        height: newHeight,
        x: dataPixels(x + dx),
        y: dataPixels(y + dy),
      };
    });

    evt.preventDefault();
  };

  const fontStyles = [
    { name: __('Normal', 'web-stories'), value: 'normal' },
    { name: __('Italic', 'web-stories'), value: 'italic' },
  ];

  return (
    <SimplePanel
      name="font"
      title={__('Font', 'web-stories')}
      onSubmit={handleSubmit}
    >
      <Row>
        {fonts && (
          <SelectMenu
            ariaLabel={__('Font family', 'web-stories')}
            options={fonts}
            value={state.fontFamily}
            isMultiple={fontFamily === ''}
            onChange={(value) => {
              const currentFontWeights = getFontWeight(value);
              const currentFontFallback = getFontFallback(value);
              const fontWeightsArr = currentFontWeights.map(
                ({ thisValue }) => thisValue
              );
              const newFontWeight =
                fontWeightsArr && fontWeightsArr.includes(state.fontWeight)
                  ? state.fontWeight
                  : 400;
              setState({
                ...state,
                fontFamily: value,
                fontWeight: parseInt(newFontWeight),
                fontWeights: currentFontWeights,
                fontFallback: currentFontFallback,
              });
            }}
          />
        )}
      </Row>
      <Row>
        <SelectMenu
          ariaLabel={__('Font style', 'web-stories')}
          options={fontStyles}
          isMultiple={fontStyle === ''}
          value={state.fontStyle}
          onChange={(value) => setState({ ...state, fontStyle: value })}
        />
        <Space />
        <BoxedNumeric
          ariaLabel={__('Font size', 'web-stories')}
          value={state.fontSize}
          isMultiple={fontSize === ''}
          min={MIN_FONT_SIZE}
          max={MAX_FONT_SIZE}
          flexBasis={58}
          textCenter
          onChange={(value) =>
            setState({ ...state, fontSize: parseInt(value) })
          }
        />
      </Row>
      <Row>
        {/* TODO: Add vertical offset logic */}
        <ExpandedNumeric
          ariaLabel={__('Vertical offset', 'web-stories')}
          value={state.fontSize}
          suffix={<VerticalOffset />}
          isMultiple={fontSize === ''}
          onChange={(value) =>
            setState({ ...state, fontSize: parseInt(value) })
          }
        />
        <Space />
        {/* TODO: Add horizontal offset logic */}
        <ExpandedNumeric
          ariaLabel={__('Horizontal offset', 'web-stories')}
          value={state.fontSize}
          suffix={<HorizontalOffset />}
          isMultiple={fontSize === ''}
          onChange={(value) =>
            setState({ ...state, fontSize: parseInt(value) })
          }
        />
      </Row>
      {state.fontWeights && (
        <SelectMenu
          label={__('Font weight', 'web-stories')}
          options={state.fontWeights}
          value={state.fontWeight}
          isMultiple={fontWeight === ''}
          onChange={(value) =>
            setState({ ...state, fontWeight: parseInt(value) })
          }
        />
      )}
    </SimplePanel>
  );
}

FontPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default FontPanel;
