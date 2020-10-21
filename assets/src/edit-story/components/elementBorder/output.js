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
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { getBorderStyle } from './utils';

function ElementBorder({ element: { border, width, height } }) {
  const dataToBorderWidthX = (x) => (x / width) * 100;
  const dataToBorderWidthY = (y) => (y / height) * 100;
  const style = getBorderStyle(
    {
      ...border,
      top: dataToBorderWidthY(border.top),
      left: dataToBorderWidthX(border.left),
      right: dataToBorderWidthX(border.right),
      bottom: dataToBorderWidthY(border.bottom),
    },
    '%'
  );
  return <div style={style} />;
}

ElementBorder.propTypes = {
  element: StoryPropTypes.element.isRequired,
};

export default ElementBorder;
