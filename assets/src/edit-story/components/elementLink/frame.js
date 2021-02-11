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
import { rgba } from 'polished';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import Popup from '../popup';
import { getLinkFromElement } from './index';

const Tooltip = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.mg.v3};
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.family};
  font-size: 14px;
  line-height: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.lineHeight};
  letter-spacing: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.body1.letterSpacing};
  padding: 6px;
  border-radius: 6px;
  box-shadow: 0px 6px 10px
    ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.bg.black, 0.1)};
  display: flex;
  justify-content: center;
  flex-direction: row;
  max-width: 200px;
  pointer-events: all;

  &:after {
    content: '';
    position: absolute;
    bottom: -6px;
    border-top: 6px solid
      ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    box-shadow: 0px 6px 10px
      ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.bg.black, 0.1)};
  }
`;

const BrandIcon = styled.img`
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.v3};
  border: none;
  border-radius: 50%;
  margin-right: 8px;
`;

const LinkDesc = styled.span`
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const spacing = { y: 16 };

function WithLink({ element, active, children, anchorRef }) {
  const link = getLinkFromElement(element);

  return (
    <>
      {children}
      <Popup
        anchor={anchorRef}
        isOpen={active}
        placement={'top'}
        spacing={spacing}
      >
        {Boolean(link?.url) && (
          <Tooltip>
            <BrandIcon src={link.icon} />
            <LinkDesc>{link.desc || link.url}</LinkDesc>
          </Tooltip>
        )}
      </Popup>
    </>
  );
}

WithLink.propTypes = {
  element: StoryPropTypes.element.isRequired,
  anchorRef: PropTypes.object,
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default WithLink;
