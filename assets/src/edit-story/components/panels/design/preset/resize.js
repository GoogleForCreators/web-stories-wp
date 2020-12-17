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
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useContext } from 'use-context-selector';

/**
 * Internal dependencies
 */
import DragHandle from '../../panel/shared/handle';
import panelContext from '../../panel/context';
import useInspector from '../../../inspector/useInspector';
import { PANEL_COLLAPSED_THRESHOLD } from '../../panel/panel';

function Resize({ position }) {
  const {
    state: { height },
    actions: { setHeight, setExpandToHeight, resetHeight },
  } = useContext(panelContext);

  const {
    state: { inspectorContentHeight },
  } = useInspector();

  // Max panel height is set to 70% of full available height.
  const maxHeight = Math.round(inspectorContentHeight * 0.7);

  const handleHeightChange = useCallback(
    (deltaHeight) =>
      setHeight((value) =>
        Math.max(0, Math.min(maxHeight, value - deltaHeight))
      ),
    [setHeight, maxHeight]
  );

  const handleExpandToHeightChange = useCallback(() => {
    if (height >= PANEL_COLLAPSED_THRESHOLD) {
      setExpandToHeight(height);
    }
  }, [setExpandToHeight, height]);

  return (
    <DragHandle
      height={height}
      minHeight={0}
      maxHeight={maxHeight}
      handleHeightChange={handleHeightChange}
      handleExpandToHeightChange={handleExpandToHeightChange}
      handleDoubleClick={resetHeight}
      position={position}
    />
  );
}

Resize.propTypes = {
  position: PropTypes.oneOf(['top', 'bottom']),
};

DragHandle.defaultProps = {
  position: 'top',
};

export default Resize;
