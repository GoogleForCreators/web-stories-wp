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
import { useFeature } from 'flagged';
import { useCallback, useMemo } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import { useCanvas, useStory } from '../../app';

function useVideoTrimMode() {
  const isVideoTrimEnabled = useFeature('enableVideoTrim');
  const { isEditing, isTrimming, setEditingElementWithState, clearEditing } =
    useCanvas(
      ({
        state: { isEditing, editingElementState: { isTrimming } = {} },
        actions: { setEditingElementWithState, clearEditing },
      }) => ({
        isEditing,
        isTrimming,
        setEditingElementWithState,
        clearEditing,
      })
    );
  const { selectedElement } = useStory(({ state: { selectedElements } }) => ({
    selectedElement: selectedElements.length === 1 ? selectedElements[0] : null,
  }));

  const toggleTrimMode = useCallback(() => {
    if (isEditing) {
      clearEditing();
    } else {
      setEditingElementWithState(selectedElement.id, {
        isTrimming: true,
      });
    }
  }, [isEditing, clearEditing, setEditingElementWithState, selectedElement]);

  const hasTrimMode = useMemo(
    () => selectedElement?.type === 'video' && isVideoTrimEnabled,
    [selectedElement, isVideoTrimEnabled]
  );

  return {
    isTrimMode: isEditing && isTrimming,
    hasTrimMode,
    toggleTrimMode,
  };
}

export default useVideoTrimMode;
