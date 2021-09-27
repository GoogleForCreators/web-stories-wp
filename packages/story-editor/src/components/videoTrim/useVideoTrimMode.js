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
import { canTranscodeResource } from '@web-stories-wp/media';

/**
 * Internal dependencies
 */
import { useCanvas, useStory } from '../../app';
import useFFmpeg from '../../app/media/utils/useFFmpeg';

function useVideoTrimMode() {
  const isVideoTrimEnabled = useFeature('enableVideoTrim');
  const { isEditing, isTrimMode, setEditingElementWithState, clearEditing } =
    useCanvas(
      ({
        state: { isEditing, editingElementState: { isTrimMode } = {} },
        actions: { setEditingElementWithState, clearEditing },
      }) => ({
        isEditing,
        isTrimMode,
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
        isTrimMode: true,
      });
    }
  }, [isEditing, clearEditing, setEditingElementWithState, selectedElement]);

  const { isTranscodingEnabled } = useFFmpeg();

  const hasTrimMode = useMemo(() => {
    if (selectedElement?.type !== 'video' || !selectedElement?.resource) {
      return false;
    }
    const { resource } = selectedElement;
    return (
      isVideoTrimEnabled &&
      isTranscodingEnabled &&
      canTranscodeResource(resource)
    );
  }, [selectedElement, isVideoTrimEnabled, isTranscodingEnabled]);

  return {
    isTrimMode: isEditing && isTrimMode,
    hasTrimMode,
    toggleTrimMode,
  };
}

export default useVideoTrimMode;
