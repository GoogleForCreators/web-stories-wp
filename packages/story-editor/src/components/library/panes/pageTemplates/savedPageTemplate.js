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
  Icons,
  themeHelpers,
  Text,
  TextSize,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import {
  forwardRef,
  useCallback,
  useEffect,
  useFocusOut,
  useState,
  useRef,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { generatePatternStyles } from '@googleforcreators/patterns';
import { fetchRemoteBlob, blobToFile } from '@googleforcreators/media';
import { trackError } from '@googleforcreators/tracking';
import { UnitsProvider } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import { useAPI } from '../../../../app/api';
import { useConfig } from '../../../../app/config';
import { usePageDataUrls } from '../../../../app/pageDataUrls';
import { useUploader } from '../../../../app/uploader';
import { PageSizePropType } from '../../../../propTypes';
import { focusStyle } from '../../../panels/shared/styles';
import DisplayElement from '../../../canvas/displayElement';
import InsertionOverlay from '../shared/insertionOverlay';
import { ActionButton, PageTemplateTitleContainer } from '../shared';
import useRovingTabIndex from '../../../../utils/useRovingTabIndex';
import useLibrary from '../../useLibrary';
import DropDownMenu from './dropDownMenu';

const TemplateImage = styled.img`
  width: 100%;
  height: auto;
`;

const PageTemplateWrapper = styled.div`
  position: relative;
  height: ${({ pageSize }) => pageSize.height}px;
  width: ${({ pageSize }) => pageSize.width}px;
  cursor: pointer;

  ${({ isHighlighted }) => isHighlighted && themeHelpers.focusCSS};
  ${focusStyle};
`;

PageTemplateWrapper.propTypes = {
  pageSize: PageSizePropType.isRequired,
};

const PreviewPageWrapper = styled.button`
  position: relative;
  padding: 0;
  border: 0;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.interactiveBg.secondary};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  overflow: hidden;
  ${({ background }) => generatePatternStyles(background)}
`;
PreviewPageWrapper.propTypes = {
  pageSize: PageSizePropType.isRequired,
};

const ElementsWrapper = styled.div`
  z-index: 10;
`;

const TemplateInsertionOverlay = styled(InsertionOverlay)`
  z-index: 11;
`;

const TemplateTitleContainer = styled(PageTemplateTitleContainer)`
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};
`;

// This is used for nested roving tab index to detect parent siblings.
const BUTTON_NESTING_DEPTH = 2;

function SavedPageTemplate(
  {
    page,
    pageSize,
    handleDelete,
    index,
    title = '',
    highlightedTemplate,
    onClick,
  },
  ref
) {
  const {
    capabilities: { hasUploadMediaAction },
  } = useConfig();
  const {
    actions: { updatePageTemplate },
  } = useAPI();
  const {
    actions: { uploadFile },
  } = useUploader();

  const { updateSavedTemplate } = useLibrary((state) => ({
    updateSavedTemplate: state.actions.updateSavedTemplate,
  }));
  const queuePageImageGeneration = usePageDataUrls(
    ({ actions }) => actions.queuePageImageGeneration
  );
  const pageDataUrl =
    usePageDataUrls(({ state: { dataUrls } }) => dataUrls[page.id]) ||
    page.pregeneratedPageDataUrl;
  const [isActive, setIsActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const onMenuOpen = useCallback((e) => {
    e.stopPropagation();
    setIsMenuOpen(true);
    setIsActive(false);
  }, []);

  const onMenuCancelled = useCallback(() => {
    setIsMenuOpen(false);
    setIsActive(false);
  }, []);

  const onMenuSelected = useCallback(() => {
    setIsMenuOpen(false);
    setIsActive(false);
  }, []);

  useFocusOut(ref, () => setIsActive(false), []);

  const makeActive = useCallback(() => setIsActive(true), []);

  const makeInactive = useCallback(() => {
    setIsActive(false);
  }, []);

  const updateTemplateName = useCallback(
    async (newName) => {
      const res = await updatePageTemplate(page.templateId, {
        title: newName,
      });

      updateSavedTemplate({
        templateId: page.templateId,
        title: res.title,
      });
      setIsMenuOpen(false);
      setIsActive(false);
    },
    [updatePageTemplate, updateSavedTemplate, page.templateId]
  );

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
          templateId: page.templateId,
          mediaSource: 'page-template',
        });

        await updatePageTemplate(page.templateId, {
          featured_media: resource.id,
        });
        updateSavedTemplate({
          templateId: page.templateId,
          image: {
            id: resource.id,
            height: resource.height,
            width: resource.width,
            url: resource.src,
          },
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
    updateSavedTemplate,
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

  const insertButtonRef = useRef();
  useRovingTabIndex({ ref: insertButtonRef }, [], BUTTON_NESTING_DEPTH);

  return (
    <PageTemplateWrapper
      pageSize={pageSize}
      role="listitem"
      ref={ref}
      onPointerEnter={makeActive}
      onPointerLeave={makeInactive}
      aria-label={page.title}
      isHighlighted={page.id === highlightedTemplate}
      onFocus={makeActive}
      onBlur={makeInactive}
    >
      <PreviewPageWrapper
        pageSize={pageSize}
        background={page.backgroundColor}
        onClick={onClick}
      >
        {imageUrl ? (
          <TemplateImage
            alt={page.image?.alt || __('Saved Page Template', 'web-stories')}
            src={imageUrl}
            crossOrigin="anonymous"
            height={page.image?.height}
            width={page.image?.height}
            draggable={false}
          />
        ) : (
          <ElementsWrapper>
            <UnitsProvider
              pageSize={{
                height: pageSize.height,
                width: pageSize.width,
              }}
            >
              {page.elements.map((element) => (
                <DisplayElement
                  key={element.id}
                  previewMode
                  element={element}
                />
              ))}
            </UnitsProvider>
          </ElementsWrapper>
        )}
        {isActive && <TemplateInsertionOverlay showIcon={false} />}
        {page.title && (
          <TemplateTitleContainer isActive={isActive}>
            <Text.Span size={TextSize.Small}>
              {title !== '' ? title : 'Untitled'}
            </Text.Span>
          </TemplateTitleContainer>
        )}
      </PreviewPageWrapper>
      <ActionButton
        ref={insertButtonRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(e);
        }}
        aria-label={__('Use template', 'web-stories')}
        $display={isActive}
        tabIndex={index === 0 ? 0 : -1}
      >
        <Icons.PlusFilledSmall />
      </ActionButton>
      <DropDownMenu
        display={isActive}
        isMenuOpen={isMenuOpen}
        onMenuOpen={onMenuOpen}
        onMenuCancelled={onMenuCancelled}
        onMenuSelected={onMenuSelected}
        onDelete={() => {
          handleDelete(page.templateId);
        }}
        previousName={page.title.rendered}
        onUpdateName={updateTemplateName}
      />
    </PageTemplateWrapper>
  );
}

const PageTemplateWithRef = forwardRef(SavedPageTemplate);

SavedPageTemplate.propTypes = {
  page: PropTypes.object.isRequired,
  pageSize: PageSizePropType.isRequired,
  handleDelete: PropTypes.func.isRequired,
  index: PropTypes.number,
  title: PropTypes.string,
  highlightedTemplate: PropTypes.object,
  onClick: PropTypes.func,
};

SavedPageTemplate.displayName = 'SavedPageTemplate';

export default PageTemplateWithRef;
