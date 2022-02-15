/*
 * Copyright 2022 Google LLC
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
  Button,
  Headline,
  Icons,
  Text,
  THEME_CONSTANTS,
  BUTTON_VARIANTS,
  BUTTON_TYPES,
  BUTTON_SIZES,
} from '@googleforcreators/design-system';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
/**
 * Internal dependencies
 */
import { useConfig, useStory } from '../../../app';

const PreviewContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 16px);
  margin: 8px 0;
`;

export const Image = styled.img`
  height: 100%;
  width: 100%;
  display: block;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  background: ${({ theme }) => theme.colors.gradient.placeholder};
`;

const EmptyPlaceholder = styled.div`
  height: 100%;
  width: 100%;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  background: ${({ theme }) => theme.colors.gradient.placeholder};
`;

const PreviewWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`;

const Gradient = styled.div`
  position: absolute;
  bottom: 0;
  height: 67%;
  width: 100%;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  background: ${({ theme }) => theme.colors.gradient.posterOverlay};
`;

const Scrim = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  background: ${({ theme }) => theme.colors.opacity.black3};
`;

const ScrimContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
`;

const ScrimContent = styled.div`
  height: 100%;
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  top: 0;
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const PublisherLogo = styled.img`
  height: 32px;
  width: 32px;
`;

const EditFeaturedMedia = styled(Button).attrs({
  variant: BUTTON_VARIANTS.SQUARE,
  type: BUTTON_TYPES.SECONDARY,
  size: BUTTON_SIZES.SMALL,
})`
  height: 32px;
  width: 32px;
`;

const Copy = styled.div`
  width: 100%;
  margin: auto 0 0;
  align-self: flex-end;
`;
const Title = styled(Headline).attrs({
  as: 'h3',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
})`
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.fg.primary};
  padding: 0;
  margin: 0 0 4px;
  max-height: calc(1.2em * 3);
  /* stylelint-disable-next-line */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  /* stylelint-disable-next-line */
  -webkit-box-orient: vertical;
`;

const Publisher = styled(Text).attrs({
  forwardAs: 'span',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.MEDIUM,
})`
  display: block;
  margin: 0;
  padding: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

const StoryPreview = () => {
  const { title, featuredMedia, publisherLogo } = useStory(
    ({ state: { story } }) => ({
      title: story.title,
      featuredMedia: story.featuredMedia,
      publisherLogo: story.publisherLogo,
      story,
    })
  );

  const publisher = useConfig(({ metadata }) => metadata?.publisher || null);

  return (
    <>
      <Headline
        as="label"
        size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL}
      >
        {__('Cover Preview', 'web-stories')}
      </Headline>
      <PreviewContainer>
        <PreviewWrapper>
          {featuredMedia.url ? (
            <Image
              crossOrigin="anonymous"
              width={featuredMedia.width}
              height={featuredMedia.height}
              src={featuredMedia.url}
              alt={__('Preview image', 'web-stories')}
            />
          ) : (
            <EmptyPlaceholder />
          )}
          <Gradient />
          <Scrim>
            <ScrimContainer>
              <ScrimContent>
                {publisherLogo?.url.length > 0 && (
                  <PublisherLogo
                    crossOrigin="anonymous"
                    width={publisherLogo.width}
                    height={publisherLogo.height}
                    src={publisherLogo.url}
                    alt={__('Publisher Logo', 'web-stories')}
                  />
                )}
                <EditFeaturedMedia
                  aria-label={__('Edit Publisher Logo', 'web-stories')}
                >
                  <Icons.Pencil aria-hidden="true" />
                </EditFeaturedMedia>
                <Copy>
                  <Title>{title}</Title>
                  {publisher && <Publisher>{publisher}</Publisher>}
                </Copy>
              </ScrimContent>
            </ScrimContainer>
          </Scrim>
        </PreviewWrapper>
      </PreviewContainer>
    </>
  );
};

export default StoryPreview;
