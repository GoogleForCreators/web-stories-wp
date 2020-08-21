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
import { getDefinitionForType } from '../../../elements';

function getResizedFrame({
  target,
  width,
  height,
  drag,
  direction,
  element,
  editorToDataX,
  editorToDataY,
  dataToEditorY,
}) {
  const frame = {};
  const { updateForResizeEvent } = getDefinitionForType(element.type);
  let updates = null;
  if (updateForResizeEvent) {
    updates = updateForResizeEvent(
      element,
      direction,
      editorToDataX(width, false),
      editorToDataY(height, false)
    );
  }
  if (updates && updates.height) {
    height = dataToEditorY(updates.height);
  }
  target.style.width = `${width}px`;
  target.style.height = `${height}px`;
  frame.direction = direction;
  frame.resize = [width, height];
  frame.translate = drag.beforeTranslate;
  frame.updates = updates;
}

export default getResizedFrame;
