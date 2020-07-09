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
import generatePatternStyles from '../../utils/generatePatternStyles';

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 *
 * @param {Object<*>} props Props.
 * @return {*} Rendered component.
 */
function ShapeOutput({ element: { backgroundColor, isDefaultBackground } }) {
  const style = isDefaultBackground
    ? null
    : generatePatternStyles(backgroundColor);
  return <div className="fill" style={style} />;
}

ShapeOutput.propTypes = {
  element: StoryPropTypes.elements.shape.isRequired,
};

export default ShapeOutput;
