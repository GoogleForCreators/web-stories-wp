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
import { memo, useState, forwardRef } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useUnits } from '@googleforcreators/units';
import { getDefinitionForType } from '@googleforcreators/elements';
import {
  elementWithPosition,
  elementWithSize,
  elementWithRotation,
} from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import useCORSProxy from '../../utils/useCORSProxy';
import { useConfig, useStory, useFont } from '../../app';
import useVideoTrim from '../videoTrim/useVideoTrim';

const Z_INDEX_CANVAS = {
  FLOAT_PANEL: 11,
};

const Wrapper = styled.div`
  ${elementWithPosition}
  ${elementWithSize}
  ${elementWithRotation}
  pointer-events: initial;
`;

const EditElement = memo(
  forwardRef(function EditElement({ element, editWrapper, onResize }, ref) {
    const { id, type } = element;
    const { getBox } = useUnits((state) => ({
      getBox: state.actions.getBox,
    }));
    const { getProxiedUrl } = useCORSProxy();
    const { isRTL, styleConstants: { topOffset } = {} } = useConfig();
    const {
      actions: { maybeEnqueueFontStyle },
    } = useFont();

    // Update the true global properties of the current element
    // This now only happens on unmount
    const { updateElementById, deleteSelectedElements } = useStory((state) => ({
      updateElementById: state.actions.updateElementById,
      deleteSelectedElements: state.actions.deleteSelectedElements,
    }));
    const { isTrimMode, resource, setVideoNode } = useVideoTrim(
      ({ state: { isTrimMode, videoData }, actions: { setVideoNode } }) => ({
        isTrimMode,
        setVideoNode,
        resource: videoData?.resource,
      })
    );

    // Needed for elements that can scale in edit mode.
    const [localProperties, setLocalProperties] = useState(null);

    const { Edit } = getDefinitionForType(type);
    const elementWithLocal = localProperties
      ? { ...element, ...localProperties }
      : element;
    const box = getBox(elementWithLocal);
    // We're adding the border in pixels since the element is the content + the border in pixels
    const { border } = element;
    const boxWithBorder = {
      ...box,
      x: box.x - (border.left || 0),
      y: box.y - (border.top || 0),
      width: box.width + (border.left || 0) + (border.right || 0),
      height: box.height + (border.top || 0) + (border.bottom || 0),
    };
    // In case of text edit mode, we include the border to the selection.
    const isText = 'text' === type;
    const editBox = isText ? boxWithBorder : box;

    return (
      <Wrapper aria-labelledby={`layer-${id}`} {...editBox} ref={ref}>
        <Edit
          element={elementWithLocal}
          box={editBox}
          editWrapper={editWrapper}
          onResize={onResize}
          setLocalProperties={setLocalProperties}
          getProxiedUrl={getProxiedUrl}
          isRTL={isRTL}
          topOffset={topOffset}
          isTrimMode={isTrimMode}
          resource={resource}
          setVideoNode={setVideoNode}
          updateElementById={updateElementById}
          deleteSelectedElements={deleteSelectedElements}
          maybeEnqueueFontStyle={maybeEnqueueFontStyle}
          zIndexCanvas={Z_INDEX_CANVAS}
        />
      </Wrapper>
    );
  })
);

EditElement.propTypes = {
  element: PropTypes.object.isRequired,
  editWrapper: PropTypes.object,
  onResize: PropTypes.func,
};

export default EditElement;
