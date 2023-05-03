/*
 * Copyright 2021 Google LLC
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
import { useCallback, useBatchingCallback } from '@googleforcreators/react';
import { usePasteTextContent } from '@googleforcreators/rich-text';
import { __, _n, sprintf } from '@googleforcreators/i18n';
import { useSnackbar } from '@googleforcreators/design-system';
import {
  elementIs,
  ElementType,
  type TextElement,
} from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useStory } from '../story';
import useGlobalClipboardHandlers from '../../utils/useGlobalClipboardHandlers';
import {
  addElementsToClipboard,
  processPastedElements,
} from '../../utils/copyPaste';
import useUploadWithPreview from '../../components/canvas/useUploadWithPreview';
import useInsertElement from '../../components/canvas/useInsertElement';
import { DEFAULT_PRESET } from '../../components/library/panes/text/textPresets';
import { MAX_PRODUCTS_PER_PAGE } from '../../constants';
import useAddPastedElements from './useAddPastedElements';

function useCanvasGlobalKeys() {
  const addPastedElements = useAddPastedElements();

  const {
    currentPage,
    selectedElements,
    deleteSelectedElements,
    selectedElementAnimations,
    selectedElementsGroups,
    currentPageProductIds,
  } = useStory(
    ({
      state: { currentPage, selectedElements, selectedElementAnimations },
      actions: { deleteSelectedElements },
    }) => {
      const selectedElementsGroupsIds = selectedElements
        .map((el) => el.groupId)
        .filter(Boolean);
      const selectedElementsGroupsEntries = Object.entries(
        currentPage?.groups || {}
      ).filter(([groupId]) => selectedElementsGroupsIds.includes(groupId));
      const selectedElementsGroups = Object.fromEntries(
        selectedElementsGroupsEntries
      );
      return {
        currentPage,
        selectedElements,
        deleteSelectedElements,
        selectedElementAnimations,
        selectedElementsGroups,
        currentPageProductIds: currentPage?.elements
          ?.filter(elementIs.product)
          .map(({ product }) => product.productId),
      };
    }
  );

  const showSnackbar = useSnackbar(({ showSnackbar }) => showSnackbar);

  const uploadWithPreview = useUploadWithPreview();
  const insertElement = useInsertElement();
  const pasteInserter = (content: string) =>
    insertElement(ElementType.Text, {
      ...DEFAULT_PRESET,
      content,
    } as unknown as TextElement);
  const pasteTextContent = usePasteTextContent(pasteInserter);

  const copyCutHandler = useCallback(
    (evt: ClipboardEvent) => {
      if (!currentPage) {
        return;
      }
      const { type: eventType } = evt;
      if (selectedElements.length === 0) {
        return;
      }

      addElementsToClipboard(
        currentPage,
        selectedElements,
        selectedElementAnimations,
        selectedElementsGroups,
        evt
      );

      if (eventType === 'cut') {
        deleteSelectedElements();
      }
      evt.preventDefault();
    },
    [
      currentPage,
      deleteSelectedElements,
      selectedElements,
      selectedElementAnimations,
      selectedElementsGroups,
    ]
  );

  const elementPasteHandler = useBatchingCallback(
    (content: DocumentFragment): boolean => {
      if (!currentPage) {
        return false;
      }
      const { elements, animations, groups } = processPastedElements(
        content,
        currentPage,
        selectedElements
      );

      const newProductsFromElements = elements
        .filter(elementIs.product)
        .filter(({ product }) => product.productId)
        .map(({ product }) => product);

      if (currentPageProductIds) {
        if (
          currentPageProductIds.length >= MAX_PRODUCTS_PER_PAGE ||
          newProductsFromElements.length + currentPageProductIds.length >
            MAX_PRODUCTS_PER_PAGE
        ) {
          showSnackbar({
            message: sprintf(
              /* translators: %d: max number of products. */
              _n(
                'Only %d item can be added per page.',
                'Only %d items can be added per page.',
                MAX_PRODUCTS_PER_PAGE,
                'web-stories'
              ),
              MAX_PRODUCTS_PER_PAGE.toString()
            ),
          });
        } else {
          newProductsFromElements.forEach(
            ({ productId, productTitle, productImages }) => {
              if (currentPageProductIds.includes(productId)) {
                showSnackbar({
                  message: sprintf(
                    /* translators: %s: product title. */
                    __(
                      'Product "%s" already exists on the page.',
                      'web-stories'
                    ),
                    productTitle
                  ),
                  thumbnail: productImages?.[0]?.url
                    ? {
                        src: productImages[0].url,
                        alt: productImages[0].alt,
                      }
                    : undefined,
                });
              }
            }
          );
        }
      }

      return addPastedElements(elements, animations, groups);
    },
    [
      addPastedElements,
      currentPage,
      showSnackbar,
      currentPageProductIds,
      selectedElements,
    ]
  );

  const pasteHandler = useCallback(
    (evt: ClipboardEvent) => {
      const { clipboardData } = evt;

      try {
        // Get the html text and plain text but only if it's not a file being copied.
        const content =
          !clipboardData?.files?.length &&
          (clipboardData?.getData('text/html') ||
            clipboardData?.getData('text/plain'));
        if (content) {
          const template = document.createElement('template');
          // Remove meta tag.
          template.innerHTML = content
            .replace(/<meta[^>]+>/g, '')
            .replace(/<\/?html>/g, '')
            .replace(/<\/?body>/g, '');
          // First check if it's a paste of "real" elements copied from this editor
          let hasAddedElements = elementPasteHandler(template.content);
          if (!hasAddedElements) {
            // If not, parse as HTML and insert text with formatting
            hasAddedElements = pasteTextContent(template.innerHTML);
          }
          if (hasAddedElements) {
            evt.preventDefault();
          }
        }

        if (!clipboardData) {
          return;
        }
        const { items } = clipboardData;
        /**
         * Loop through all items in clipboard to check if correct type. Ignore text here.
         */
        const files = [];
        for (let i = 0; i < items.length; i++) {
          const file = items[i].getAsFile();
          if (file) {
            files.push(file);
          }
        }
        if (files.length > 0) {
          uploadWithPreview(files);
        }
      } catch (e) {
        // Ignore.
      }
    },
    [elementPasteHandler, pasteTextContent, uploadWithPreview]
  );

  useGlobalClipboardHandlers(copyCutHandler, pasteHandler);

  // @todo: return copy/cut/pasteAction that can be used in the context menus.
}

export default useCanvasGlobalKeys;
