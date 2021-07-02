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
import styled from 'styled-components';
import { sprintf, _n } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Icons } from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { PANEL_STATES } from './constants';
import {
  Badge,
  ButtonText,
  IconContainer,
  PanelText,
  PanelWrapper,
  TabButton,
  TabPanel,
} from './styles';

const Scrollable = styled.div`
  max-height: ${({ maxHeight }) => (maxHeight ? `calc(${maxHeight})` : 'none')};
  overflow-y: ${({ maxHeight }) => (maxHeight ? 'scroll' : 'auto')};
`;

const TablistPanel = ({
  badgeCount = 0,
  children,
  className,
  isExpanded,
  onClick,
  maxHeight,
  status = PANEL_STATES.NORMAL,
  title,
}) => {
  const panelId = useMemo(uuidv4, []);

  return (
    <PanelWrapper className={className} isExpanded={isExpanded}>
      <TabButton
        aria-controls={panelId}
        aria-label={sprintf(
          /* translators: %d: number of issues, %s: title */
          _n('%1$d %2$s issue', '%1$d %2$s issues', badgeCount, 'web-stories'),
          badgeCount,
          title
        )}
        aria-selected={isExpanded}
        onClick={onClick}
        role="tab"
        status={status}
      >
        <ButtonText>
          <IconContainer>
            <Icons.ChevronDownSmall />
          </IconContainer>
          <PanelText id={`${title}-${panelId}`} aria-hidden>
            {title}
          </PanelText>
        </ButtonText>
        <Badge>
          <PanelText aria-hidden>{badgeCount}</PanelText>
        </Badge>
      </TabButton>
      <Scrollable maxHeight={maxHeight}>
        <TabPanel aria-labelledby={`${title}-${panelId}`} role="tabpanel">
          {children}
        </TabPanel>
      </Scrollable>
    </PanelWrapper>
  );
};
TablistPanel.propTypes = {
  badgeCount: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
  isExpanded: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  maxHeight: PropTypes.string,
  status: PropTypes.oneOf(Object.values(PANEL_STATES)),
  title: PropTypes.string.isRequired,
};

export default TablistPanel;
