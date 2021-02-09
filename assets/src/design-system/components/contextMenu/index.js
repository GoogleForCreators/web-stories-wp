/*
 * Copyright 2021 Google LLC
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
import { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { Link } from '../typography/link';
import { Text } from '../typography/text';

const Popover = styled.div(
  ({ isOpen, theme }) => css`
    position: absolute;
    display: none;
    margin: 5px 0 0;
    background-color: transparent;
    pointer-events: none;
    border-radius: ${theme.borders.radius.small};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    ${isOpen &&
    css`
      display: block;
      z-index: 10;
      opacity: 1;
      pointer-events: auto;
    `};
  `
);

const MenuContainer = styled.ul`
  background-color: ${({ theme }) => theme.colors.standard.white};
  border-radius: 8px;
  margin: 0;
  min-width: 210px;
  padding: 5px 0;
  pointer-events: auto;
  list-style: none;

  a {
    background-color: none;
    text-decoration: none;
  }

  li {
    a {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
    }

    &.separatorTop {
      border-top: 1px solid ${({ theme }) => theme.colors.bg.tertiary};
    }

    &.separatorBottom {
      border-bottom: 1px solid ${({ theme }) => theme.colors.bg.tertiary};
    }
  }
`;

const MenuItem = styled(Text)(
  ({ theme }) => css`
    max-width: 200px;
  `
);
const Shortcut = styled(Text)(
  ({ theme }) => css`
    margin-right: 5px;
    color: ${theme.colors.bg.tertiary};
  `
);

const InnerContent = ({ items }) => {
  const ids = useMemo(() => items.map(() => uuidv4()), [items]);

  return (
    <MenuContainer>
      {items.map((item, index) => (
        <li
          key={ids[index]}
          className={
            (item.separator === 'top' && 'separatorTop') ||
            (item.separator === 'bottom' && 'separatorBottom')
          }
        >
          <Link>
            <MenuItem forwardedAs="span">{item.label}</MenuItem>
            <Shortcut forwardedAs="span">{'%C'}</Shortcut>
          </Link>
        </li>
      ))}
    </MenuContainer>
  );
};

InnerContent.propTypes = {
  items: PropTypes.arrayOf({
    disabled: PropTypes.bool,
    label: PropTypes.string.isRequired,
    separator: PropTypes.oneOf(['bottom', 'top']),
    shortcut: PropTypes.string,
    value: PropTypes.string.isRequired,
  }),
};

const ContextMenu = ({ isOpen, ...props }) => {
  return (
    <Popover isOpen={isOpen}>
      <InnerContent {...props} />
    </Popover>
  );
};

ContextMenu.propTypes = {
  isOpen: PropTypes.bool,
};

export default ContextMenu;
