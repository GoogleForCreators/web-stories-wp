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
  useKeyDownEffect,
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

/**
 * Internal dependencies
 */
import { useAPI } from '../../../../app/api';
import { useConfig } from '../../../../app/config';
import { usePageDataUrls } from '../../../../app/pageDataUrls';
import { useUploader } from '../../../../app/uploader';
import { PageSizePropType } from '../../../../types';
import { focusStyle } from '../../../panels/shared/styles';
import DisplayElement from '../../../canvas/displayElement';
import InsertionOverlay from '../shared/insertionOverlay';
import useFocusCanvas from '../../../canvas/useFocusCanvas';
import { ActionButton } from '../shared';
import useRovingTabIndex from '../../../../utils/useRovingTabIndex';
import useLibrary from '../../useLibrary';

const TemplateImage = styled.img`
  width: 100%;
  height: auto;
`;

const PageTemplateWrapper = styled.div`
  height: ${({ pageSize }) => pageSize.height}px;
  width: ${({ pageSize }) => pageSize.width}px;
  cursor: pointer;

  ${({ isHighlighted }) => isHighlighted && themeHelpers.focusCSS};
  ${focusStyle};
`;
PageTemplateWrapper.propTypes = {
  pageSize: PageSizePropType.isRequired,
};

const PreviewPageWrapper = styled.div`
  position: relative;
  height: ${({ pageSize }) => pageSize.height}px;
  width: ${({ pageSize }) => pageSize.width}px;
  background-color: ${({ theme }) => theme.colors.interactiveBg.secondary};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  overflow: hidden;
  ${({ background }) => generatePatternStyles(background)}
`;
PreviewPageWrapper.propTypes = {
  pageSize: PageSizePropType.isRequired,
};

const DeleteButton = styled(ActionButton)`
  top: 4px;
  right: 4px;
`;

// This is used for nested roving tab index to detect parent siblings.
const BUTTON_NESTING_DEPTH = 2;

function SavedPageTemplate(
  { page, pageSize, handleDelete, index, ...rest },
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
  const pageDataUrl = usePageDataUrls(
    ({ state: { dataUrls } }) => dataUrls[page.id]
  );
  const [isActive, setIsActive] = useState(false);

  useFocusOut(ref, () => setIsActive(false), []);

  const { highlightedTemplate, onClick } = rest;

  const makeActive = useCallback(() => setIsActive(true), []);

  const makeInactive = useCallback(() => {
    setIsActive(false);
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
          templateId: page.templateId,
          mediaSource: 'page-template',
        });

        updatePageTemplate(page.templateId, {
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
  const deleteButtonRef = useRef();
  useRovingTabIndex({ ref: insertButtonRef }, [], BUTTON_NESTING_DEPTH);
  useRovingTabIndex({ ref: deleteButtonRef }, [], BUTTON_NESTING_DEPTH);

  const focusCanvas = useFocusCanvas();
  useKeyDownEffect(deleteButtonRef, 'tab', focusCanvas, [focusCanvas]);

  return (
    // eslint-disable-next-line styled-components-a11y/click-events-have-key-events,styled-components-a11y/no-noninteractive-element-interactions -- clicking and events need to work on the wrapper AND in the contained buttons as well.
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
      onClick={onClick}
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
        {isActive && <InsertionOverlay showIcon={false} />}
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
        <DeleteButton
          ref={deleteButtonRef}
          $display={isActive}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(page, e);
          }}
          aria-label={__('Delete Page Template', 'web-stories')}
          tabIndex={isActive ? 0 : -1}
        >
          <Icons.TrashFilledSmall />
        </DeleteButton>
      </PreviewPageWrapper>
    </PageTemplateWrapper>
  );
}

const PageTemplateWithRef = forwardRef(SavedPageTemplate);

SavedPageTemplate.propTypes = {
  isActive: PropTypes.bool,
  page: PropTypes.object.isRequired,
  pageSize: PageSizePropType.isRequired,
  handleDelete: PropTypes.func,
  index: PropTypes.number,
};

SavedPageTemplate.displayName = 'SavedPageTemplate';

export default PageTemplateWithRef;
