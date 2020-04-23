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
import { useEffect, useState, useContext, useMemo } from 'react';

/**
 * Internal dependencies
 */
import useRouteHistory from '../../router/useRouteHistory';
import { ApiContext } from '../../api/apiProvider';
import { TransformProvider } from '../../../../edit-story/components/transform';
import FontProvider from '../../font/fontProvider';
import {
  CardGallery,
  ColorList,
  PreviewPage,
  Pill,
  TemplateNavBar,
} from '../../../components';
import {
  ByLine,
  ContentContainer,
  ColumnContainer,
  Column,
  DetailContainer,
  MetadataContainer,
  Text,
  Title,
} from './components';

function TemplateDetail() {
  const [template, setTemplate] = useState(null);
  const {
    state: {
      queryParams: { id: templateId, isLocal },
    },
  } = useRouteHistory();
  const {
    actions: { templateApi },
  } = useContext(ApiContext);

  useEffect(() => {
    if (!templateId) {
      return;
    }

    const id = parseInt(templateId);
    const isLocalTemplate = isLocal && isLocal.toLowerCase() === 'true';

    if (isLocalTemplate) {
      templateApi.fetchMyTemplateById(id).then((fetchedTemplate) => {
        setTemplate(fetchedTemplate);
      });
    } else {
      templateApi.fetchExternalTemplateById(id).then((fetchedTemplate) => {
        setTemplate(fetchedTemplate);
      });
    }
  }, [templateApi, templateId, isLocal]);

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

  return (
    template && (
      <FontProvider>
        <TransformProvider>
          <TemplateNavBar />
          <ContentContainer>
            <ColumnContainer>
              <Column>
                <CardGallery>
                  {template.pages.map((page) => (
                    <PreviewPage key={page.id} page={page} />
                  ))}
                </CardGallery>
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
              </Column>
            </ColumnContainer>
          </ContentContainer>
        </TransformProvider>
      </FontProvider>
    )
  );
}

export default TemplateDetail;
