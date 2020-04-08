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
import { getDefinitionForType } from '../../elements';
import createSolid from '../../utils/createSolid';
import { BACKGROUND_TEXT_MODE, PAGE_WIDTH } from '../../constants';
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

  const insertElement = useInsertElement();

  const { uploadFile, isValidType } = useUploader();
  const { showSnackbar } = useSnackbar();

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
        /\-\-/g,
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

  const pasteHandler = useCallback(
    (evt) => {
      const { clipboardData } = evt;

      try {
        const html = clipboardData.getData('text/html');
        if (html) {
          const template = document.createElement('template');
          template.innerHTML = html;
          let copyingStoryElement = false;
          let copiedContent = '';
          for (let n = template.content.firstChild; n; n = n.nextSibling) {
            if (n.nodeType !== /* COMMENT */ 8) {
              if (copiedContent.length && n.tagName === 'P') {
                copiedContent += ' ';
              }
              if (n.textContent.length) {
                copiedContent += n.textContent;
              }
              continue;
            }
            const payload = JSON.parse(
              n.nodeValue.replace(new RegExp(DOUBLE_DASH_ESCAPE, 'g'), '--')
            );
            if (payload.sentinel !== 'story-elements') {
              continue;
            }
            copyingStoryElement = true;
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
            evt.preventDefault();
          }
          // If we're not copying a Story element, assume copying text.
          if (!copyingStoryElement && copiedContent.length) {
            const props = {
              type: 'text',
              x: 0,
              y: 0,
              height: 100,
              id: uuidv4(),
              content: copiedContent,
              color: createSolid(0, 0, 0),
              backgroundColor: createSolid(196, 196, 196),
              backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
              width: PAGE_WIDTH / 2,
            };
            insertElement('text', props);
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
      addElement,
      currentPage,
      insertElement,
      isValidType,
      showSnackbar,
      uploadFile,
    ]
  );

  useClipboardHandlers(container, copyCutHandler, pasteHandler);

  // @todo: return copy/cut/pasteAction that can be used in the context menus.
}

export default useCanvasSelectionCopyPaste;
