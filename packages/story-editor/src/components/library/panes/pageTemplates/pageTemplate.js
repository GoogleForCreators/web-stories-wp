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
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  themeHelpers,
} from '@web-stories-wp/design-system';
import { __ } from '@web-stories-wp/i18n';
import {
  forwardRef,
  useCallback,
  useEffect,
  useFocusOut,
  useState,
} from '@web-stories-wp/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { generatePatternStyles } from '@web-stories-wp/patterns';
import { fetchRemoteBlob, blobToFile } from '@web-stories-wp/media';
import { trackError } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { useAPI } from '../../../../app/api';
import { useConfig } from '../../../../app/config';
import { usePageDataUrls } from '../../../../app/pageDataUrls';
import { useUploader } from '../../../../app/uploader';
import { PageSizePropType } from '../../../../types';
import { focusStyle } from '../../../panels/shared';
import DisplayElement from '../../../canvas/displayElement';

const TemplateImage = styled.img`
  width: 100%;
  height: auto;
`;

const PageTemplateWrapper = styled.div`
  position: absolute;
  top: 0;
  height: ${({ pageSize }) => pageSize.height}px;
  width: ${({ pageSize }) => pageSize.width}px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  transform: ${({ translateX, translateY }) =>
    `translateX(${translateX}px) translateY(${translateY}px)`};

  ${({ isHighlighted }) => isHighlighted && themeHelpers.focusCSS};
  ${focusStyle};
`;
PageTemplateWrapper.propTypes = {
  pageSize: PageSizePropType.isRequired,
  translateY: PropTypes.number.isRequired,
  translateX: PropTypes.number.isRequired,
};

const PreviewPageWrapper = styled.div`
  position: relative;
  height: ${({ pageSize }) => pageSize.height}px;
  width: ${({ pageSize }) => pageSize.width}px;
  z-index: -1;
  background-color: ${({ theme }) => theme.colors.interactiveBg.secondary};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  overflow: hidden;
  ${({ background }) => generatePatternStyles(background)}
`;
PreviewPageWrapper.propTypes = {
  pageSize: PageSizePropType.isRequired,
};

const ButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  padding: 8px;
`;

const PageTemplateTitle = styled.div`
  position: absolute;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.opacity.black64};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};

  padding: 8px;
  font-size: 12px;
  line-height: 22px;
  width: 100%;
  align-self: flex-end;
`;

PageTemplateTitle.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

function PageTemplate(
  { page, pageSize, translateY, translateX, isActive, handleDelete, ...rest },
  ref
) {
  const queuePageImageGeneration = usePageDataUrls(
    ({ actions }) => actions.queuePageImageGeneration
  );
  const pageDataUrl = usePageDataUrls(
    ({ state: { dataUrls } }) => dataUrls[page.id]
  );
  const {
    capabilities: { hasUploadMediaAction },
  } = useConfig();
  const {
    actions: { updatePageTemplate },
  } = useAPI();
  const {
    actions: { uploadFile },
  } = useUploader();
  const [isHover, setIsHover] = useState(false);
  const isActivePage = isHover || isActive;

  useFocusOut(ref, () => setIsHover(false), []);

  const { highlightedTemplate } = rest;

  const handleSetHoverActive = useCallback(() => setIsHover(true), []);

  const handleSetHoverFalse = useCallback(() => {
    setIsHover(false);
  }, []);

  const imageUrl = page.image?.url || pageDataUrl;
  const shouldPostBlob =
    hasUploadMediaAction && pageDataUrl && !page.image?.url;
  useEffect(() => {
    if (!shouldPostBlob) {
      return;
    }

    (async () => {
      try {
        const blob = await fetchRemoteBlob(pageDataUrl);
        const file = blobToFile(
          blob,
          `web-stories-page-template-${page.templateId}.jpg`,
          'image/jpeg'
        );
        const resource = await uploadFile(file, {
          post: page.templateId,
          web_stories_media_source: 'page-template',
        });

        updatePageTemplate(page.templateId, {
          featured_media: resource.id,
        });
      } catch (err) {
        // Catch upload errors, e.g. if the file is too large,
        // so that the page template can still be added, albeit without an image.
        trackError('upload_generated_page_template_image', err?.message);
      }
    })();
  }, [
    pageDataUrl,
    uploadFile,
    updatePageTemplate,
    page.templateId,
    shouldPostBlob,
  ]);

  useEffect(() => {
    // We don't want to go through the work of generating a blob if the user
    // can't upload it because their machine will have to regenerate it everytime
    // the page refreshes.
    if (imageUrl || !hasUploadMediaAction) {
      return;
    }
    queuePageImageGeneration(page);
  }, [imageUrl, queuePageImageGeneration, page, hasUploadMediaAction]);

  return (
    <PageTemplateWrapper
      pageSize={pageSize}
      role="listitem"
      ref={ref}
      // Needed for custom keyboard navigation implementation.
      // eslint-disable-next-line styled-components-a11y/no-noninteractive-tabindex
      tabIndex={0}
      onMouseEnter={handleSetHoverActive}
      onMouseLeave={handleSetHoverFalse}
      aria-label={page.title}
      translateY={translateY}
      translateX={translateX}
      isHighlighted={page.id === highlightedTemplate}
      {...rest}
    >
      <PreviewPageWrapper pageSize={pageSize} background={page.backgroundColor}>
        {imageUrl ? (
          <TemplateImage
            alt={page.image?.alt || __('Saved Page Template', 'web-stories')}
            src={imageUrl}
            height={page.image?.height}
            width={page.image?.height}
            draggable={false}
          />
        ) : (
          page.elements.map((element) => (
            <DisplayElement key={element.id} previewMode element={element} />
          ))
        )}
        {isActivePage && handleDelete && (
          <ButtonWrapper>
            <Button
              variant={BUTTON_VARIANTS.CIRCLE}
              type={BUTTON_TYPES.SECONDARY}
              size={BUTTON_SIZES.SMALL}
              onClick={(e) => handleDelete(page, e)}
              aria-label={__('Delete Page Template', 'web-stories')}
            >
              <Icons.Trash />
            </Button>
          </ButtonWrapper>
        )}
      </PreviewPageWrapper>

      {page.title && (
        <PageTemplateTitle isActive={isActivePage}>
          {page.title}
        </PageTemplateTitle>
      )}
    </PageTemplateWrapper>
  );
}

const PageTemplateWithRef = forwardRef(PageTemplate);

PageTemplate.propTypes = {
  isActive: PropTypes.bool,
  page: PropTypes.object.isRequired,
  pageSize: PageSizePropType.isRequired,
  translateY: PropTypes.number.isRequired,
  translateX: PropTypes.number.isRequired,
  handleDelete: PropTypes.func,
};

PageTemplate.displayName = 'PageTemplate';

export default PageTemplateWithRef;
