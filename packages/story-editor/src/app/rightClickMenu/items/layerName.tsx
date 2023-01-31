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

/**
 * External dependencies
 */
import { ContextMenuComponents } from '@googleforcreators/design-system';
import { useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { RIGHT_CLICK_MENU_LABELS } from '../constants';
import useCanvas from '../../canvas/useCanvas';
import useStory from '../../story/useStory';

function LayerName() {
  const { selectedElementIds } = useStory(({ state }) => ({
    selectedElementIds: state.selectedElementIds,
  }));
  const { setRenamableLayer } = useCanvas(({ state, actions }) => ({
    setRenamableLayer: actions.setRenamableLayer,
    renamableLayer: state.renamableLayer,
  }));
  const enableLayerNaming = useCallback(() => {
    if (selectedElementIds?.length) {
      setRenamableLayer({
        elementId: selectedElementIds[0],
      });
    }
  }, [setRenamableLayer, selectedElementIds]);

  return (
    <>
      <ContextMenuComponents.MenuSeparator />
      <ContextMenuComponents.MenuButton onClick={enableLayerNaming}>
        {RIGHT_CLICK_MENU_LABELS.RENAME_LAYER}
      </ContextMenuComponents.MenuButton>
    </>
  );
}

export default LayerName;
