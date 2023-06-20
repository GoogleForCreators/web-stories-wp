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
import ShortcutMenu from '../shortcutMenu';

export default {
  title: 'Stories Editor/Components/Keyboard Shortcuts Menu',
  component: ShortcutMenu,
};

// Make the menu a little easier to see in isolation on storyBook.
const Container = styled.div`
  width: 800px;
  height: 100vh;
  margin: -50px 10px 0;
`;
export const _default = {
  render: function Render() {
    return (
      <Container>
        <ShortcutMenu />
      </Container>
    );
  },
};
