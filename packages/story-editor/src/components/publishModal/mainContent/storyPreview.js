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
import styled from 'styled-components';
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
import { PAGE_RATIO } from '@googleforcreators/units';
import { __ } from '@googleforcreators/i18n';
/**
 * Internal dependencies
 */
import { useConfig, useStory } from '../../../app';

// Set the available space for cover preview image + overlay
const PreviewContainer = styled.div`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  position: relative;
  margin-top: 8px;
`;

const PreviewWrapper = styled.div`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  position: absolute;
`;

export const Image = styled.img`
  height: 100%;
  width: 100%;
  display: block;
  aspect-ratio: auto ${PAGE_RATIO};
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  background: ${({ theme }) => theme.colors.interactiveBg.primaryNormal};
`;

const EmptyPlaceholder = styled.div`
  height: 100%;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  background: ${({ theme }) => theme.colors.interactiveBg.primaryNormal};
`;

const Gradient = styled.div`
  position: absolute;
  bottom: 0;
  height: 67%;
  width: 100%;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  background: ${({ theme }) => theme.colors.gradient.posterOverlay};
`;

const ScrimWrapper = styled.div`
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

const TopOverlay = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto;
  grid-template-areas: 'publisherLogo editButton';
  justify-content: inherit;
  width: 100%;
`;
const PublisherLogo = styled.img`
  grid-area: publisherLogo;
  height: 24px;
  width: 24px;
`;

const EditFeaturedMedia = styled(Button).attrs({
  variant: BUTTON_VARIANTS.SQUARE,
  type: BUTTON_TYPES.SECONDARY,
  size: BUTTON_SIZES.SMALL,
})`
  grid-area: editButton;
  height: 32px;
  width: 32px;
  margin: 0 0 0 auto;
`;

const BottomOverlay = styled.div`
  width: 100%;
  margin: auto 0 0;
  align-self: flex-end;
`;

const Title = styled(Headline).attrs({
  as: 'h3',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
})`
  max-height: calc(1.2em * 3);
  /* stylelint-disable-next-line */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  /* stylelint-disable-next-line */
  -webkit-box-orient: vertical;
  padding: 0;
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.fg.primary};
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

// TODO https://github.com/GoogleForCreators/web-stories-wp/issues/10584
const ENABLE_EDIT_FEATURED_MEDIA = false;

const StoryPreview = () => {
  const { title, featuredMedia, publisherLogo } = useStory(
    ({ state: { story } }) => ({
      title: story.title,
      featuredMedia: story.featuredMedia,
      publisherLogo: story.publisherLogo,
      story,
    })
  );

  const publisher = useConfig(({ metadata }) => metadata?.publisher);
  const hasUploadMediaAction = useConfig(
    ({ capabilities }) => capabilities?.hasUploadMediaAction
  );

  // Honor 2:3 aspect ratio that cover previews have
  const mediaWidth = 232;
  const mediaHeight = Math.round(mediaWidth / PAGE_RATIO);

  return (
    <>
      <Headline
        as="label"
        size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL}
      >
        {__('Cover Preview', 'web-stories')}
      </Headline>
      <PreviewContainer width={mediaWidth} height={mediaHeight}>
        <PreviewWrapper width={mediaWidth} height={mediaHeight}>
          {featuredMedia.url ? (
            <Image
              crossOrigin="anonymous"
              src={featuredMedia.url}
              width={featuredMedia.width}
              height={featuredMedia.height}
              alt={__('Preview image', 'web-stories')}
            />
          ) : (
            <EmptyPlaceholder />
          )}
          <Gradient />
          <ScrimWrapper>
            <ScrimContainer>
              <ScrimContent>
                <TopOverlay>
                  {publisherLogo?.url.length > 0 && (
                    <PublisherLogo
                      crossOrigin="anonymous"
                      width={publisherLogo.width}
                      height={publisherLogo.height}
                      src={publisherLogo.url}
                      alt={__('Publisher Logo', 'web-stories')}
                    />
                  )}
                  {ENABLE_EDIT_FEATURED_MEDIA && hasUploadMediaAction && (
                    <EditFeaturedMedia
                      aria-label={__('Edit Publisher Logo', 'web-stories')}
                    >
                      <Icons.Pencil aria-hidden="true" />
                    </EditFeaturedMedia>
                  )}
                </TopOverlay>
                <BottomOverlay>
                  {title && <Title>{title}</Title>}
                  {publisher && <Publisher>{publisher}</Publisher>}
                </BottomOverlay>
              </ScrimContent>
            </ScrimContainer>
          </ScrimWrapper>
        </PreviewWrapper>
      </PreviewContainer>
    </>
  );
};

export default StoryPreview;
