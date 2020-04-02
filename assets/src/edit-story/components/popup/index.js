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
import { createPortal } from 'react-dom';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { ADMIN_TOOLBAR_HEIGHT } from '../../constants';

const DEFAULT_WIDTH = 270;

const PopUp = styled.div`
  position: absolute;
  z-index: 999;
  top: ${({ y }) => `${y}px`};
  left: ${({ x }) => `${x}px`};
  width: ${({ width }) => width}px;
`;

function Popup({ root, children, width = DEFAULT_WIDTH }) {
  const nodeRect = root.getBoundingClientRect();
  const bodyRect = document.body.getBoundingClientRect();

  // This displays the popup right under the node, currently no variations implemented.
  const nodeOffset = {
    x: nodeRect.left - bodyRect.left - width + nodeRect.width,
    y: nodeRect.top - bodyRect.top + nodeRect.height + ADMIN_TOOLBAR_HEIGHT,
  };
  return createPortal(
    <PopUp {...nodeOffset} width={width}>
      {children}
    </PopUp>,
    document.body
  );
}

export default Popup;
