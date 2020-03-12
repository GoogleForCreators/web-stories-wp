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
import styled from 'styled-components';
import { useCallback, useState } from 'react';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import Context from './context';
import getDragType from './getDragType';

const DropTargetComponent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

// The glasspane is displayed above everything and takes over the DND events.
// This is the safest way to avoid false-positive enter/leave events.
const Glasspane = styled.div`
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

function disableDefaults(evt) {
  evt.preventDefault();
  evt.stopPropagation();
}

function UploadDropTarget({ label, labelledBy, onDrop, children }) {
  const [isDragging, setIsDragging] = useState(false);

  const onDragEnter = useCallback((evt) => {
    const { dataTransfer } = evt;
    if (getDragType(dataTransfer) !== 'file') {
      // Only consider DND with files.
      return;
    }
    disableDefaults(evt);
    dataTransfer.effectAllowed = 'copy';
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((evt) => {
    disableDefaults(evt);
    setIsDragging(false);
  }, []);

  const onDropHandler = useCallback(
    (evt) => {
      disableDefaults(evt);
      setIsDragging(false);
      if (onDrop) {
        onDrop([...evt.dataTransfer.files]);
      }
    },
    [onDrop]
  );

  return (
    <DropTargetComponent onDragEnter={onDragEnter} onDrop={onDropHandler}>
      {isDragging && (
        <Glasspane
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={disableDefaults}
          onDrop={onDropHandler}
          aria-label={label}
          aria-labelledby={labelledBy}
        />
      )}
      <Context.Provider value={{ isDragging }}>
        <Content>{children}</Content>
      </Context.Provider>
    </DropTargetComponent>
  );
}

UploadDropTarget.propTypes = {
  label: PropTypes.string,
  labelledBy: PropTypes.string,
  onDrop: PropTypes.func.isRequired,
  children: StoryPropTypes.children.isRequired,
};

UploadDropTarget.defaultProps = {
  label: null,
  labelledBy: null,
};

export default UploadDropTarget;
