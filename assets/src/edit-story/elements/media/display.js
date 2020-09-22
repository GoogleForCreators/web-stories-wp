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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { elementFillContent } from '../shared';
import { useTransformHandler } from '../../components/transform';
import { getMediaWithScaleCss } from './util';
import getMediaSizePositionProps from './getMediaSizePositionProps';

const Element = styled.div`
  ${elementFillContent}
  ${({ showPlaceholder }) => showPlaceholder && `background-color: #C4C4C4;`}
  color: transparent;
  overflow: hidden;
`;

function MediaDisplay({
  element: { id, resource, scale, focalX, focalY },
  mediaRef,
  children,
  showPlaceholder = false,
}) {
  useTransformHandler(id, (transform) => {
    const target = mediaRef.current;
    if (mediaRef.current) {
      if (transform === null) {
        target.style.cssText = '';
      } else {
        const { resize } = transform;
        if (resize && resize[0] !== 0 && resize[1] !== 0) {
          const newImgProps = getMediaSizePositionProps(
            resource,
            resize[0],
            resize[1],
            scale,
            focalX,
            focalY
          );
          target.style.cssText = getMediaWithScaleCss(newImgProps);
        }
      }
    }
  });
  return <Element showPlaceholder={showPlaceholder}>{children}</Element>;
}

MediaDisplay.propTypes = {
  element: StoryPropTypes.elements.media,
  mediaRef: PropTypes.object,
  children: PropTypes.node.isRequired,
  showPlaceholder: PropTypes.bool,
};

export default MediaDisplay;
