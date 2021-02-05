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
import { useMemo } from 'react';
import { sprintf, __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import {
  CardGallery,
  ColorList,
  PaginationButton,
  Pill,
} from '../../../../../components';
import { TemplatePropType } from '../../../../../types';
import {
  ByLine,
  Column,
  ColumnContainer,
  DetailContainer,
  LargeDisplayPagination,
  MetadataContainer,
  SmallDisplayPagination,
  Text,
  Title,
} from './../../components';

function DetailsGallery({
  activeTemplateIndex,
  isRTL,
  orderedTemplatesLength,
  switchToTemplateByOffset,
  template,
}) {
  const { NextButton, PrevButton } = useMemo(() => {
    const Previous = (
      <PaginationButton
        rotateRight
        aria-label={__('View previous template', 'web-stories')}
        onClick={() => switchToTemplateByOffset(-1)}
        disabled={!orderedTemplatesLength || activeTemplateIndex === 0}
      />
    );

    const Next = (
      <PaginationButton
        aria-label={__('View next template', 'web-stories')}
        onClick={() => switchToTemplateByOffset(1)}
        disabled={
          !orderedTemplatesLength ||
          activeTemplateIndex === orderedTemplatesLength - 1
        }
      />
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
  }, [
    orderedTemplatesLength,
    activeTemplateIndex,
    isRTL,
    switchToTemplateByOffset,
  ]);

  const byLine = template
    ? sprintf(
        /* translators: %s: template author  */
        __('by %s', 'web-stories'),
        template.createdBy
      )
    : null;

  return (
    <>
      <SmallDisplayPagination>
        {PrevButton}
        {NextButton}
      </SmallDisplayPagination>
      <ColumnContainer>
        <Column>
          <LargeDisplayPagination>{PrevButton}</LargeDisplayPagination>
          <CardGallery
            story={template}
            isRTL={isRTL}
            galleryLabel={__('Template details by page', 'web-stories')}
          />
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
          <LargeDisplayPagination>{NextButton}</LargeDisplayPagination>
        </Column>
      </ColumnContainer>
    </>
  );
}

DetailsGallery.propTypes = {
  activeTemplateIndex: PropTypes.number,
  isRTL: PropTypes.bool,
  orderedTemplatesLength: PropTypes.number,
  switchToTemplateByOffset: PropTypes.func,
  template: TemplatePropType,
};

export default DetailsGallery;
