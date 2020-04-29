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
import { v4 as uuidv4 } from 'uuid';
import { useCallback } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../app';
import { useUploader } from '../../app/uploader';
import { useSnackbar } from '../../app/snackbar';
import useClipboardHandlers from '../../utils/useClipboardHandlers';
import processPastedNodeList from '../../utils/processPastedNodeList';
import { getDefinitionForType } from '../../elements';
import useInsertElement from './useInsertElement';

const DOUBLE_DASH_ESCAPE = '_DOUBLEDASH_';

/**
 * @param {?Element} container
 */
function useCanvasSelectionCopyPaste(container) {
  const {
    state: { currentPage, selectedElements },
    actions: { addElement, deleteSelectedElements },
  } = useStory();

  const { uploadFile, isValidType } = useUploader();
  const { showSnackbar } = useSnackbar();

  const insertElement = useInsertElement();

  const copyCutHandler = useCallback(
    (evt) => {
      const { type: eventType, clipboardData } = evt;

      if (selectedElements.length === 0) {
        return;
      }

      const payload = {
        sentinel: 'story-elements',
        // @todo: Ensure that there's no unserializable data here. The easiest
        // would be to keep all serializable data together and all non-serializable
        // in a separate property.
        items: selectedElements.map((element) => ({
          ...element,
          basedOn: element.id,
          id: undefined,
        })),
      };
      const serializedPayload = JSON.stringify(payload).replace(
        /--/g,
        DOUBLE_DASH_ESCAPE
      );

      const textContent = selectedElements
        .map(({ type, ...rest }) => {
          const { TextContent } = getDefinitionForType(type);
          if (TextContent) {
            return TextContent({ ...rest });
          }
          return type;
        })
        .join('\n');

      const htmlContent = selectedElements
        .map(({ type, ...rest }) => {
          // eslint-disable-next-line @wordpress/no-unused-vars-before-return
          const { Output } = getDefinitionForType(type);
          return renderToStaticMarkup(
            <Output element={rest} box={{ width: 100, height: 100 }} />
          );
        })
        .join('\n');

      clipboardData.setData('text/plain', textContent);
      clipboardData.setData(
        'text/html',
        `<!-- ${serializedPayload} -->${htmlContent}`
      );

      if (eventType === 'cut') {
        deleteSelectedElements();
      }

      evt.preventDefault();
    },
    [deleteSelectedElements, selectedElements]
  );

  const elementPasteHandler = useCallback(
    (content) => {
      let foundElements = false;
      for (let n = content.firstChild; n; n = n.nextSibling) {
        if (n.nodeType !== /* COMMENT */ 8) {
          continue;
        }
        const payload = JSON.parse(
          n.nodeValue.replace(new RegExp(DOUBLE_DASH_ESCAPE, 'g'), '--')
        );
        if (payload.sentinel !== 'story-elements') {
          continue;
        }
        foundElements = true;
        payload.items.forEach(({ x, y, basedOn, ...rest }) => {
          currentPage.elements.forEach((element) => {
            if (element.id === basedOn || element.basedOn === basedOn) {
              x = Math.max(x, element.x + 60);
              y = Math.max(y, element.y + 60);
            }
          });
          const element = {
            ...rest,
            basedOn,
            id: uuidv4(),
            x,
            y,
          };
          addElement({ element });
        });
      }
      return foundElements;
    },
    [addElement, currentPage]
  );

  const rawPasteHandler = useCallback(
    (content) => {
      let foundContent = false;
      // @todo Images.
      const copiedContent = processPastedNodeList(content.childNodes, '');
      if (copiedContent.trim().length) {
        insertElement('text', { content: copiedContent });
        foundContent = true;
      }
      return foundContent;
    },
    [insertElement]
  );

  // @todo This should be in global handler by UX, not just Canvas.
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
          template.innerHTML = content.replace(/<meta[^>]+>/g, '');
          let addedElements = elementPasteHandler(template.content);
          if (!addedElements) {
            addedElements = rawPasteHandler(template.content);
          }
          if (addedElements) {
            // @todo Should we always prevent default?
            evt.preventDefault();
          }
        }
        const { items } = clipboardData;
        /**
         * Loop through all items in clipboard to check if correct type. Ignore text here.
         */
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (isValidType(item)) {
            try {
              uploadFile(item.getAsFile());
            } catch (e) {
              if (!e.isUserError) {
                e.message = __(
                  'Sorry, file has failed to upload',
                  'web-stories'
                );
              }
              showSnackbar({
                message: e.message,
              });
            }
          }
        }
      } catch (e) {
        // Ignore.
      }
    },
    [
      elementPasteHandler,
      isValidType,
      rawPasteHandler,
      showSnackbar,
      uploadFile,
    ]
  );

  useClipboardHandlers(container, copyCutHandler, pasteHandler);

  // @todo: return copy/cut/pasteAction that can be used in the context menus.
}

export default useCanvasSelectionCopyPaste;
