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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Headline,
  Text,
  THEME_CONSTANTS,
  MEDIA_VARIANTS,
} from '@googleforcreators/design-system';
import { useCallback, useMemo } from '@googleforcreators/react';
import { PAGE_RATIO } from '@googleforcreators/units';
import { __, sprintf, translateToExclusiveList } from '@googleforcreators/i18n';
import { getExtensionsFromMimeType } from '@googleforcreators/media';
/**
 * Internal dependencies
 */
import { useConfig, useStory } from '../../../app';
import { Media } from '../../form';

// Set the available space for cover preview image + overlay
const PreviewWrapper = styled.div`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  position: relative;
  margin-top: 8px;
`;
PreviewWrapper.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

const PreviewContainer = styled.div`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  position: absolute;
`;
PreviewContainer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

// In ascending order, the featured image is set as the full available 2:3 space.
export const Image = styled.img`
  height: 100%;
  width: 100%;
  display: block;
  aspect-ratio: ${PAGE_RATIO};
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  background: ${({ theme }) => theme.colors.interactiveBg.primaryNormal};
`;

// If there's no featured image, a div gets set to take its place.
// Mostly this prevents an empty image tag and sets a background color
// so that any story title or site name is visible on top of it.
const EmptyPlaceholder = styled.div`
  height: 100%;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  background: ${({ theme }) => theme.colors.interactiveBg.primaryNormal};
`;

// On top of the featured media we position a gradient.
// This is pulled directly from the gradient styles seen in Search results
// so it mirrors the actual Cover preview.
const Gradient = styled.div`
  position: absolute;
  bottom: 0;
  height: 67%;
  width: 100%;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  background: ${({ theme }) => theme.colors.gradient.posterOverlay};
`;

// Next we establish the scrim, this is where everything either
// a) interactive or b) overlay on top of the featured media and gradient lives
const ScrimWrapper = styled.div`
  position: absolute;
  top: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  background: ${({ theme }) => theme.colors.opacity.black3};
  padding: 8px;
`;

// While the above wrapper sets positioning to keep it directly on top of the
// previous elements, the container gives the children their general display.
const ScrimContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
`;

// Scrim has two sections, the first is positioned at the top, second the bottom.
// They have pretty different requirements, so they each get their own container.
// The top has one row with 2 columns, content is positioned along the edges.
// Content may or may not be present, it needs to be in its true visual position
// regardless of if its siblings are there.
const ScrimTop = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto;
  grid-template-areas: 'publisherLogo editButton';
  justify-content: inherit;
  width: 100%;
`;
// Publisher logo border radius and box shadow are outside of theme to match Search Cover Preview
const PublisherLogo = styled.img`
  grid-area: publisherLogo;
  height: 24px;
  width: 24px;
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
`;

const StyledMedia = styled(Media)`
  grid-area: editButton;
  display: flex;
  flex-direction: row-reverse;
`;

// The bottom section of the scrim is full width.
const ScrimBottom = styled.div`
  width: 100%;
  margin: auto 0 0;
  align-self: flex-end;
`;

// Title styles are taken from Search cover preview styles.
// There's some specific overrides happening here though because,
// while Search shows Story Cover Previews in Chrome, we have to make
// sure these styles will show Creators using Web Stories in other browsers
// the same results. So we specifically want prefixes to stay put and not compile
// the lines that have stylelint disabled.
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

const StoryPreview = () => {
  const { title, featuredMedia, publisherLogo, updateStory } = useStory(
    ({ state: { story }, actions }) => ({
      title: story?.title,
      featuredMedia: story?.featuredMedia || {},
      publisherLogo: story?.publisherLogo || {},
      updateStory: actions.updateStory,
    })
  );

  const {
    allowedImageMimeTypes = [],
    hasUploadMediaAction,
    publisher,
  } = useConfig(({ allowedMimeTypes, capabilities, metadata }) => ({
    allowedImageMimeTypes: allowedMimeTypes?.image,
    hasUploadMediaAction: capabilities?.hasUploadMediaAction,
    publisher: metadata?.publisher,
  }));

  const allowedImageFileTypes = useMemo(
    () =>
      allowedImageMimeTypes
        .map((type) => getExtensionsFromMimeType(type))
        .flat(),
    [allowedImageMimeTypes]
  );

  // Honor 2:3 aspect ratio that cover previews have
  const mediaWidth = 232;
  const mediaHeight = Math.round(mediaWidth / PAGE_RATIO);

  const handleChangePoster = useCallback(
    /**
     * Handle story poster change.
     *
     * @param {import('@googleforcreators/media').Resource} newPoster The new image.
     * @return {void}
     */
    (newPoster) => {
      return updateStory({
        properties: {
          featuredMedia: {
            id: newPoster.id,
            url: newPoster.src,
            height: newPoster.height,
            width: newPoster.width,
          },
        },
      });
    },
    [updateStory]
  );

  let posterErrorMessage = __(
    'No file types are currently supported.',
    'web-stories'
  );

  if (allowedImageFileTypes.length) {
    posterErrorMessage = sprintf(
      /* translators: %s: list of allowed file types. */
      __('Please choose only %s as a poster.', 'web-stories'),
      translateToExclusiveList(allowedImageFileTypes)
    );
  }

  return (
    <>
      <Headline
        as="label"
        size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL}
      >
        {__('Cover Preview', 'web-stories')}
      </Headline>
      <PreviewWrapper width={mediaWidth} height={mediaHeight}>
        <PreviewContainer width={mediaWidth} height={mediaHeight}>
          {featuredMedia?.url ? (
            <Image
              crossOrigin="anonymous"
              src={featuredMedia.url}
              width={featuredMedia.width}
              height={featuredMedia.height}
              alt={__('Preview image', 'web-stories')}
              data-testid="story_preview_featured_media"
            />
          ) : (
            <EmptyPlaceholder />
          )}
          <Gradient />
          <ScrimWrapper>
            <ScrimContainer>
              <ScrimTop>
                {publisherLogo?.url?.length > 0 && (
                  <PublisherLogo
                    crossOrigin="anonymous"
                    width={publisherLogo.width}
                    height={publisherLogo.height}
                    src={publisherLogo.url}
                    alt={__('Publisher Logo', 'web-stories')}
                    data-testid="story_preview_logo"
                  />
                )}
                {hasUploadMediaAction && (
                  <StyledMedia
                    onChange={handleChangePoster}
                    title={__('Select as poster image', 'web-stories')}
                    buttonInsertText={__(
                      'Select as poster image',
                      'web-stories'
                    )}
                    type={allowedImageMimeTypes}
                    ariaLabel={__('Poster image', 'web-stories')}
                    onChangeErrorText={posterErrorMessage}
                    imgProps={featuredMedia}
                    canUpload={hasUploadMediaAction}
                    variant={MEDIA_VARIANTS.NONE}
                    cropParams={{
                      width: 640,
                      height: 853,
                    }}
                  />
                )}
              </ScrimTop>
              <ScrimBottom>
                {title && (
                  <Title data-testid="story_preview_title">{title}</Title>
                )}
                {publisher && (
                  <Publisher data-testid="story_preview_publisher">
                    {publisher}
                  </Publisher>
                )}
              </ScrimBottom>
            </ScrimContainer>
          </ScrimWrapper>
        </PreviewContainer>
      </PreviewWrapper>
    </>
  );
};

export default StoryPreview;
