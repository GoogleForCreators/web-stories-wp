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
import KeyboardShortcutsMenu from '../keyboardShortcutsMenu';
import { HelpCenter } from '../helpCenter';

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
`;

const MenuItems = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 16px 16px;
`;

const Box = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Space = styled.span`
  width: 8px;
`;

function SecondaryMenu() {
  return (
    <Wrapper>
      <MenuItems>
        <HelpCenter />
        <Space />
        <Box>
          <KeyboardShortcutsMenu />
        </Box>
      </MenuItems>
    </Wrapper>
  );
}

export default SecondaryMenu;
