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
import { useCallback } from 'react';

/**
 * Internal dependencies
 */
import { useStory } from '../../app';
import useGlobalClipboardHandlers from '../../utils/useGlobalClipboardHandlers';
import {
  addElementsToClipboard,
  processPastedElements,
} from '../../utils/copyPaste';
import useBatchingCallback from '../../utils/useBatchingCallback';
import usePasteTextContent from '../richText/usePasteTextContent';
import useAddPastedElements from './useAddPastedElements';
import useUploadWithPreview from './useUploadWithPreview';
import useInsertElement from './useInsertElement';

function useCanvasGlobalKeys() {
  const addPastedElements = useAddPastedElements();

  const { currentPage, selectedElements, deleteSelectedElements } = useStory(
    ({
      state: { currentPage, selectedElements },
      actions: { deleteSelectedElements },
    }) => {
      return {
        currentPage,
        selectedElements,
        deleteSelectedElements,
      };
    }
  );

  const uploadWithPreview = useUploadWithPreview();
  const insertElement = useInsertElement();
  const pasteTextContent = usePasteTextContent(insertElement);

  const copyCutHandler = useCallback(
    (evt) => {
      const { type: eventType } = evt;
      if (selectedElements.length === 0) {
        return;
      }

      addElementsToClipboard(currentPage, selectedElements, evt);

      if (eventType === 'cut') {
        deleteSelectedElements();
      }
      evt.preventDefault();
    },
    [currentPage, deleteSelectedElements, selectedElements]
  );

  const elementPasteHandler = useBatchingCallback(
    (content) => {
      const elements = processPastedElements(content, currentPage);
      return addPastedElements(elements);
    },
    [addPastedElements, currentPage]
  );

  const pasteHandler = useCallback(
    (evt) => {
      const { clipboardData } = evt;

      try {
        // Get the html text and plain text but only if it's not a file being copied.
        const content =
          !clipboardData.files?.length &&
          (clipboardData.getData('text/html') ||
            clipboardData.getData('text/plain'));
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

        const { items } = clipboardData;
        /**
         * Loop through all items in clipboard to check if correct type. Ignore text here.
         */
        let files = [];
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
