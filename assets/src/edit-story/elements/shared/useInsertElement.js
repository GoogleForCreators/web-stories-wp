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
 * Internal dependencies
 */
import { createNewElement, getDefinitionForType } from '..';
import {
  DEFAULT_EDITOR_PAGE_WIDTH,
  DEFAULT_EDITOR_PAGE_HEIGHT,
} from '../../constants';
import { editorToDataX, editorToDataY } from '../../units';
import { useStory } from '../../app';
import { DEFAULT_MASK } from '../../masks';

function useInsertElement() {
  const isMaskable = (type) => {
    const { isMaskable: maskable } = getDefinitionForType(type);
    return maskable;
  };
  const isMedia = (type) => {
    const { isMedia: media } = getDefinitionForType(type);
    return media;
  };
  const {
    actions: { addElement, setBackgroundElement },
    state: { currentPage },
  } = useStory();

  const createElement = (type, { width, height, mask, ...props }) => {
    const element = createNewElement(type, {
      ...props,
      x: editorToDataX(80 * Math.random(), DEFAULT_EDITOR_PAGE_WIDTH),
      y: editorToDataY(70 * Math.random(), DEFAULT_EDITOR_PAGE_HEIGHT),
      width: editorToDataX(width, DEFAULT_EDITOR_PAGE_WIDTH),
      height: editorToDataY(height, DEFAULT_EDITOR_PAGE_HEIGHT),
      ...(isMaskable(type)
        ? {
            mask: mask || DEFAULT_MASK,
          }
        : {}),
    });
    return element;
  };

  // QQQQ: why isBackground here?
  const insertElement = (type, props, isBackground) => {
    const element = createElement(type, props);
    addElement({ element });
    if (
      isMedia(element.type) &&
      isBackground &&
      !currentPage.elements.some(({ type: elType }) => isMedia(elType))
    ) {
      setBackgroundElement({ elementId: element.id });
    }
    return element;
  };

  return insertElement;
}

export default useInsertElement;
