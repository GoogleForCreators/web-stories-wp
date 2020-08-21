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
import { useUnits } from '../../../units';
import getResizedFrame from '../utils/getResizedFrame';

function useResize({ onGroupEventEnd, targetList, setTransformStyle }) {
  const { editorToDataX, editorToDataY, dataToEditorY } = useUnits((state) => ({
    editorToDataX: state.actions.editorToDataX,
    editorToDataY: state.actions.editorToDataY,
    dataToEditorY: state.actions.dataToEditorY,
  }));

  const onResizeGroupStart = ({ events }) => {
    events.forEach((ev, i) => {
      const frame = frames[i];
      ev.setOrigin(['%', '%']);
      if (ev.dragStart) {
        ev.dragStart.set(frame.translate);
      }
    });
  };
  const onResizeGroup = ({ events }) => {
    events.forEach(({ target, direction, width, height, drag }, i) => {
      const sFrame = frames[i];
      const { element } = targetList[i];
      const frame = getResizedFrame({
        target,
        height,
        width,
        drag,
        direction,
        element,
        editorToDataX,
        editorToDataY,
        dataToEditorY,
      });
      setTransformStyle(element.id, target, {
        ...sFrame,
        ...frame,
      });
    });
  };
  const onResizeGroupEnd = ({ targets }) => {
    onGroupEventEnd({ targets, isResize: true });
  };
  return {
    onResizeGroup,
    onResizeGroupStart,
    onResizeGroupEnd,
  };
}

export default useResize;
