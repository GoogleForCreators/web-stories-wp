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
import StoryPropTypes from '../../../../../types';
import DisplayElement from '../../../../canvas/displayElement';
import { UnitsProvider } from '../../../../../units';
import { PAGE_WIDTH } from '../../../../../constants';

function getElementContent(content, isForDisplay) {
  if (!content) {
    return {};
  }

  return {
    content: isForDisplay
      ? `<span style="color: #fff">${content}<span>`
      : content,
  };
}

function TextSetContainer({ pageSize, children }) {
  return pageSize ? (
    <UnitsProvider pageSize={pageSize}>{children}</UnitsProvider>
  ) : (
    children
  );
}

TextSetContainer.propTypes = {
  pageSize: StoryPropTypes.size,
  children: PropTypes.node.isRequired,
};

function TextSetElements({ elements, isForDisplay, pageSize }) {
  const { textSetHeight, textSetWidth } = elements[0];

  const xOffset = isForDisplay ? (PAGE_WIDTH - textSetWidth) / 2 : 0;
  const yOffset = isForDisplay ? (PAGE_WIDTH - textSetHeight) / 2 : 0;

  return (
    <TextSetContainer pageSize={pageSize}>
      {elements.map(
        ({ id, content, normalizedOffsetX, normalizedOffsetY, ...rest }) => (
          <DisplayElement
            previewMode
            key={id}
            element={{
              id,
              ...getElementContent(content, isForDisplay),
              ...rest,
              x: normalizedOffsetX + xOffset,
              y: normalizedOffsetY + yOffset,
            }}
          />
        )
      )}
    </TextSetContainer>
  );
}

TextSetElements.propTypes = {
  elements: PropTypes.array.isRequired,
  pageSize: StoryPropTypes.size,
  isForDisplay: PropTypes.bool,
};

export default TextSetElements;
