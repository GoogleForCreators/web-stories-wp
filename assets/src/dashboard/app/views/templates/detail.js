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
  PreviewPage,
  Pill,
  TemplateNavBar,
} from '../../../components';
import {
  ByLine,
  ContentContainer,
  ColorBadge,
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
      queryParams: { id: templateId },
    },
  } = useRouteHistory();
  const {
    actions: { fetchTemplate },
  } = useContext(ApiContext);

  useEffect(() => {
    if (!templateId) {
      return;
    }

    async function getTemplateById(id) {
      setTemplate(await fetchTemplate(parseInt(id)));
    }

    getTemplateById(templateId);
  }, [fetchTemplate, templateId]);

  const { title, byLine } = useMemo(() => {
    if (!template) {
      return {};
    }

    return {
      title: sprintf(
        /* translators: %s: template title  */
        __('%s Template', 'web-stories'),
        template.title
      ),
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
          <TemplateNavBar title={template.title} />
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
                  <Title>{title}</Title>
                  <ByLine>{byLine}</ByLine>
                  <Text>{template.description}</Text>
                  <MetadataContainer>
                    {template.metadata.map(({ label, color }) => (
                      <Pill
                        name={label}
                        key={label}
                        disabled
                        onClick={() => {}}
                        value={label}
                      >
                        {color && <ColorBadge color={color} />}
                        {label}
                      </Pill>
                    ))}
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
