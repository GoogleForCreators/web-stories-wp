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
import {
  useState,
  useEffect,
  useCallback,
  forwardRef,
} from '@web-stories-wp/react';
import styled from 'styled-components';
import { __, sprintf, translateToExclusiveList } from '@web-stories-wp/i18n';
import {
  Link,
  Text,
  THEME_CONSTANTS,
  Icons,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import { useConfig } from '../../../../app/config';
import { useHighlights, states, styles } from '../../../../app/highlights';
import { Row, Media, Required, AdvancedDropDown } from '../../../form';
import { Option } from '../../../form/advancedDropDown/list/styled';
import useInspector from '../../../inspector/useInspector';
import { Panel, PanelTitle, PanelContent } from '../../panel';
import { useAPI } from '../../../../app';
import { useMediaPicker } from '../../../mediaPicker';
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
`;

const HighlightRow = styled(Row).attrs({
  spaceBetween: false,
})`
  position: relative;
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

const DropdownWrapper = styled.div`
  position: relative;
  width: 138px;
  margin-left: 30px;
  margin-top: 3px;
`;

const LogoImg = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

function PublishPanel() {
  const {
    state: { users },
  } = useInspector();

  const {
    actions: { getSettings, getMedia },
  } = useAPI();

  const {
    allowedImageMimeTypes,
    allowedImageFileTypes,
    dashboardSettingsLink,
    capabilities: { hasUploadMediaAction, canManageSettings },
  } = useConfig();

  const [publisherLogos, setPublisherLogos] = useState([]);

  useEffect(() => {
    if (canManageSettings) {
      getSettings().then((settings) => {
        if (settings.web_stories_publisher_logos.length) {
          getMedia({
            include: settings.web_stories_publisher_logos.join(','),
          }).then((logos) => {
            setPublisherLogos(logos.data);
          });
        }
      });
    }
  }, [canManageSettings, getMedia, getSettings]);

  const { highlightPoster, highlightLogo, resetHighlight } = useHighlights(
    (state) => ({
      highlightPoster: state[states.POSTER],
      highlightLogo: state[states.PUBLISHER_LOGO],
      resetHighlight: state.onFocusOut,
      cancelHighlight: state.cancelEffect,
    })
  );

  const { featuredMedia, publisherLogo, updateStory, capabilities } = useStory(
    ({
      state: {
        story: {
          featuredMedia = { id: 0, url: '', height: 0, width: 0 },
          publisherLogo = { id: 0, url: '', height: 0, width: 0 },
        },
        capabilities,
      },
      actions: { updateStory },
    }) => {
      return {
        featuredMedia,
        publisherLogo,
        updateStory,
        capabilities,
      };
    }
  );

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

  const onPublisherLogoChange = (option) => {
    const sizeLogo = option.media_details.sizes?.['web-stories-publisher-logo'];
    updateStory({
      properties: {
        publisherLogo: {
          id: option.id,
          url: sizeLogo?.source_url || option.source_url,
          width: sizeLogo?.width || option.media_details.width,
          height: sizeLogo?.height || option.media_details.height,
        },
      },
    });
  };

  const getErrorMessage = (message) => {
    let returnedMessage = __(
      'No file types are currently supported.',
      'web-stories'
    );

    if (allowedImageFileTypes.length) {
      returnedMessage = sprintf(
        message,
        translateToExclusiveList(allowedImageFileTypes)
      );
    }

    return returnedMessage;
  };

  const publisherLogoErrorMessage = getErrorMessage(
    /* translators: %s: list of allowed file types. */
    __('Please choose only %s as publisher logo.', 'web-stories')
  );
  const posterErrorMessage = getErrorMessage(
    /* translators: %s: list of allowed file types. */
    __('Please choose only %s as a poster.', 'web-stories')
  );

  const openMediaPicker = useMediaPicker({
    onSelect: onPublisherLogoChange,
    cropParams: {
      width: 96,
      height: 96,
    },
    type: allowedImageMimeTypes,
    onSelectErrorMessage: publisherLogoErrorMessage,
    title: __('Select as publisher logo', 'web-stories'),
    buttonInsertText: __('Select as publisher logo', 'web-stories'),
  });

  const publisherLogoOptionRenderer = forwardRef(
    ({ option: option, ...rest }, ref) => {
      if (option.props) {
        return option;
      }
      const src =
        option.media_details.sizes?.['web-stories-publisher-logo']
          ?.source_url || option.source_url;
      return (
        <Option value={option.id} ref={ref} {...rest}>
          <LogoImg src={src} alt="" />
        </Option>
      );
    }
  );
  const activeItemRenderer = () => {
    const displayText = publisherLogos.length
      ? __('Select logo', 'web-stories')
      : __('No logo', 'web-stories');
    return publisherLogo.id ? (
      <LogoImg src={publisherLogo.url} alt="" />
    ) : (
      <Text as="span" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {displayText}
      </Text>
    );
  };

  const publisherLogosWithUploadOption = [...publisherLogos];
  if (hasUploadMediaAction) {
    publisherLogosWithUploadOption.unshift(
      <Option
        key="upload"
        onClick={openMediaPicker}
        aria-label={__('Add new', 'web-stories')}
      >
        <Icons.ArrowCloud height={32} width={32} />
        <Text as="span" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
          {__('Add new', 'web-stories')}
        </Text>
      </Option>
    );
  }

  return (
    <Panel
      name="publishing"
      collapsedByDefault={false}
      isPersistable={!(highlightLogo || highlightPoster)}
    >
      <PanelTitle>{__('Publishing', 'web-stories')}</PanelTitle>
      <PanelContent>
        <PublishTime />
        {capabilities?.hasAssignAuthorAction && users && <Author />}
        <HighlightRow
          isHighlighted={
            highlightPoster?.showEffect || highlightLogo?.showEffect
          }
          onAnimationEnd={() => resetHighlight()}
        >
          <MediaInputWrapper>
            <MediaWrapper>
              <StyledMedia
                ref={(node) => {
                  if (
                    node &&
                    highlightPoster?.focus &&
                    highlightPoster?.showEffect
                  ) {
                    node.focus();
                  }
                }}
                width={72}
                height={96}
                cropParams={{
                  width: 640,
                  height: 853,
                }}
                value={featuredMedia?.url}
                onChange={handleChangePoster}
                title={__('Select as poster image', 'web-stories')}
                buttonInsertText={__('Select as poster image', 'web-stories')}
                type={allowedImageMimeTypes}
                ariaLabel={__('Poster image', 'web-stories')}
                onChangeErrorText={posterErrorMessage}
                imgProps={featuredMedia}
                canUpload={hasUploadMediaAction}
              />
            </MediaWrapper>
            <LabelWrapper>
              <Label>{__('Poster image', 'web-stories')}</Label>
              <Required />
            </LabelWrapper>
          </MediaInputWrapper>
          <DropdownWrapper>
            <MediaWrapper>
              <AdvancedDropDown
                options={publisherLogosWithUploadOption}
                primaryOptions={publisherLogosWithUploadOption}
                onChange={onPublisherLogoChange}
                aria-label={__('Publisher Logo', 'web-stories')}
                renderer={publisherLogoOptionRenderer}
                activeItemRenderer={activeItemRenderer}
                selectedId={publisherLogo.id}
                disabled={!publisherLogosWithUploadOption.length}
                ref={(node) => {
                  if (
                    node &&
                    highlightLogo?.focus &&
                    highlightLogo?.showEffect
                  ) {
                    node.focus();
                  }
                }}
              />
            </MediaWrapper>
            <LabelWrapper>
              <Label>{__('Publisher Logo', 'web-stories')}</Label>
              <Row>
                <Required />
                {canManageSettings && (
                  <Link
                    rel="noopener noreferrer"
                    target="_blank"
                    href={dashboardSettingsLink}
                    size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
                  >
                    {__('Manage', 'web-stories')}
                  </Link>
                )}
              </Row>
            </LabelWrapper>
          </DropdownWrapper>
        </HighlightRow>
      </PanelContent>
    </Panel>
  );
}

export default PublishPanel;
