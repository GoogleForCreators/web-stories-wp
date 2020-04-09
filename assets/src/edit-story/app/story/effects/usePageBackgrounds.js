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
import { useEffect } from 'react';
/**
 * Internal dependencies
 */
import { createNewElement } from '../../../elements';
import theme from '../../../theme';
import { PAGE_WIDTH } from '../../../constants';
import { MaskTypes } from '../../../masks';
import createSolidFromString from '../../../utils/createSolidFromString';

// By default, the element should be 33% of the page.
const DEFAULT_ELEMENT_WIDTH = PAGE_WIDTH / 3;

// Make sure pages have background elements at all times
function usePageBackgrounds({ currentPage, setBackgroundElement, addElement }) {
  useEffect(() => {
    if (!currentPage || currentPage?.backgroundElementId) {
      return;
    }
    const element = createNewElement('shape', {
      x: (PAGE_WIDTH / 4) * Math.random(),
      y: (PAGE_WIDTH / 4) * Math.random(),
      width: DEFAULT_ELEMENT_WIDTH,
      height: DEFAULT_ELEMENT_WIDTH,
      rotationAngle: 0,
      mask: {
        type: MaskTypes.RECTANGLE,
      },
      flip: {
        vertical: false,
        horizontal: false,
      },
      isBackground: true,
      backgroundColor: createSolidFromString(theme.colors.fg.v1),
    });
    addElement({ element });
    setBackgroundElement({ elementId: element.id });
  }, [addElement, currentPage, setBackgroundElement]);
}

export default usePageBackgrounds;
