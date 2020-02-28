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

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { InputGroup, SelectMenu } from '../../form';

function TextStyleControls({ properties, state, setState }) {
  const {
    bold,
    textAlign,
    letterSpacing,
    lineHeight,
    fontStyle,
    textDecoration,
  } = properties;

  const alignmentOptions = [
    { name: __('Default', 'web-stories'), value: '' },
    { name: __('Left', 'web-stories'), value: 'left' },
    { name: __('Right', 'web-stories'), value: 'right' },
    { name: __('Center', 'web-stories'), value: 'center' },
    { name: __('Justify', 'web-stories'), value: 'justify' },
  ];

  const fontStyles = [
    { name: __('Normal', 'web-stories'), value: 'normal' },
    { name: __('Italic', 'web-stories'), value: 'italic' },
  ];

  // Different from font weight, this would wrap the text (or part of it) with `strong` tag.
  // @todo Use toggle instead.
  const boldOptions = [
    { name: __('Bold Off', 'web-stories'), value: false },
    { name: __('Bold On', 'web-stories'), value: true },
  ];

  const textDecorations = [
    { name: __('None', 'web-stories'), value: 'none' },
    { name: __('Underline', 'web-stories'), value: 'underline' },
  ];

  return (
    <>
      <SelectMenu
        label={__('Font style', 'web-stories')}
        options={fontStyles}
        isMultiple={fontStyle === ''}
        value={state.fontStyle}
        onChange={(value) => setState({ ...state, fontStyle: value })}
      />
      <SelectMenu
        label={__('Bold', 'web-stories')}
        options={boldOptions}
        isMultiple={bold === ''}
        value={state.bold}
        onChange={(value) => setState({ ...state, bold: Boolean(value) })}
      />
      <SelectMenu
        label={__('Text decoration', 'web-stories')}
        options={textDecorations}
        isMultiple={textDecoration === ''}
        value={state.textDecoration}
        onChange={(value) => setState({ ...state, textDecoration: value })}
      />
      <SelectMenu
        label={__('Alignment', 'web-stories')}
        options={alignmentOptions}
        isMultiple={'' === textAlign}
        value={state.textAlign}
        onChange={(value) => setState({ ...state, textAlign: value })}
      />
      <InputGroup
        label={__('Line height', 'web-stories')}
        value={state.lineHeight}
        isMultiple={'' === lineHeight}
        onChange={(value) =>
          setState({
            ...state,
            lineHeight: isNaN(value) ? '' : parseFloat(value),
          })
        }
        step="0.1"
      />
      <InputGroup
        label={__('Letter-spacing', 'web-stories')}
        value={state.letterSpacing}
        isMultiple={'' === letterSpacing}
        onChange={(value) =>
          setState({ ...state, letterSpacing: isNaN(value) ? '' : value })
        }
        postfix={_x('em', 'em, the measurement of size', 'web-stories')}
        step="0.1"
      />
    </>
  );
}

TextStyleControls.propTypes = {
  properties: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
};

export default TextStyleControls;
