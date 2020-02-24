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
import {
  DEFAULT_EDITOR_PAGE_WIDTH,
  DEFAULT_EDITOR_PAGE_HEIGHT,
} from '../../constants';
import { createNewElement, getDefinitionForType } from '../../elements';
import { editorToDataX, editorToDataY } from '../../units';
import { useStory } from '../../app';

function useInsertElement() {
  const {
    actions: { addElement, setBackgroundElement },
    state: { currentPage },
  } = useStory();

  const isMediaEl = (type) => {
    const { isMedia } = getDefinitionForType(type);
    return isMedia;
  };
  const insertElement = (type, { width, height, isBackground, ...props }) => {
    const element = createNewElement(type, {
      ...props,
      x: editorToDataX(80 * Math.random(), DEFAULT_EDITOR_PAGE_WIDTH),
      isBackground,
      y: editorToDataY(70 * Math.random(), DEFAULT_EDITOR_PAGE_HEIGHT),
      width: editorToDataX(width, DEFAULT_EDITOR_PAGE_WIDTH),
      height: editorToDataY(height, DEFAULT_EDITOR_PAGE_HEIGHT),
    });
    addElement({ element });
    if (
      isMediaEl(type) &&
      isBackground &&
      !currentPage.elements.some(({ type: elType }) => isMediaEl(elType))
    ) {
      setBackgroundElement({ elementId: element.id });
    }
    return element;
  };

  return insertElement;
}

export default useInsertElement;
