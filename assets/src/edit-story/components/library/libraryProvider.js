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
import PropTypes from 'prop-types';
import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { useFeatures } from 'flagged';
import { getTimeTracker } from '@web-stories-wp/tracking';
import { loadTextSets } from '@web-stories-wp/text-sets';
import { __ } from '@web-stories-wp/i18n';
/**
 * Internal dependencies
 */
import { TOOLTIP_PLACEMENT } from '../../../design-system';
import { useInsertElement, useInsertTextSet } from '../canvas';
import Context from './context';
import { MediaPane, MediaIcon } from './panes/media/local';
import { Media3pPane, Media3pIcon } from './panes/media/media3p';
import { ShapesPane, ShapesIcon } from './panes/shapes';
import { TextPane, TextIcon } from './panes/text';
import { ElementsPane, ElementsIcon } from './panes/elements';
import { PageTemplatesPane, PageTemplatesIcon } from './panes/pageTemplates';
import { getPaneId, Pane as SharedPane } from './panes/shared';

const MEDIA = {
  icon: MediaIcon,
  tooltip: __('WordPress media', 'web-stories'),
  placement: TOOLTIP_PLACEMENT.BOTTOM_START,
  Pane: MediaPane,
  id: 'media',
};
const MEDIA3P = {
  icon: Media3pIcon,
  tooltip: __('Thirdparty media', 'web-stories'),
  Pane: Media3pPane,
  id: 'media3p',
};
const TEXT = {
  icon: TextIcon,
  tooltip: __('Text', 'web-stories'),
  Pane: TextPane,
  id: 'text',
};
const SHAPES = {
  icon: ShapesIcon,
  tooltip: __('Shapes', 'web-stories'),
  Pane: ShapesPane,
  id: 'shapes',
};
const ELEMS = {
  icon: ElementsIcon,
  tooltip: __('Elements', 'web-stories'),
  Pane: ElementsPane,
  id: 'elements',
};
const PAGE_TEMPLATES = {
  icon: PageTemplatesIcon,
  tooltip: __('Page templates', 'web-stories'),
  Pane: PageTemplatesPane,
  id: 'pageTemplates',
};

const LAZY_TABS = [MEDIA3P.id, TEXT.id, PAGE_TEMPLATES.id];

function LibraryProvider({ children }) {
  const initialTab = MEDIA.id;
  const [tab, setTab] = useState(initialTab);
  const [textSets, setTextSets] = useState({});
  const renderedTabs = useRef({});
  const insertElement = useInsertElement();
  const { insertTextSet, insertTextSetByOffset } = useInsertTextSet();

  const { showElementsTab } = useFeatures();

  const renderEmptyPane = useCallback((id) => {
    const EmptyPane = (props) => <SharedPane id={getPaneId(id)} {...props} />;
    return EmptyPane;
  }, []);

  const tabs = useMemo(
    // Order here is important, as it denotes the actual visual order of elements.
    () =>
      [MEDIA, MEDIA3P, TEXT, SHAPES, showElementsTab && ELEMS, PAGE_TEMPLATES]
        .filter(Boolean)
        .map(({ Pane, id, ...rest }) => {
          const isLazyTab = LAZY_TABS.includes(id);
          const isActiveTab = tab === id;
          const hasBeenRendered = renderedTabs.current[id];
          const shouldRenderPane = !isLazyTab || isActiveTab || hasBeenRendered;
          return {
            id,
            Pane: shouldRenderPane ? Pane : renderEmptyPane(id),
            ...rest,
          };
        }),
    [tab, showElementsTab, renderEmptyPane]
  );

  const state = useMemo(
    () => ({
      state: {
        tab,
        initialTab,
        textSets,
      },
      actions: {
        setTab,
        insertElement,
        insertTextSet,
        insertTextSetByOffset,
      },
      data: {
        tabs: tabs,
      },
    }),
    [
      tab,
      insertElement,
      insertTextSet,
      insertTextSetByOffset,
      initialTab,
      tabs,
      textSets,
    ]
  );
  const getTextSets = useCallback(async () => {
    const trackTiming = getTimeTracker('load_text_sets');
    setTextSets(await loadTextSets());
    trackTiming();
  }, []);

  useEffect(() => {
    // track the rendered tabs
    const previouslyRenderedTabs = { ...renderedTabs.current };
    renderedTabs.current = { ...previouslyRenderedTabs, [tab]: true };

    // if text pane hasn't been rendered until now fetch dynamically imported text sets
    if (tab === TEXT.id && !previouslyRenderedTabs[tab]) {
      getTextSets();
    }
  }, [tab, getTextSets]);

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

LibraryProvider.propTypes = {
  children: PropTypes.node,
};

export default LibraryProvider;
