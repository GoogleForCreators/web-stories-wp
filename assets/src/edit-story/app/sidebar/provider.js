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
import createSolid from '../../utils/createSolid';
import {
  LIBRARY_MIN_WIDTH,
  LIBRARY_MAX_WIDTH,
  INSPECTOR_MIN_WIDTH,
  INSPECTOR_MAX_WIDTH,
} from '../../constants';
import Context from './context';

const SidebarLayout = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: grid;
  z-index: 2;
  grid:
    '. sidebar .' 1fr
    / minmax(${LIBRARY_MIN_WIDTH}px, ${LIBRARY_MAX_WIDTH}px) 1fr minmax(${INSPECTOR_MIN_WIDTH}px, ${INSPECTOR_MAX_WIDTH}px);
`;

const Sidebar = styled.div`
  grid-area: sidebar;
  height: 100%;
  position: relative;
`;

const SidebarContent = styled.div`
  position: absolute;
  right: 0px;
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

  const hideColorPicker = useCallback(() => {
    setSidebarState(null);
  }, []);

  const value = {
    state: {
      hasSidebar,
    },
    actions: {
      showColorPickerAt,
      hideColorPicker,
    },
  };

  return (
    <Context.Provider value={value}>
      <SidebarLayout>
        <Sidebar ref={ref}>
          {hasSidebar && (
            <SidebarContent top={offset}>
              {type === TYPE_COLORPICKER && (
                <ColorPicker
                  color={createSolid(255, 255, 255)}
                  onChange={() => {}}
                  {...props}
                />
              )}
            </SidebarContent>
          )}
        </Sidebar>
      </SidebarLayout>
      {children}
    </Context.Provider>
  );
}

SidebarProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default SidebarProvider;
