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
import { useEffect, useState, useContext } from 'react';

/**
 * Internal dependencies
 */
import useRouteHistory from '../../router/useRouteHistory';
import { ApiContext } from '../../api/apiProvider';
import { TransformProvider } from '../../../../edit-story/components/transform';
import FontProvider from '../../font/fontProvider';
import { CardGallery, PreviewPage, Pill } from '../../../components';
import {
  ByLine,
  ContentContainer,
  ColorBadge,
  ColumnContainer,
  Column,
  DetailContainer,
  MetaDataContainer,
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
    async function getTemplateById(id) {
      setTemplate(await fetchTemplate(parseInt(id)));
    }

    getTemplateById(templateId);
  }, [fetchTemplate, templateId]);

  return (
    template && (
      <FontProvider>
        <TransformProvider>
          <section />
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
                  <Title>{`${template.title} Template`}</Title>
                  <ByLine>{`by ${template.createdBy}`}</ByLine>
                  <Text>{template.description}</Text>
                  <MetaDataContainer>
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
                  </MetaDataContainer>
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
