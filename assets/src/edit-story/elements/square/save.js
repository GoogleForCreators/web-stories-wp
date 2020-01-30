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
 * Internal dependencies
 */
import {getCommonAttributes} from '../shared';

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 */
function SquareSave({id, backgroundColor, width, height, x, y, rotationAngle}) {
  const style = {
    ...getCommonAttributes({width, height, x, y, rotationAngle}),
    background: backgroundColor,
  };
  return <div id={'el-' + id} style={{...style}} />;
}

SquareSave.propTypes = {
  rotationAngle: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
};

export default SquareSave;
