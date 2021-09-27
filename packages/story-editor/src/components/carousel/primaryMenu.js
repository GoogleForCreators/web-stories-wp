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

/**
 * Internal dependencies
 */
import ZoomSelector from './zoomSelector';
import { GridViewButton } from './gridview';

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
`;

const MenuItems = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 16px 16px;
  gap: 8px;
`;

function PrimaryMenu() {
  return (
    <Wrapper>
      {/* This ID is used for portal rendering of additional menu items, e.g. for custom meta boxes */}
      <MenuItems id="primary-menu-items">
        <ZoomSelector />
        <GridViewButton />
      </MenuItems>
    </Wrapper>
  );
}

export default PrimaryMenu;
