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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import getUpdatedSizeAndPosition from '../../../../utils/getUpdatedSizeAndPosition';
import { SimplePanel } from '../../panel';
import { usePresubmitHandler } from '../../../form';
import StyleControls from './style';
import ColorControls from './color';
import PaddingControls from './padding';
import FontControls from './font';

function StylePanel(props) {
  // Update size and position if relevant values have changed.
  usePresubmitHandler(getUpdatedSizeAndPosition, []);

  return (
    <SimplePanel
      name="style"
      title={__('Style', 'web-stories')}
      isPersistable={false}
    >
      <FontControls {...props} />
      <StyleControls {...props} />
      <ColorControls {...props} />
      <PaddingControls {...props} />
    </SimplePanel>
  );
}

StylePanel.propTypes = {};

export default StylePanel;
