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
import { ReactComponent as Link } from '../../icons/link.svg';
import { ReactComponent as External } from '../../icons/external.svg';
import { getLinkFromElement } from './index';

const Tooltip = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.fg.v1};
  color: ${({ theme }) => theme.colors.mg.v3};
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: 14px;
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body1.letterSpacing};
  padding: 6px;
  border-radius: 6px;
  box-shadow: 0px 6px 10px ${({ theme }) => rgba(theme.colors.bg.v0, 0.1)};
  margin-top: -68px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  max-width: 200px;
  pointer-events: all;

  &:after {
    content: '';
    position: absolute;
    bottom: -6px;
    border-top: 6px solid ${({ theme }) => theme.colors.fg.v1};
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    box-shadow: 0px 6px 10px ${({ theme }) => rgba(theme.colors.bg.v0, 0.1)};
  }
`;

const BrandIcon = styled.img`
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.colors.fg.v3};
  border: none;
  border-radius: 50%;
  margin-right: 8px;
`;

const LinkOut = styled.a`
  margin-left: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const LinkOutIcon = styled(External)`
  width: 16px;
  opacity: 0.59;
`;

const LinkIcon = styled(Link)`
  position: absolute;
  left: -24px;
  top: 12px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  width: 18px;
  height: 18px;
  filter: drop-shadow(
    0px 3px 4px ${({ theme }) => rgba(theme.colors.bg.v0, 0.6)}
  );
`;

const LinkDesc = styled.span`
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const TooltipContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
`;

function WithLink({ element, active, dragging, children }) {
  const link = getLinkFromElement(element);

  return (
    <>
      {children}
      {link && !active && !dragging && <LinkIcon />}
      {link && active && !dragging && (
        <TooltipContainer>
          <Tooltip>
            <BrandIcon src={link.icon} />
            <LinkDesc>{link.desc || link.url}</LinkDesc>
            <LinkOut href={link.url} target="_blank" rel="noopener noreferrer">
              <LinkOutIcon />
            </LinkOut>
          </Tooltip>
        </TooltipContainer>
      )}
    </>
  );
}

WithLink.propTypes = {
  element: StoryPropTypes.element.isRequired,
  active: PropTypes.bool.isRequired,
  dragging: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default WithLink;
