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
import { useCallback } from '@googleforcreators/react';
import { PanelSections } from '@googleforcreators/design-system';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Pane, getTabId, getPaneId } from '../library/panes/shared';
import useStyle from './useStyle';
import { SELECTION, LINK, ANIMATION } from './constants';
import DesignPanel from './designPanel';
import useDesignPanels from './useDesignPanels';

export const StyledPane = styled(Pane)`
  height: 100%;
  padding: 0;
  overflow-y: auto;
`;

function StylePanes() {
  const { tab, tabs } = useStyle((state) => ({
    tab: state.state.tab,
    tabs: state.data.tabs,
  }));
  const { panels, createSubmitHandlerForPanel, panelProperties } =
    useDesignPanels();

  const getPanelsByType = useCallback(
    (types, paneProps) => {
      const panelsList = panels
        .filter(({ type }) => types.includes(type))
        .map(({ Panel, type }) => (
          <DesignPanel
            key={type}
            panelType={Panel}
            registerSubmitHandler={createSubmitHandlerForPanel(type)}
            {...panelProperties}
          />
        ));
      return (
        <StyledPane id={getPaneId(paneProps.key)} {...paneProps}>
          {panelsList}
        </StyledPane>
      );
    },
    [panels, createSubmitHandlerForPanel, panelProperties]
  );

  return tabs.map(({ id }) => {
    const isActive = id === tab;
    const paneProps = {
      key: id,
      isActive,
      'aria-labelledby': getTabId(id),
    };

    if (!isActive) {
      return <Pane key={id} {...paneProps} />;
    }

    switch (id) {
      case SELECTION.id:
        return getPanelsByType(PanelSections[id], paneProps);
      case LINK.id:
        return getPanelsByType(PanelSections[id], paneProps);
      case ANIMATION.id:
        return getPanelsByType(PanelSections[id], paneProps);
      default:
        return null;
    }
  });
}

export default StylePanes;
