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
import { useCallback, useRef, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import { useConfig } from '../../../../app/config';
import { useFocusHighlight, states, styles } from '../../../../app/highlights';
import { Row, Media, Required } from '../../../form';
import useInspector from '../../../inspector/useInspector';
import { Panel, PanelTitle, PanelContent } from '../../panel';
import { MEDIA_VARIANTS } from '../../../../../design-system/components/mediaInput/constants';
import { Text, THEME_CONSTANTS } from '../../../../../design-system';
import PublishTime from './publishTime';
import Author from './author';

const LabelWrapper = styled.div`
  height: 40px;
`;

const Label = styled(Text).attrs({
  as: 'label',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.primary};
  font-size: 14px;
`;

const MediaWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 4px;
  height: 96px;
`;

const StyledMedia = styled(Media)`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  ${({ isHighlighted }) =>
    isHighlighted &&
    css`
      ${styles.OUTLINE}
    `}
`;

const HighlightRow = styled(Row)`
  position: relative;
  justify-content: space-between;
  &::after {
    content: '';
    position: absolute;
    top: -10px;
    bottom: -10px;
    left: -20px;
    right: -10px;
    ${({ isHighlighted }) => isHighlighted && styles.FLASH}
    pointer-events: none;
  }
`;

const MediaInputWrapper = styled.div`
  height: 160px;
`;

function PublishPanel() {
  const {
    state: { users },
  } = useInspector();

  const posterButtonRef = useRef();
  const publisherLogoRef = useRef();

  const highlightPoster = useFocusHighlight(states.POSTER, posterButtonRef);
  const highlightLogo = useFocusHighlight(
    states.PUBLISHER_LOGO,
    publisherLogoRef
  );

  const { featuredMedia, publisherLogoUrl, updateStory } = useStory(
    ({
      state: {
        story: {
          featuredMedia = { id: 0, url: '', height: 0, width: 0 },
          publisherLogoUrl = '',
        },
      },
      actions: { updateStory },
    }) => {
      return {
        featuredMedia,
        publisherLogoUrl,
        updateStory,
      };
    }
  );

  const {
    capabilities,
    allowedImageMimeTypes,
    allowedImageFileTypes,
  } = useConfig();

  const handleChangePoster = useCallback(
    (image) =>
      updateStory({
        properties: {
          featuredMedia: {
            id: image.id,
            height: image.sizes?.full?.height || image.height,
            url: image.sizes?.full?.url || image.url,
            width: image.sizes?.full?.width || image.width,
          },
        },
      }),
    [updateStory]
  );

  // @todo Enforce square image while selecting in Media Library.
  const handleChangePublisherLogo = useCallback(
    (image) => {
      updateStory({
        properties: {
          publisherLogo: image.id,
          publisherLogoUrl: image.sizes?.thumbnail?.url || image.url,
        },
      });
    },
    [updateStory]
  );

  const publisherLogoErrorMessage = useMemo(() => {
    return sprintf(
      /* translators: %s: list of allowed file types. */
      __('Please choose only %s as publisher logo.', 'web-stories'),
      allowedImageFileTypes.join(
        /* translators: delimiter used in a list */
        __(', ', 'web-stories')
      )
    );
  }, [allowedImageFileTypes]);

  const posterErrorMessage = useMemo(() => {
    return sprintf(
      /* translators: %s: list of allowed file types. */
      __('Please choose only %s as a poster.', 'web-stories'),
      allowedImageFileTypes.join(
        /* translators: delimiter used in a list */
        __(', ', 'web-stories')
      )
    );
  }, [allowedImageFileTypes]);

  return (
    <Panel
      name="publishing"
      collapsedByDefault={false}
      isPersistable={!(highlightLogo || highlightPoster)}
    >
      <PanelTitle>{__('Publishing', 'web-stories')}</PanelTitle>
      <PanelContent>
        <PublishTime />
        {capabilities && capabilities.hasAssignAuthorAction && users && (
          <Author />
        )}
        <HighlightRow
          isHighlighted={
            highlightPoster?.showEffect || highlightLogo?.showEffect
          }
        >
          <MediaInputWrapper>
            <MediaWrapper>
              <StyledMedia
                isHighlighted={highlightPoster?.showEffect}
                ref={posterButtonRef}
                width={54}
                height={96}
                value={featuredMedia?.url}
                onChange={handleChangePoster}
                title={__('Select as poster image', 'web-stories')}
                buttonInsertText={__('Select as poster image', 'web-stories')}
                type={allowedImageMimeTypes}
                ariaLabel={__('Poster image', 'web-stories')}
                onChangeErrorText={posterErrorMessage}
              />
            </MediaWrapper>
            <LabelWrapper>
              <Label>{__('Poster image', 'web-stories')}</Label>
              <Required />
            </LabelWrapper>
          </MediaInputWrapper>
          <MediaInputWrapper>
            <MediaWrapper>
              <StyledMedia
                isHighlighted={highlightLogo?.showEffect}
                width={72}
                height={72}
                ref={publisherLogoRef}
                value={publisherLogoUrl}
                onChange={handleChangePublisherLogo}
                onChangeErrorText={publisherLogoErrorMessage}
                title={__('Select as publisher logo', 'web-stories')}
                buttonInsertText={__('Select as publisher logo', 'web-stories')}
                type={allowedImageMimeTypes}
                ariaLabel={__('Publisher logo', 'web-stories')}
                variant={MEDIA_VARIANTS.CIRCLE}
              />
            </MediaWrapper>
            <LabelWrapper>
              <Label>{__('Publisher logo', 'web-stories')}</Label>
              <Required />
            </LabelWrapper>
          </MediaInputWrapper>
        </HighlightRow>
      </PanelContent>
    </Panel>
  );
}

export default PublishPanel;
