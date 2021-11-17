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
import { useMemo } from '@web-stories-wp/react';
import { sprintf, __ } from '@web-stories-wp/i18n';
import styled, { css } from 'styled-components';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Chip,
  Display,
  Icons,
  Text,
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { CardGallery, ColorList } from '../../../../../components';
import { TemplatePropType } from '../../../../../types';
import {
  Container,
  Panel,
  DetailContainer,
  TemplateDetails,
  Inner,
} from '../../components';

const ByLineText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.tertiary};
  margin: 8px 0 24px;
`;
const DescriptionText = styled(Text)`
  margin-bottom: 24px;
`;

const PaginationContainer = styled.div`
  position: absolute;
  top: ${470 / 2}px;
  ${({ alignLeft }) =>
    alignLeft
      ? css`
          left: 0;
          transform: translate(-187.5%, -50%);
        `
      : css`
          right: 0;
          transform: translate(187.5%, -50%);
        `}
`;

const TemplateTag = styled(Chip)`
  margin-right: 12px;
  margin-bottom: 12px;
  > span {
    color: ${({ theme }) => theme.colors.fg.primary} !important;
  }
`;

const MetadataContainer = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

function DetailsGallery({
  activeTemplateIndex,
  isRTL,
  orderedTemplatesLength,
  switchToTemplateByOffset,
  template,
}) {
  const galleryPosters = useMemo(
    () =>
      Object.values(template.postersByPage).map((poster, index) => ({
        id: index,
        ...poster,
      })),
    [template.postersByPage]
  );

  const { NextButton, PrevButton } = useMemo(() => {
    const Previous = (
      <Button
        type={BUTTON_TYPES.TERTIARY}
        size={BUTTON_SIZES.SMALL}
        variant={BUTTON_VARIANTS.CIRCLE}
        aria-label={__('View previous template', 'web-stories')}
        onClick={() => {
          switchToTemplateByOffset(-1);
        }}
        disabled={!orderedTemplatesLength || activeTemplateIndex === 0}
      >
        <Icons.ArrowLeftLarge height={32} width={32} />
      </Button>
    );

    const Next = (
      <Button
        type={BUTTON_TYPES.TERTIARY}
        size={BUTTON_SIZES.SMALL}
        variant={BUTTON_VARIANTS.CIRCLE}
        aria-label={__('View next template', 'web-stories')}
        onClick={() => {
          switchToTemplateByOffset(1);
        }}
        disabled={
          !orderedTemplatesLength ||
          activeTemplateIndex === orderedTemplatesLength - 1
        }
      >
        <Icons.ArrowRightLarge height={32} width={32} />
      </Button>
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
        /* translators: byline. %s: author name. */
        __('By %s', 'web-stories'),
        template.createdBy
      )
    : null;

  return (
    <Panel>
      <Container>
        <PaginationContainer alignLeft>{PrevButton}</PaginationContainer>
        <Inner>
          <CardGallery
            galleryPosters={galleryPosters}
            isRTL={isRTL}
            galleryLabel={__('Template details by page', 'web-stories')}
          />
          <TemplateDetails>
            <DetailContainer>
              <Display
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.MEDIUM}
                as="h3"
                data-testid="template-details-title"
              >
                {template.title}
              </Display>
              <ByLineText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.MEDIUM}>
                {byLine}
              </ByLineText>
              <DescriptionText
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.MEDIUM}
              >
                {template.description}
              </DescriptionText>

              <MetadataContainer>
                {template.tags.map((tag) => (
                  <TemplateTag key={tag} disabled>
                    {tag}
                  </TemplateTag>
                ))}
              </MetadataContainer>
              <MetadataContainer>
                <ColorList colors={template.colors} size={32} />
              </MetadataContainer>
            </DetailContainer>
          </TemplateDetails>
        </Inner>
        <PaginationContainer>{NextButton}</PaginationContainer>
      </Container>
    </Panel>
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
