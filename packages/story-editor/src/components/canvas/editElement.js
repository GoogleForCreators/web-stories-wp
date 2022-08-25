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
    const { getBox, getBoxWithBorder } = useUnits((state) => ({
      getBox: state.actions.getBox,
      getBoxWithBorder: state.actions.getBoxWithBorder,
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
    // In case of text edit mode, we include the border to the selection, so get the box with border.
    const isText = 'text' === type;
    const editBox = isText
      ? getBoxWithBorder(elementWithLocal)
      : getBox(elementWithLocal);

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
