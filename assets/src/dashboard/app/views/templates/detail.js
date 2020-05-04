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
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { useEffect, useState, useContext, useMemo, useCallback } from 'react';

/**
 * Internal dependencies
 */
import { useConfig } from '../../config';
import useRouteHistory from '../../router/useRouteHistory';
import { ApiContext } from '../../api/apiProvider';
import { ReactComponent as LeftArrow } from '../../../icons/left-arrow.svg';
import { ReactComponent as RightArrow } from '../../../icons/right-arrow.svg';
import { TransformProvider } from '../../../../edit-story/components/transform';
import { UnitsProvider } from '../../../../edit-story/units';

import FontProvider from '../../font/fontProvider';
import {
  CardGallery,
  ColorList,
  PreviewPage,
  Pill,
  TemplateNavBar,
  Layout,
} from '../../../components';
import { ICON_METRICS } from '../../../constants';
import { clamp, usePagePreviewSize } from '../../../utils/';
import { StoryGridView } from '../shared';

import {
  ByLine,
  ContentContainer,
  ColumnContainer,
  Column,
  DetailContainer,
  MetadataContainer,
  NavButton,
  RowContainer,
  SubHeading,
  Text,
  Title,
} from './components';

function TemplateDetail() {
  const [template, setTemplate] = useState(null);
  const { pageSize } = usePagePreviewSize();
  const {
    state: {
      queryParams: { id: templateId, isLocal },
    },
    actions,
  } = useRouteHistory();
  const {
    state: {
      templates: { templates, templatesOrderById },
    },
    actions: {
      templateApi: {
        fetchMyTemplateById,
        fetchExternalTemplateById,
        fetchRelatedTemplates,
      },
    },
  } = useContext(ApiContext);
  const { isRTL } = useConfig();

  useEffect(() => {
    if (!templateId) {
      return;
    }

    const id = parseInt(templateId);
    const isLocalTemplate = isLocal && isLocal.toLowerCase() === 'true';

    if (isLocalTemplate) {
      fetchMyTemplateById(id).then((fetchedTemplate) =>
        setTemplate(fetchedTemplate)
      );
    } else {
      fetchExternalTemplateById(id).then((fetchedTemplate) =>
        setTemplate(fetchedTemplate)
      );
    }
  }, [fetchMyTemplateById, fetchExternalTemplateById, templateId, isLocal]);

  const relatedTemplates = useMemo(() => {
    return fetchRelatedTemplates();
  }, [fetchRelatedTemplates]);

  const orderedTemplates = useMemo(() => {
    return templatesOrderById.map((templateByOrderId) => {
      return templates[templateByOrderId];
    });
  }, [templatesOrderById, templates]);

  const { byLine } = useMemo(() => {
    if (!template) {
      return {};
    }

    return {
      byLine: sprintf(
        /* translators: %s: template author  */
        __('by %s', 'web-stories'),
        template.createdBy
      ),
    };
  }, [template]);

  const activeTemplateIndex = useMemo(() => {
    if (orderedTemplates.length <= 0) {
      return 0;
    }

    return orderedTemplates.findIndex((t) => t.id === template?.id);
  }, [template, orderedTemplates]);

  const previewPages = useMemo(
    () =>
      template &&
      template.pages.map((page) => <PreviewPage key={page.id} page={page} />),
    [template]
  );

  const switchToTemplateByOffset = useCallback(
    (offset) => {
      const index = clamp(activeTemplateIndex + offset, [
        0,
        orderedTemplates.length - 1,
      ]);
      const selectedTemplate = orderedTemplates[index];

      actions.push(
        `?id=${selectedTemplate.id}&isLocal=${selectedTemplate.isLocal}`
      );
    },
    [activeTemplateIndex, orderedTemplates, actions]
  );

  const { NextButton, PrevButton } = useMemo(() => {
    const Previous = (
      <NavButton
        aria-label={__('View previous template', 'web-stories')}
        onClick={() => switchToTemplateByOffset(-1)}
        disabled={!orderedTemplates?.length || activeTemplateIndex === 0}
      >
        <LeftArrow {...ICON_METRICS.LEFT_RIGHT_ARROW} />
      </NavButton>
    );

    const Next = (
      <NavButton
        aria-label={__('View next template', 'web-stories')}
        onClick={() => switchToTemplateByOffset(1)}
        disabled={
          !orderedTemplates?.length ||
          activeTemplateIndex === orderedTemplates.length - 1
        }
      >
        <RightArrow {...ICON_METRICS.LEFT_RIGHT_ARROW} />
      </NavButton>
    );

    return isRTL
      ? {
          NextButton: Previous,
          PrevButton: Next,
        }
      : {
          NextButton: Next,
          PrevButton: Previous,
        };
  }, [isRTL, switchToTemplateByOffset, activeTemplateIndex, orderedTemplates]);

  if (!template) {
    return null;
  }

  return (
    template && (
      <FontProvider>
        <TransformProvider>
          <Layout.Provider>
            <Layout.Fixed>
              <TemplateNavBar />
            </Layout.Fixed>
            <Layout.Scrollable>
              <ContentContainer>
                <ColumnContainer>
                  <Column>
                    {PrevButton}
                    <CardGallery>{previewPages}</CardGallery>
                  </Column>
                  <Column>
                    <DetailContainer>
                      <Title>{template.title}</Title>
                      <ByLine>{byLine}</ByLine>
                      <Text>{template.description}</Text>
                      <MetadataContainer>
                        {template.tags.map((tag) => (
                          <Pill
                            name={tag}
                            key={tag}
                            disabled
                            onClick={() => {}}
                            value={tag}
                          >
                            {tag}
                          </Pill>
                        ))}
                      </MetadataContainer>
                      <MetadataContainer>
                        <ColorList colors={template.colors} size={30} />
                      </MetadataContainer>
                    </DetailContainer>
                    {NextButton}
                  </Column>
                </ColumnContainer>
                {relatedTemplates.length > 0 && (
                  <RowContainer>
                    <SubHeading>
                      {__('Related Templates', 'web-stories')}
                    </SubHeading>
                    <UnitsProvider pageSize={pageSize}>
                      <StoryGridView
                        filteredStories={relatedTemplates}
                        centerActionLabel={__('View', 'web-stories')}
                        bottomActionLabel={__('Use template', 'web-stories')}
                        isTemplate
                      />
                    </UnitsProvider>
                  </RowContainer>
                )}
              </ContentContainer>
            </Layout.Scrollable>
          </Layout.Provider>
        </TransformProvider>
      </FontProvider>
    )
  );
}

export default TemplateDetail;
