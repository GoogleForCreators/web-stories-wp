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
import { useEffect, useState } from '@wordpress/element';
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { InputGroup, SelectMenu } from '../form';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';

function StylePanel({ selectedElements, onSetProperties }) {
  const textAlign = getCommonValue(selectedElements, 'textAlign');
  const letterSpacing = getCommonValue(selectedElements, 'letterSpacing');
  const lineHeight = getCommonValue(selectedElements, 'lineHeight');
  const padding = getCommonValue(selectedElements, 'padding') ?? '';
  const [state, setState] = useState({
    textAlign,
    letterSpacing,
    lineHeight,
    padding,
  });
  const [lockPaddingRatio, setLockPaddingRatio] = useState(true);
  useEffect(() => {
    setState({ textAlign, letterSpacing, lineHeight, padding });
  }, [textAlign, letterSpacing, lineHeight, padding]);
  const handleSubmit = (evt) => {
    onSetProperties(state);
    onSetProperties(({ padding: oldPadding }) => {
      const { padding: newPadding } = state;
      const ratio = getPaddingRatio(oldPadding.horizontal, oldPadding.vertical);
      if (
        lockPaddingRatio &&
        (newPadding.horizontal === '' || newPadding.vertical === '') &&
        ratio
      ) {
        if (newPadding.horizontal === '') {
          newPadding.horizontal = Math.round(newPadding.vertical * ratio);
        } else {
          newPadding.horizontal = Math.round(newPadding.horizontal / ratio);
        }
      }
      return { padding: newPadding };
    });
    evt.preventDefault();
  };

  const getPaddingRatio = (horizontal, vertical) => {
    if (!vertical || !horizontal) {
      return false;
    }
    return horizontal / vertical;
  };

  const alignmentOptions = [
    { name: __('Default', 'web-stories'), value: '' },
    { name: __('Left', 'web-stories'), value: 'left' },
    { name: __('Right', 'web-stories'), value: 'right' },
    { name: __('Center', 'web-stories'), value: 'center' },
    { name: __('Justify', 'web-stories'), value: 'justify' },
  ];

  return (
    <SimplePanel
      name="style"
      title={__('Style', 'web-stories')}
      onSubmit={handleSubmit}
    >
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
      <InputGroup
        label={__('Padding Horizontal', 'web-stories')}
        value={state.padding.horizontal}
        isMultiple={'' === padding}
        onChange={(value) => {
          const ratio = getPaddingRatio(padding.horizontal, padding.vertical);
          const newPadding = {
            horizontal: isNaN(value) || '' === value ? '' : parseInt(value),
          };
          newPadding.vertical =
            typeof padding.horizontal === 'number' && lockPaddingRatio && ratio
              ? Math.round(parseInt(newPadding.horizontal) / ratio)
              : padding.vertical;
          setState({ ...state, padding: newPadding });
        }}
        postfix={_x('%', 'Percentage', 'web-stories')}
      />
      <InputGroup
        label={__('Padding Vertical', 'web-stories')}
        value={state.padding.vertical}
        isMultiple={'' === padding}
        onChange={(value) => {
          const ratio = getPaddingRatio(padding.horizontal, padding.vertical);
          const newPadding = {
            vertical: isNaN(value) || '' === value ? '' : parseInt(value),
          };
          newPadding.horizontal =
            padding.horizontal !== '' &&
            typeof padding.vertical === 'number' &&
            lockPaddingRatio &&
            ratio
              ? Math.round(parseInt(newPadding.vertical) / ratio)
              : padding.horizontal;
          setState({ ...state, padding: newPadding });
        }}
        postfix={_x('%', 'Percentage', 'web-stories')}
      />
      <InputGroup
        type="checkbox"
        label={__('Keep padding ratio', 'web-stories')}
        value={lockPaddingRatio}
        isMultiple={false}
        onChange={(value) => {
          setLockPaddingRatio(value);
        }}
      />
    </SimplePanel>
  );
}

StylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default StylePanel;
