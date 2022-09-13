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
import type { ReactNode } from 'react';

import { useMemo } from '@googleforcreators/react';
import type { Element } from '@googleforcreators/types';

/**
 * Internal dependencies
 */
import Context, { ContextState } from './context';
import {
  dataToEditorX,
  dataToEditorY,
  editorToDataX,
  editorToDataY,
  getBox,
  getBoxWithBorder,
} from './dimensions';

interface PageSize {
  width: number;
  height: number;
}

interface UnitsProviderProps {
  pageSize: PageSize;
  children: ReactNode;
}

function UnitsProvider({ pageSize, children }: UnitsProviderProps) {
  const { width: pageWidth, height: pageHeight } = pageSize;
  const state: ContextState = useMemo(
    () => ({
      state: {
        pageSize: { width: pageWidth, height: pageHeight },
      },
      actions: {
        dataToEditorX: (x: number) => dataToEditorX(x, pageWidth),
        dataToEditorY: (y: number) => dataToEditorY(y, pageHeight),
        editorToDataX: (x: number, withRounding: boolean) =>
          editorToDataX(x, pageWidth, withRounding),
        editorToDataY: (y: number, withRounding: boolean) =>
          editorToDataY(y, pageHeight, withRounding),
        getBox: (element: Element) => getBox(element, pageWidth, pageHeight),
        getBoxWithBorder: (element: Element) =>
          getBoxWithBorder(element, pageWidth, pageHeight),
      },
    }),
    [pageWidth, pageHeight]
  );

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

export default UnitsProvider;
