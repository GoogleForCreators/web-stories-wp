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
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useFocusOut,
  useMemo,
} from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';
import { useGridViewKeys } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { CardGrid } from '../../../../components';
import {
  PageSizePropType,
  TemplatesPropType,
  TemplateActionsPropType,
} from '../../../../types';
import { useConfig } from '../../../config';
import { resolveRoute } from '../../../router';
import TemplateGridItem, { FOCUS_TEMPLATE_CLASS } from './templateGridItem';

function TemplateGridView({ pageSize, templates, templateActions }) {
  const { isRTL } = useConfig();
  const containerRef = useRef();
  const gridRef = useRef();
  const itemRefs = useRef({});

  const [activeGridItemId, setActiveGridItemId] = useState(null);

  const handleUseStory = useCallback(
    ({ id, title }) => {
      trackEvent('use_template', {
        name: title,
        template_id: id,
      });
      templateActions.createStoryFromTemplate(id);
    },
    [templateActions]
  );

  useGridViewKeys({
    containerRef,
    gridRef,
    itemRefs,
    isRTL,
    currentItemId: activeGridItemId,
    items: templates,
  });

  // when keyboard focus changes and updated activeGridItemId
  // immediately focus the first interactive element in the grid item
  // for legibility, it's based on the FOCUS_TEMPLATE_CLASS
  useEffect(() => {
    if (activeGridItemId) {
      itemRefs.current?.[activeGridItemId]
        ?.querySelector(`.${FOCUS_TEMPLATE_CLASS}`)
        ?.focus();
    }
  }, [activeGridItemId]);

  useFocusOut(containerRef, () => setActiveGridItemId(null), []);

  const memoizedTemplateItems = useMemo(
    () =>
      templates.map(
        ({ id, centerTargetAction, slug, status, title, postersByPage }) => {
          const isActive = activeGridItemId === id;
          const posterSrc = postersByPage?.[0];
          return (
            <TemplateGridItem
              detailLink={resolveRoute(centerTargetAction)}
              onCreateStory={() => handleUseStory({ id, title })}
              onFocus={() => {
                setActiveGridItemId(id);
              }}
              height={pageSize.height}
              id={id}
              isActive={isActive}
              key={slug}
              posterSrc={posterSrc}
              ref={(el) => {
                itemRefs.current[id] = el;
              }}
              slug={slug}
              status={status}
              title={title}
            />
          );
        }
      ),
    [templates, activeGridItemId, pageSize.height, handleUseStory]
  );
  return (
    <div ref={containerRef}>
      <CardGrid
        pageSize={pageSize}
        role="list"
        ref={gridRef}
        ariaLabel={__('Viewing available templates', 'web-stories')}
      >
        {memoizedTemplateItems}
      </CardGrid>
    </div>
  );
}

TemplateGridView.propTypes = {
  pageSize: PageSizePropType,
  templates: TemplatesPropType,
  templateActions: TemplateActionsPropType,
};
export default TemplateGridView;
