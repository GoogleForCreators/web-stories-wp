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
import { rgba } from 'polished';
import { forwardRef } from 'react';

/**
 * Internal dependencies
 */
import useUploadDropTarget from './use';

const Overlay = styled.div`
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => rgba(theme.colors.bg.v11, 0.6)};
`;

function UploadDropTargetOverlayWithRef(props, ref) {
  const { isDragging } = useUploadDropTarget((state) => ({
    isDragging: state.isDragging,
  }));
  if (!isDragging) {
    return null;
  }
  return <Overlay ref={ref} {...props} />;
}

const UploadDropTargetOverlay = forwardRef(UploadDropTargetOverlayWithRef);

export default UploadDropTargetOverlay;
