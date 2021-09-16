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
import { __ } from '@web-stories-wp/i18n';
import { useState } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import getUpdatedSizeAndPosition from '../../../../utils/getUpdatedSizeAndPosition';
import { styles, useHighlights, states } from '../../../../app/highlights';
import { SimplePanel } from '../../panel';
import { usePresubmitHandler } from '../../../form';
import StyleControls from './style';
import ColorControls from './color';
import FontControls from './font';

function StylePanel(props) {
  // use highlights to update panel styles
  // but don't dynamically adjust the `isPersistable` prop on `SimplePanel`
  // the textStyle panel automatically opens already whenever a text element is selected
  // if we update this to only be when there's a highlight the functionality that is expected
  // will be wrong.
  const { dropdownHighlight, colorHighlight, resetHighlight, cancelHighlight } =
    useHighlights((state) => ({
      dropdownHighlight: state[states.FONT],
      colorHighlight: state[states.TEXT_COLOR],
      resetHighlight: state.onFocusOut,
      cancelHighlight: state.cancelEffect,
    }));

  const [fontsFocused, setFontsFocused] = useState(false);

  // Update size and position if relevant values have changed.
  usePresubmitHandler(getUpdatedSizeAndPosition, []);

  return (
    <SimplePanel
      name="textStyle"
      title={__('Text', 'web-stories')}
      css={
        (dropdownHighlight?.showEffect || colorHighlight?.showEffect) &&
        styles.FLASH
      }
      onAnimationEnd={() => resetHighlight()}
      isPersistable={false}
    >
      <FontControls
        {...props}
        fontDropdownRef={(node) => {
          if (
            node &&
            dropdownHighlight?.focus &&
            dropdownHighlight?.showEffect
          ) {
            node.focus();
            setFontsFocused(true);
          }
        }}
        highlightStylesOverride={fontsFocused ? styles.OUTLINE : []}
      />
      <StyleControls {...props} />
      <ColorControls
        {...props}
        textColorRef={(node) => {
          if (node && colorHighlight?.focus && colorHighlight?.showEffect) {
            node.addEventListener('keydown', cancelHighlight, { once: true });
            node.focus();
            setFontsFocused(false);
          }
        }}
      />
    </SimplePanel>
  );
}

StylePanel.propTypes = {};

export default StylePanel;
