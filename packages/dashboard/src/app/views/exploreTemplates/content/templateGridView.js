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
import { Modal, useGridViewKeys } from '@web-stories-wp/design-system';

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
import DetailsGallery from '../../templateDetails/content/detailsGallery';
import TemplateGridItem, { FOCUS_TEMPLATE_CLASS } from './templateGridItem';

function TemplateGridView({ pageSize, templates, templateActions }) {
  const { isRTL, apiCallbacks } = useConfig();
  const containerRef = useRef();
  const gridRef = useRef();
  const itemRefs = useRef({});
  const [activeGridItemId, setActiveGridItemId] = useState(null);
  const [isDetailsViewOpen, setIsDetailsViewOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);

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

  const handleDetailsToggle = useCallback(
    (id) => {
      setIsDetailsViewOpen((prevIsOpen) => {
        const newIsOpen = !prevIsOpen;
        // should we add a tracking event like so?
        trackEvent('details_view_toggled', {
          status: newIsOpen ? 'open' : 'closed',
        });

        if (newIsOpen) {
          setActiveGridItemId(id);
          setActiveTemplate(
            templates.find((templateItem) => templateItem.id === id)
          );
          setActiveTemplateIndex(
            templates.findIndex((template) => template.id === id)
          );
        }

        return newIsOpen;
      });
    },
    [
      setIsDetailsViewOpen,
      setActiveGridItemId,
      setActiveTemplate,
      setActiveTemplateIndex,
      templates,
    ]
  );

  const switchToTemplateByOffset = useCallback(
    (index) => {
      setActiveTemplateIndex(index);
      setActiveTemplate(templates[index]);
    },
    [setActiveTemplateIndex, setActiveTemplate, templates]
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
      templates.map(({ id, slug, status, title, postersByPage }) => {
        const isActive = activeGridItemId === id;
        const posterSrc = postersByPage?.[0];
        const canCreateStory = Boolean(apiCallbacks?.createStoryFromTemplate);
        return (
          <TemplateGridItem
            onCreateStory={
              canCreateStory ? () => handleUseStory({ id, title }) : null
            }
            onFocus={() => {
              setActiveGridItemId(id);
            }}
            onSeeDetailsClick={handleDetailsToggle}
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
      }),
    [
      templates,
      activeGridItemId,
      pageSize.height,
      handleUseStory,
      apiCallbacks,
      handleDetailsToggle,
    ]
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
      <Modal
        isOpen={isDetailsViewOpen}
        onClose={handleDetailsToggle}
        contentLabel={__('Details View', 'web-stories')}
        overlayStyles={{
          alignItems: 'stretch',
          backgroundColor: '#fff', // theme.colors.brand.gray[90]
        }}
        contentStyles={{
          flex: 1,
        }}
        modalStyles={{ maxHeight: '70vh' }}
      >
        <DetailsGallery
          activeTemplateIndex={activeTemplateIndex}
          isRTL={isRTL}
          filteredTemplatesLength={templates.length}
          switchToTemplateByOffset={switchToTemplateByOffset}
          template={activeTemplate}
        />
      </Modal>
    </div>
  );
}

TemplateGridView.propTypes = {
  pageSize: PageSizePropType,
  templates: TemplatesPropType,
  templateActions: TemplateActionsPropType,
};
export default TemplateGridView;
