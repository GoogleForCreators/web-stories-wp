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
import { __ } from '@googleforcreators/i18n';
import { TOOLTIP_PLACEMENT } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import Tooltip from '../tooltip';
import { getLinkFromElement } from '.';

const StyledTooltip = styled(Tooltip)`
  box-shadow: 0px 6px 10px
    ${({ theme }) => rgba(theme.colors.standard.black, 0.1)};
  align-items: center;
  p {
    display: flex;
    max-width: 100%;
  }
`;

const IconWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.fg.secondary};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
  display: inline-block;
`;

const BrandIcon = styled.img`
  width: 100%;
  height: 100%;
  border: none;
`;

const LinkDesc = styled.span`
  padding-top: 2px;
  flex: 1;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

function WithLink({ element, active, children, anchorRef }) {
  const link = getLinkFromElement(element);

  const tooltipContent =
    link?.url && active ? (
      <>
        <IconWrapper>
          {link?.icon && (
            <BrandIcon
              src={link.icon}
              alt={__('Site Icon', 'web-stories')}
              decoding="async"
              crossOrigin="anonymous"
            />
          )}
        </IconWrapper>
        <LinkDesc>{link.desc || link.url}</LinkDesc>
      </>
    ) : null;

  return (
    <StyledTooltip
      forceAnchorRef={anchorRef}
      placement={TOOLTIP_PLACEMENT.TOP_START}
      title={tooltipContent}
    >
      {children}
    </StyledTooltip>
  );
}

WithLink.propTypes = {
  element: StoryPropTypes.element.isRequired,
  anchorRef: PropTypes.object,
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default WithLink;
