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
import { Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { Headline, Text, THEME_CONSTANTS } from '../../../design-system';
import ShortcutLabel from './shortcutLabel';

const Header = styled(Headline).attrs({
  as: 'h2',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL,
})`
  margin-top: 24px;
  color: ${({ theme }) => theme.colors.fg.primary};
`;

const List = styled.dl`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 12px;
  column-gap: 5px;
  align-items: center;
  margin: 12px 0 0;
`;

const Label = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

function ShortcutMenuSection({ title, commands }) {
  const headerId = `header-${uuidv4()}`;
  return (
    <>
      <Header id={headerId}>{title}</Header>
      <List role="group" aria-labelledby={headerId}>
        {commands.map(({ label, shortcut }) => (
          <Fragment key={label}>
            <ShortcutLabel keys={shortcut} alignment={'left'} />
            <Label role="listitem">{label}</Label>
          </Fragment>
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
