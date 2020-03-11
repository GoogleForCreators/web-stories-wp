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
import { useEffect, useCallback, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  Color,
  SelectMenu,
  Numeric,
  Row,
  Label,
  Toggle,
  ToggleButton,
} from '../form';
import { useFont } from '../../app';
import { MIN_FONT_SIZE, MAX_FONT_SIZE } from '../../constants';
import { calculateTextHeight } from '../../utils/textMeasurements';
import calcRotatedResizeOffset from '../../utils/calcRotatedResizeOffset';
import { ReactComponent as VerticalOffset } from '../../icons/offset_vertical.svg';
import { ReactComponent as HorizontalOffset } from '../../icons/offset_horizontal.svg';
import { ReactComponent as Locked } from '../../icons/lock.svg';
import { ReactComponent as Unlocked } from '../../icons/unlock.svg';
import { ReactComponent as LeftAlign } from '../../icons/left_align.svg';
import { ReactComponent as RightAlign } from '../../icons/right_align.svg';
import { ReactComponent as CenterAlign } from '../../icons/center_align.svg';
import { ReactComponent as MiddleAlign } from '../../icons/middle_align.svg';
import { ReactComponent as BoldIcon } from '../../icons/bold_icon.svg';
import { ReactComponent as ItalicIcon } from '../../icons/italic_icon.svg';
import { ReactComponent as UnderlineIcon } from '../../icons/underline_icon.svg';
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

function TextStylePanel({ selectedElements, onSetProperties }) {
  const textAlign = getCommonValue(selectedElements, 'textAlign');
  const letterSpacing = getCommonValue(selectedElements, 'letterSpacing');
  const lineHeight = getCommonValue(selectedElements, 'lineHeight');
  const padding = getCommonValue(selectedElements, 'padding');
  const fontFamily = getCommonValue(selectedElements, 'fontFamily');
  const fontSize = getCommonValue(selectedElements, 'fontSize');
  const fontWeight = getCommonValue(selectedElements, 'fontWeight');
  const fontWeights = getCommonValue(selectedElements, 'fontWeights');
  const fontStyle = getCommonValue(selectedElements, 'fontStyle') || 'normal';
  const fontFallback = getCommonValue(selectedElements, 'fontFallback');

  // TODO make this work for multiple elements!
  const backgroundColor = selectedElements[0].backgroundColor || null;
  const color = selectedElements[0].color || null;

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
    textAlign,
    letterSpacing,
    lineHeight,
    padding,
    backgroundColor,
    color,
  });
  const [lockRatio, setLockRatio] = useState(true);
  useEffect(() => {
    setState((oldState) => ({
      ...oldState,
      textAlign,
      letterSpacing,
      lineHeight,
      padding,
    }));
  }, [textAlign, letterSpacing, lineHeight, padding]);
  useEffect(() => {
    const currentFontWeights = getFontWeight(fontFamily);
    const currentFontFallback = getFontFallback(fontFamily);
    setState((oldState) => ({
      ...oldState,
      fontFamily,
      fontStyle,
      fontSize,
      fontWeight,
      fontWeights: currentFontWeights,
      fontFallback: currentFontFallback,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontFamily, fontStyle, fontSize, fontWeight, getFontWeight]);
  const updateProperties = useCallback(
    (originalState) => {
      onSetProperties((properties) => {
        const { width, height: oldHeight, rotationAngle, x, y } = properties;
        const updatedState = removeUnsetValues(originalState);
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
    },
    [onSetProperties]
  );
  const handleSubmit = useCallback(
    (evt) => {
      updateProperties(state);
      if (evt) {
        evt.preventDefault();
      }
    },
    [updateProperties, state]
  );
  const handleStateChange = useCallback(
    (property, value) =>
      setState((originalState) => {
        const update = { ...originalState, [property]: value };
        updateProperties(update);
        return update;
      }),
    [updateProperties]
  );
  const handleFontFamilyChange = useCallback(
    (value) =>
      setState((originalState) => {
        const currentFontWeights = getFontWeight(value);
        const currentFontFallback = getFontFallback(value);
        const fontWeightsArr = currentFontWeights.map(
          ({ thisValue }) => thisValue
        );
        const newFontWeight =
          fontWeightsArr && fontWeightsArr.includes(originalState.fontWeight)
            ? originalState.fontWeight
            : 400;
        const update = {
          ...originalState,
          fontFamily: value,
          fontWeight: parseInt(newFontWeight),
          fontWeights: currentFontWeights,
          fontFallback: currentFontFallback,
        };
        updateProperties(update);
        return update;
      }),
    [updateProperties, getFontWeight, getFontFallback]
  );

  const fontStyles = [
    { name: __('Normal', 'web-stories'), value: 'normal' },
    { name: __('Italic', 'web-stories'), value: 'italic' },
  ];

  return (
    <SimplePanel
      name="style"
      title={__('Style', 'web-stories')}
      onSubmit={handleSubmit}
    >
      <Row>
        {fonts && (
          <SelectMenu
            ariaLabel={__('Font family', 'web-stories')}
            options={fonts}
            value={state.fontFamily}
            isMultiple={fontFamily === ''}
            onChange={handleFontFamilyChange}
          />
        )}
      </Row>
      <Row>
        <SelectMenu
          ariaLabel={__('Font style', 'web-stories')}
          options={fontStyles}
          isMultiple={fontStyle === ''}
          value={state.fontStyle}
          onChange={(value) => handleStateChange('fontStyle', value)}
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
          onChange={(value) => handleStateChange('fontSize', parseInt(value))}
        />
      </Row>
      <Row>
        {/* TODO: Add vertical offset logic */}
        <ExpandedNumeric
          ariaLabel={__('Vertical offset', 'web-stories')}
          value={state.lineHeight || 0}
          suffix={<VerticalOffset />}
          isMultiple={lineHeight === ''}
          onChange={(value) => handleStateChange('lineHeight', parseInt(value))}
        />
        <Space />
        {/* TODO: Add horizontal offset logic */}
        <ExpandedNumeric
          ariaLabel={__('Horizontal offset', 'web-stories')}
          value={state.letterSpacing || 0}
          suffix={<HorizontalOffset />}
          symbol="%"
          isMultiple={letterSpacing === ''}
          onChange={(value) =>
            handleStateChange('letterSpacing', parseInt(value))
          }
        />
      </Row>
      <Row>
        <ToggleButton
          icon={<LeftAlign />}
          value={state.textAlign === 'left'}
          isMultiple={false}
          onChange={(value) =>
            handleStateChange('textAlign', value ? 'left' : '')
          }
        />
        <ToggleButton
          icon={<CenterAlign />}
          value={state.textAlign === 'center'}
          isMultiple={false}
          onChange={(value) =>
            handleStateChange('textAlign', value ? 'center' : '')
          }
        />
        <ToggleButton
          icon={<RightAlign />}
          value={state.textAlign === 'right'}
          isMultiple={false}
          onChange={(value) =>
            handleStateChange('textAlign', value ? 'right' : '')
          }
        />
        <ToggleButton
          icon={<MiddleAlign />}
          value={state.textAlign === 'justify'}
          onChange={(value) =>
            handleStateChange('textAlign', value ? 'justify' : '')
          }
        />
        <ToggleButton
          icon={<BoldIcon />}
          value={state.fontStyle === 'bold'}
          isMultiple={false}
          IconWidth={9}
          IconHeight={10}
          onChange={(value) =>
            handleStateChange('fontStyle', value ? 'bold' : '')
          }
        />
        <ToggleButton
          icon={<ItalicIcon />}
          value={state.fontStyle === 'italic'}
          isMultiple={false}
          IconWidth={10}
          IconHeight={10}
          onChange={(value) =>
            handleStateChange('fontStyle', value ? 'italic' : '')
          }
        />
        <ToggleButton
          icon={<UnderlineIcon />}
          value={state.fontStyle === 'underline'}
          isMultiple={false}
          IconWidth={8}
          IconHeight={21}
          onChange={(value) =>
            handleStateChange('fontStyle', value ? 'underline' : '')
          }
        />
      </Row>
      <Row spaceBetween={false}>
        <Label>{__('Text', 'web-stories')}</Label>
        <Color
          value={state.color}
          onChange={(value) => handleStateChange('color', value)}
        />
      </Row>
      <Row spaceBetween={false}>
        <Label>{__('Textbox', 'web-stories')}</Label>
        <Color
          hasGradient
          value={state.backgroundColor}
          onChange={(value) => handleStateChange('backgroundColor', value)}
        />
      </Row>
      {/* TODO: Update padding logic */}
      <Row>
        <Label>{__('Padding', 'web-stories')}</Label>
        <BoxedNumeric
          suffix={_x('H', 'The Horizontal padding', 'web-stories')}
          value={state.padding || 0}
          onChange={() => {}}
        />
        <Space />
        <Toggle
          icon={<Locked />}
          uncheckedIcon={<Unlocked />}
          value={lockRatio}
          isMultiple={false}
          onChange={(value) => {
            setLockRatio(value);
          }}
        />
        <Space />
        <BoxedNumeric
          suffix={_x('V', 'The Vertical padding', 'web-stories')}
          value={state.padding || 0}
          onChange={() => {}}
        />
      </Row>
    </SimplePanel>
  );
}

TextStylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default TextStylePanel;
