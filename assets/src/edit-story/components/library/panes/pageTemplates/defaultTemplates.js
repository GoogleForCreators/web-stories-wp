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
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { _x, sprintf, __ } from '@web-stories-wp/i18n';
import { getTimeTracker, trackEvent } from '@web-stories-wp/tracking';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { useAPI } from '../../../../app/api';
import { ChipGroup } from '../shared';
import { virtualPaneContainer } from '../shared/virtualizedPanelGrid';
import { Headline } from '../../../../../design-system/components/typography/headline';
import { THEME_CONSTANTS } from '../../../../../design-system/theme/constants';
import { Text } from '../../../../../design-system/components/typography/text';
import { Toggle } from '../../../../../design-system/components/toggle';
import { PAGE_TEMPLATE_TYPES } from './constants';
import TemplateList from './templateList';

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 16px 22px 16px;
`;

const TemplatesToggle = styled.div`
  display: flex;

  label {
    cursor: pointer;
    margin: auto 12px;
    color: ${({ theme }) => theme.colors.fg.secondary};
  }
`;

const PageTemplatesParentContainer = styled.div`
  ${virtualPaneContainer};
  margin-top: 18px;
  overflow-x: hidden;
  overflow-y: scroll;
`;

function DefaultTemplates({ pageSize }) {
  const {
    actions: { getPageTemplates },
  } = useAPI();
  const [pageTemplates, setPageTemplates] = useState([]);
  const [showTemplateImages, setShowTemplateImages] = useState(false);

  const toggleId = useMemo(() => `toggle_page_templates_${uuidv4()}`, []);

  // load and process pageTemplates
  useEffect(() => {
    async function loadPageTemplates() {
      const trackTiming = getTimeTracker('load_page_templates');
      setPageTemplates(
        await getPageTemplates({ showImages: showTemplateImages })
      );
      trackTiming();
    }

    loadPageTemplates();
  }, [getPageTemplates, showTemplateImages, setPageTemplates]);

  const pageTemplatesParentRef = useRef();
  const [selectedPageTemplateType, setSelectedPageTemplateType] = useState(
    null
  );

  const pills = useMemo(
    () => [
      { id: null, label: __('All', 'web-stories') },
      ...Object.entries(PAGE_TEMPLATE_TYPES).map(([key, { name }]) => ({
        id: key,
        label: name,
      })),
    ],
    []
  );

  const filteredPages = useMemo(
    () =>
      pageTemplates.reduce((pages, template) => {
        const templatePages = template.pages.reduce((acc, page) => {
          // skip unselected page template types if not matching
          if (
            !page.pageTemplateType ||
            (selectedPageTemplateType &&
              page.pageTemplateType !== selectedPageTemplateType)
          ) {
            return acc;
          }

          const pageTemplateName =
            PAGE_TEMPLATE_TYPES[page.pageTemplateType].name;
          return [
            ...acc,
            {
              ...page,
              title: sprintf(
                /* translators: 1: template name. 2: page template name. */
                _x('%1$s %2$s', 'page template title', 'web-stories'),
                template.title,
                pageTemplateName
              ),
            },
          ];
        }, []);

        return [...pages, ...templatePages];
      }, []),
    [pageTemplates, selectedPageTemplateType]
  );

  const handleSelectPageTemplateType = useCallback((key) => {
    setSelectedPageTemplateType(key);
    trackEvent('search', {
      search_type: 'page_templates',
      search_term: '',
      search_category: key,
    });
  }, []);

  const handleToggleClick = useCallback(() => {
    setShowTemplateImages((currentValue) => !currentValue);
  }, []);

  return (
    <>
      <ChipGroup
        items={pills}
        selectedItemId={selectedPageTemplateType}
        selectItem={handleSelectPageTemplateType}
        deselectItem={() => handleSelectPageTemplateType(null)}
      />
      <PageTemplatesParentContainer ref={pageTemplatesParentRef}>
        <ActionRow>
          <Headline
            as="h3"
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XXX_SMALL}
          >
            {__('Templates', 'web-stories')}
          </Headline>
          <TemplatesToggle>
            <Text
              as="label"
              htmlFor={toggleId}
              size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
            >
              {__('Show Images', 'web-stories')}
            </Text>
            <Toggle
              id={toggleId}
              name={toggleId}
              checked={showTemplateImages}
              onChange={handleToggleClick}
            />
          </TemplatesToggle>
        </ActionRow>
        {pageTemplatesParentRef.current && (
          <TemplateList
            pageSize={pageSize}
            parentRef={pageTemplatesParentRef}
            pages={filteredPages}
          />
        )}
      </PageTemplatesParentContainer>
    </>
  );
}

DefaultTemplates.propTypes = {
  pageSize: PropTypes.object.isRequired,
};

export default DefaultTemplates;
