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
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import {
  Headline,
  Text,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import ShortcutLabel from './shortcutLabel';

const Header = styled(Headline).attrs({
  as: 'h3',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL,
})`
  margin-top: 24px;
  color: ${({ theme }) => theme.colors.fg.primary};
`;

const List = styled.dl`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 12px;
  align-items: center;
  margin: 12px 0 0;
`;

const ListRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  column-gap: 5px;
  align-items: center;

  dd {
    grid-column: 1;
    grid-row: 1;
  }
  dt {
    grid-column: 2;
    grid-row: 1;
  }
`;

const Label = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
  forwardedAs: 'span',
})`
  display: inline-block;
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

function ShortcutMenuSection({ title, commands }) {
  const headerId = `header-${uuidv4()}`;
  return (
    <>
      <Header id={headerId}>{title}</Header>
      <List title={title}>
        {commands.map(({ label, shortcut }) => (
          <ListRow key={label}>
            <ShortcutLabel keys={shortcut} alignment={'left'} />
            <dt>
              <Label>{label}</Label>
            </dt>
          </ListRow>
        ))}
      </List>
    </>
  );
}

ShortcutMenuSection.propTypes = {
  title: PropTypes.string.isRequired,
  commands: PropTypes.array.isRequired,
};

export default ShortcutMenuSection;
