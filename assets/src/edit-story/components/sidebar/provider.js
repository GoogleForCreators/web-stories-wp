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
import { useState, useCallback, useRef } from 'react';

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/colorPicker';
import { WorkspaceLayout, CanvasArea } from '../workspace/layout';
import Context from './context';

const SidebarLayout = styled(WorkspaceLayout)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 0;
  z-index: 2;
`;

const Sidebar = styled(CanvasArea)`
  overflow: visible;
`;

const SidebarContent = styled.div`
  position: absolute;
  right: 20px;
  top: ${({ top }) => `${top}px`};
`;

const TYPE_COLORPICKER = 'colorpicker';

function SidebarProvider({ children }) {
  const [sidebarState, setSidebarState] = useState(null);

  const hasSidebar = sidebarState !== null;
  const offset = hasSidebar && sidebarState.offset;
  const type = hasSidebar && sidebarState.type;
  const props = hasSidebar && sidebarState.props;

  const ref = useRef();

  const showColorPickerAt = useCallback((node, colorProps) => {
    const colorOffset =
      node.getBoundingClientRect().y - ref.current.getBoundingClientRect().y;
    setSidebarState({
      type: TYPE_COLORPICKER,
      offset: colorOffset,
      props: colorProps,
    });
  }, []);

  const hideSidebar = useCallback(() => {
    setSidebarState(null);
  }, []);

  const value = {
    state: {
      hasSidebar,
    },
    actions: {
      showColorPickerAt,
      hideSidebar,
    },
  };

  return (
    <Context.Provider value={value}>
      <SidebarLayout>
        <Sidebar ref={ref}>
          {hasSidebar && (
            <SidebarContent top={offset}>
              {type === TYPE_COLORPICKER && <ColorPicker {...props} />}
            </SidebarContent>
          )}
        </Sidebar>
      </SidebarLayout>
      {children}
    </Context.Provider>
  );
}

SidebarProvider.propTypes = {
  children: PropTypes.node,
};

export default SidebarProvider;
