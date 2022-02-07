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
import { useUnits } from '@googleforcreators/units';
import { StoryPropTypes } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { shouldDisplayBorder } from './utils/elementBorder';
import BorderedMaskedElement from './borderedMaskedElement';

export default function WithMask({
  element,
  fill,
  previewMode = false,
  responsiveBorder,
  ...rest
}) {
  const { dataToEditorX, dataToEditorY } = useUnits((state) => ({
    dataToEditorX: state.actions.dataToEditorX,
    dataToEditorY: state.actions.dataToEditorY,
  }));

  const getBorderWidth = () =>
    !previewMode ? element.border?.left : responsiveBorder?.left;
  const postfix = previewMode ? '-preview' : '';
  const elementWidth = dataToEditorX(element.width);
  const elementHeight = dataToEditorY(element.height);
  const forceRectangularMask = shouldDisplayBorder(element);

  return (
    <BorderedMaskedElement
      element={element}
      hasFill={fill}
      getBorderWidth={getBorderWidth}
      postfix={postfix}
      elementWidth={elementWidth}
      elementHeight={elementHeight}
      forceRectangularMask={forceRectangularMask}
      {...rest}
    />
  );
}

WithMask.propTypes = {
  element: StoryPropTypes.element.isRequired,
  style: PropTypes.object,
  applyFlip: PropTypes.bool,
  fill: PropTypes.bool,
  children: PropTypes.node.isRequired,
  box: StoryPropTypes.box.isRequired,
  previewMode: PropTypes.bool,
  responsiveBorder: PropTypes.object,
};
