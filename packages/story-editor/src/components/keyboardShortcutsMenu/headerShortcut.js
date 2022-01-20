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
import { Headline, THEME_CONSTANTS } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { header } from './keyboardShortcutList';
import ShortcutLabel from './shortcutLabel';

const List = styled.dl`
  margin: 24px;
  display: flex;
  flex-shrink: 0;
`;

const Item = styled.dt`
  margin: 0 12px 0 0;
`;

function HeaderShortcut(props) {
  const { label, shortcut } = header;

  return (
    <List>
      <Item>
        <Headline
          as="h2"
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
          {...props}
        >
          {label}
        </Headline>
      </Item>
      <ShortcutLabel keys={shortcut} />
    </List>
  );
}

export default HeaderShortcut;
