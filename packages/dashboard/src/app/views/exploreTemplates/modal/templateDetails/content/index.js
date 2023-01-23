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
import { useEffect, useMemo, useState } from '@googleforcreators/react';
import { sprintf, __ } from '@googleforcreators/i18n';
import styled from 'styled-components';
import {
  Button,
  ButtonSize,
  ButtonType,
  ButtonVariant,
  Chip,
  Display,
  Icons,
  Text,
  TextSize,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { CardGallery, ColorList } from '../../../../../../components';
import { TemplatePropType } from '../../../../../../propTypes';
import {
  Container,
  Panel,
  DetailContainer,
  TemplateDetails,
  Inner,
} from '../components';

const StyledPanel = styled(Panel)`
  padding: 0 0 48px 0;
`;

const ByLineText = styled(Text.Paragraph)`
  color: ${({ theme }) => theme.colors.fg.tertiary};
  margin: 8px 0 24px;
`;

const DescriptionText = styled(Text.Paragraph)`
  margin-bottom: 24px;
`;

const PaginationContainer = styled.div`
  position: absolute;
  top: ${470 / 2}px;
  ${({ alignLeft }) =>
    alignLeft
      ? `
          left: 0;
          transform: translate(-187.5%, -50%);
        `
      : `
          right: 0;
          transform: translate(187.5%, -50%);
        `}
`;

const TemplateTag = styled(Chip).attrs({ forwardedAs: 'li' })`
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

function DetailsContent({
  activeTemplateIndex,
  isRTL,
  filteredTemplatesLength,
  switchToTemplateByOffset,
  template,
}) {
  const { postersByPage, title, description, tags, colors } = template || {};
  const [galleryPosters, setGalleryPosters] = useState([]);

  useEffect(() => {
    if (postersByPage) {
      setGalleryPosters(
        Object.values(postersByPage).map((poster, index) => ({
          id: index,
          ...poster,
        }))
      );
    }
    return undefined;
  }, [postersByPage]);

  const { NextButton, PrevButton } = useMemo(() => {
    const nextIndex = isRTL ? activeTemplateIndex - 1 : activeTemplateIndex + 1;
    const previousIndex = isRTL
      ? activeTemplateIndex + 1
      : activeTemplateIndex - 1;

    const disablePrevious = isRTL
      ? !filteredTemplatesLength ||
        activeTemplateIndex === filteredTemplatesLength - 1
      : !filteredTemplatesLength || activeTemplateIndex === 0;

    const disableNext = isRTL
      ? !filteredTemplatesLength || activeTemplateIndex === 0
      : !filteredTemplatesLength ||
        activeTemplateIndex === filteredTemplatesLength - 1;

    const Previous = (
      <Button
        type={ButtonType.Tertiary}
        size={ButtonSize.Small}
        variant={ButtonVariant.Square}
        aria-label={__('View previous template', 'web-stories')}
        onClick={() => {
          switchToTemplateByOffset(previousIndex);
          setGalleryPosters([]);
        }}
        disabled={disablePrevious}
      >
        <Icons.ArrowLeftLarge height={32} width={32} />
      </Button>
    );

    const Next = (
      <Button
        type={ButtonType.Tertiary}
        size={ButtonSize.Small}
        variant={ButtonVariant.Square}
        aria-label={__('View next template', 'web-stories')}
        onClick={() => {
          switchToTemplateByOffset(nextIndex);
          setGalleryPosters([]);
        }}
        disabled={disableNext}
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
    filteredTemplatesLength,
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
    <StyledPanel>
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
                size={TextSize.Small}
                as="h3"
                data-testid="template-details-title"
              >
                {title}
              </Display>
              <ByLineText size={TextSize.Medium}>{byLine}</ByLineText>
              <DescriptionText size={TextSize.Medium}>
                {description}
              </DescriptionText>

              <MetadataContainer
                role="list"
                aria-label={__('Template tags', 'web-stories')}
              >
                {tags.map((tag) => (
                  <TemplateTag key={tag} disabled>
                    {tag}
                  </TemplateTag>
                ))}
              </MetadataContainer>
              <MetadataContainer>
                <ColorList
                  colors={colors}
                  size={32}
                  aria-label={__('Template colors', 'web-stories')}
                />
              </MetadataContainer>
            </DetailContainer>
          </TemplateDetails>
        </Inner>
        <PaginationContainer>{NextButton}</PaginationContainer>
      </Container>
    </StyledPanel>
  );
}

DetailsContent.propTypes = {
  activeTemplateIndex: PropTypes.number,
  isRTL: PropTypes.bool,
  filteredTemplatesLength: PropTypes.number,
  switchToTemplateByOffset: PropTypes.func,
  template: TemplatePropType,
};

export default DetailsContent;
