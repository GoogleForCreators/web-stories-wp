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
import { __ } from '@googleforcreators/i18n';
import styled from 'styled-components';
import { THEME_CONSTANTS, Text } from '@googleforcreators/design-system';
import { useCallback } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import TabView from '../tabview';
import { states, useHighlights } from '../../app/highlights';
import { getTabId, getPaneId } from '../library/panes/shared';
import { useStory } from '../../app/story';
import useStyle from './useStyle';
import { SELECTION, LINK, ANIMATION } from './constants';
import StylePanes from './stylePanes';

const Layout = styled.section.attrs({
  'aria-label': __('Style', 'web-stories'),
  'data-testid': 'styleLayout',
})`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  color: ${({ theme }) => theme.colors.fg.primary};
  max-height: 100%;
`;

const TabsArea = styled.nav.attrs({
  'aria-label': __('Style tabs', 'web-stories'),
})`
  padding: 0 4px;
`;

const UnjustifiedTabView = styled(TabView)`
  justify-content: center;
`;

const StylePaneContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  min-height: 0;
`;

const NoSelection = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Note = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

function StyleLayout() {
  const {
    state: { tab },
    actions: { setTab },
    refs: { tabRefs },
    data: { tabs },
  } = useStyle();

  const { selectedElementIds } = useStory(({ state }) => ({
    selectedElementIds: state.selectedElementIds,
  }));

  const { highlight, resetHighlight } = useHighlights((state) => ({
    highlight: {
      [SELECTION.id]: state[states.STYLE],
      [LINK.id]: state[states.STYLE],
      [ANIMATION.id]: state[states.STYLE],
    },
    resetHighlight: state.onFocusOut,
  }));

  const onTabChange = useCallback(
    (id) => {
      setTab(id);
      resetHighlight();
      trackEvent('style_tab_change', {
        name: id,
      });
    },
    [setTab, resetHighlight]
  );

  if (selectedElementIds.length === 0) {
    return (
      <NoSelection>
        <Note size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.MEDIUM}>
          {__('Nothing selected', 'web-stories')}
        </Note>
      </NoSelection>
    );
  }

  return (
    <Layout>
      <TabsArea>
        <UnjustifiedTabView
          label={__('Style Selection', 'web-stories')}
          tabs={tabs}
          tabRefs={tabRefs}
          tab={tab}
          onTabChange={onTabChange}
          onTabRefUpdated={(node, tabId) => {
            const h = highlight[tabId];
            if (node && h?.focus && h?.showEffect) {
              node.focus();
            }
          }}
          getTabId={getTabId}
          getAriaControlsId={getPaneId}
        />
      </TabsArea>
      <StylePaneContainer>
        <StylePanes />
      </StylePaneContainer>
    </Layout>
  );
}

export default StyleLayout;
