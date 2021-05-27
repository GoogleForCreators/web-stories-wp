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
import { useRef } from 'react';
/**
 * Internal dependencies
 */
import getUpdatedSizeAndPosition from '../../../../utils/getUpdatedSizeAndPosition';
import { styles, useFocusHighlight, states } from '../../../../app/highlights';
import { SimplePanel } from '../../panel';
import { usePresubmitHandler } from '../../../form';
import StyleControls from './style';
import ColorControls from './color';
import FontControls from './font';

function StylePanel(props) {
  const fontDropdownRef = useRef(null);
  const textColorRef = useRef(null);
  const dropdownHighlight = useFocusHighlight(states.FONT, fontDropdownRef);
  const colorHighlight = useFocusHighlight(states.TEXT_COLOR, textColorRef);
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
      isPersistable={false}
    >
      <FontControls {...props} fontDropdownRef={fontDropdownRef} />
      <StyleControls {...props} />
      <ColorControls {...props} textColorRef={textColorRef} />
    </SimplePanel>
  );
}

StylePanel.propTypes = {};

export default StylePanel;
