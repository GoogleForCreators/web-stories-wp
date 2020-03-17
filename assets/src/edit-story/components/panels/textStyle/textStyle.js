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
import { useCallback, useEffect, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Numeric, Row, ToggleButton } from '../../form';
import { ReactComponent as VerticalOffset } from '../../../icons/offset_vertical.svg';
import { ReactComponent as HorizontalOffset } from '../../../icons/offset_horizontal.svg';
import { ReactComponent as LeftAlign } from '../../../icons/left_align.svg';
import { ReactComponent as CenterAlign } from '../../../icons/center_align.svg';
import { ReactComponent as RightAlign } from '../../../icons/right_align.svg';
import { ReactComponent as MiddleAlign } from '../../../icons/middle_align.svg';
import { ReactComponent as BoldIcon } from '../../../icons/bold_icon.svg';
import { ReactComponent as ItalicIcon } from '../../../icons/italic_icon.svg';
import { ReactComponent as UnderlineIcon } from '../../../icons/underline_icon.svg';
import getCommonValue from '../utils/getCommonValue';

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

function StylePanel({ selectedElements, onSetProperties }) {
  const textAlign = getCommonValue(selectedElements, 'textAlign');
  const letterSpacing = getCommonValue(selectedElements, 'letterSpacing');
  const lineHeight = getCommonValue(selectedElements, 'lineHeight');
  const fontStyle = getCommonValue(selectedElements, 'fontStyle');
  const textDecoration = getCommonValue(selectedElements, 'textDecoration');
  const bold = getCommonValue(selectedElements, 'bold');

  const [state, setState] = useState({
    bold,
    fontStyle,
    textDecoration,
    textAlign,
    letterSpacing,
    lineHeight,
  });
  useEffect(() => {
    setState({
      bold,
      textAlign,
      letterSpacing,
      lineHeight,
      fontStyle,
      textDecoration,
    });
  }, [bold, textAlign, letterSpacing, lineHeight, fontStyle, textDecoration]);

  const updateProperties = useCallback(() => {
    onSetProperties(state);
  }, [onSetProperties, state]);

  useEffect(() => {
    updateProperties();
  }, [
    state.textAlign,
    state.bold,
    state.fontStyle,
    state.textDecoration,
    updateProperties,
  ]);

  return (
    <>
      <Row>
        <ExpandedNumeric
          ariaLabel={__('Line-height', 'web-stories')}
          value={state.lineHeight || 0}
          suffix={<VerticalOffset />}
          isMultiple={lineHeight === ''}
          onChange={(value) =>
            setState({ ...state, lineHeight: parseFloat(value) })
          }
        />
        <Space />
        <ExpandedNumeric
          ariaLabel={__('Letter-spacing', 'web-stories')}
          value={state.letterSpacing ? state.letterSpacing * 100 : 0}
          suffix={<HorizontalOffset />}
          symbol="%"
          isMultiple={letterSpacing === ''}
          onChange={(value) =>
            setState({
              ...state,
              letterSpacing: parseInt(value) ? parseInt(value) / 100 : 0,
            })
          }
        />
      </Row>
      <Row>
        <ToggleButton
          icon={<LeftAlign />}
          value={state.textAlign === 'left'}
          isMultiple={false}
          onChange={(value) =>
            setState({ ...state, textAlign: value ? 'left' : '' })
          }
        />
        <ToggleButton
          icon={<CenterAlign />}
          value={state.textAlign === 'center'}
          isMultiple={false}
          onChange={(value) =>
            setState({ ...state, textAlign: value ? 'center' : '' })
          }
        />
        <ToggleButton
          icon={<RightAlign />}
          value={state.textAlign === 'right'}
          isMultiple={false}
          onChange={(value) =>
            setState({ ...state, textAlign: value ? 'right' : '' })
          }
        />
        <ToggleButton
          icon={<MiddleAlign />}
          value={state.textAlign === 'justify'}
          isMultiple={false}
          onChange={(value) =>
            setState({ ...state, textAlign: value ? 'justify' : '' })
          }
        />
        <ToggleButton
          icon={<BoldIcon />}
          value={state.bold || false}
          isMultiple={false}
          IconWidth={9}
          IconHeight={10}
          onChange={(value) => setState({ ...state, bold: value })}
        />
        <ToggleButton
          icon={<ItalicIcon />}
          value={state.fontStyle === 'italic'}
          isMultiple={false}
          IconWidth={10}
          IconHeight={10}
          onChange={(value) =>
            setState({ ...state, fontStyle: value ? 'italic' : 'normal' })
          }
        />
        <ToggleButton
          icon={<UnderlineIcon />}
          value={state.textDecoration === 'underline'}
          isMultiple={false}
          IconWidth={8}
          IconHeight={21}
          onChange={(value) =>
            setState({ ...state, textDecoration: value ? 'underline' : 'none' })
          }
        />
      </Row>
    </>
  );
}

StylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default StylePanel;
