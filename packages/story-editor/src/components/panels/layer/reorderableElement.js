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
import { useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useStory, useCanvas } from '../../../app';
import useFocusCanvas from '../../canvas/useFocusCanvas';
import { nestedOffsetCalcFunc } from './constants';
import ReorderableGroup from './reorderableGroup';
import ReorderableLayer from './reorderableLayer';

function ReorderableElement({
  isGroup,
  isFirstLayerAfterGroup = false,
  ...rest
}) {
  const setSelectedElementsById = useStory(
    ({ actions }) => actions.setSelectedElementsById
  );
  const focusCanvas = useFocusCanvas();
  const renamableLayer = useCanvas(({ state }) => state.renamableLayer);

  const handleStartReordering = useCallback(
    (element) => () => {
      setSelectedElementsById({ elementIds: [element.id] });

      if (renamableLayer) {
        focusCanvas();
      }
    },
    [setSelectedElementsById, focusCanvas, renamableLayer]
  );

  const props = { ...rest, handleStartReordering };

  if (isGroup) {
    return <ReorderableGroup {...props} />;
  }
  return (
    <ReorderableLayer
      nestedOffset={isFirstLayerAfterGroup}
      nestedOffsetCalcFunc={nestedOffsetCalcFunc}
      {...props}
    />
  );
}

ReorderableElement.propTypes = {
  isGroup: PropTypes.bool.isRequired,
  isFirstLayerAfterGroup: PropTypes.bool,
};

export default ReorderableElement;
