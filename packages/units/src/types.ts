/*
 * Copyright 2022 Google LLC
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

export interface ElementBox {
  x: number;
  y: number;
  width: number;
  height: number;
  rotationAngle: number;
}

interface Border {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface DimensionableElement extends ElementBox {
  isBackground?: boolean;
  border?: Border;
}

export interface State {
  state: {
    pageSize: {
      width: number;
      height: number;
    };
  };
  actions: {
    dataToEditorX: (x: number) => number;
    dataToEditorY: (y: number) => number;
    editorToDataX: (x: number, withRounding?: boolean) => number;
    editorToDataY: (y: number, withRounding?: boolean) => number;
    getBox: (element: DimensionableElement) => ElementBox;
    getBoxWithBorder: (element: DimensionableElement) => ElementBox;
  };
}

export interface Coordinates {
  x: number;
  y: number;
}

export enum Corner {
  TopLeft = 'topLeftPoint',
  TopRight = 'topRightPoint',
  BottomRight = 'bottomRightPoint',
  BottomLeft = 'bottomLeftPoint',
}

export type Corners = {
  [key in Corner]: Coordinates;
};
