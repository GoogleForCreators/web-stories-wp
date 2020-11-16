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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { elementFillContent, elementWithBackgroundColor } from '../shared';
import StoryPropTypes from '../../types';
import {useTransformHandler} from "../../components/transform";
import getMediaSizePositionProps from "../media/getMediaSizePositionProps";
import {getMediaWithScaleCss} from "../media/util";
import {useRef} from "react";
import useColorTransformHandler from "../shared/useColorTransformHandler";

const Element = styled.div`
  ${elementFillContent}
  ${elementWithBackgroundColor}
`;

function ShapeDisplay({
  element: { isDefaultBackground, backgroundColor, id },
}) {
  const ref = useRef(null);
  useColorTransformHandler({ id, targetRef: ref, style: 'background-color' });
  if (isDefaultBackground) {
    return <Element />;
  }
  return <Element ref={ref} backgroundColor={backgroundColor} />;
}

ShapeDisplay.propTypes = {
  element: StoryPropTypes.elements.shape.isRequired,
};

export default ShapeDisplay;
