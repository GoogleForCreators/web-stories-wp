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
import { useCallback, useMemo, useState } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
import { getMsFromHMS } from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import { useCanvas, useStory, useAPI, useLocalMedia } from '../../app';
import useFFmpeg from '../../app/media/utils/useFFmpeg';

function useVideoTrimMode() {
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

  const {
    actions: { getMediaById },
  } = useAPI();
  const [videoData, setVideoData] = useState(null);

  const { isCurrentResourceUploading } = useLocalMedia(
    ({ state: { isCurrentResourceUploading } }) => ({
      isCurrentResourceUploading,
    })
  );

  const getVideoData = useCallback(() => {
    const { resource } = selectedElement;
    const { trimData } = resource;

    const defaultVideoData = {
      element: selectedElement,
      resource,
      start: 0,
      end: null,
    };

    if (getMediaById && trimData?.original) {
      // First clear any existing data
      setVideoData(null);
      // Load correct video resource
      getMediaById(trimData.original)
        .then(
          // If exists, use as resource with offsets
          (originalResource) => ({
            element: selectedElement,
            resource: originalResource,
            start: getMsFromHMS(trimData.start),
            end: getMsFromHMS(trimData.end),
          }),
          // If load fails, pretend there's no original
          () => defaultVideoData
        )
        // Regardless, set resulting data as video data
        .then((data) => setVideoData(data));
    } else {
      setVideoData(defaultVideoData);
    }
  }, [getMediaById, selectedElement]);

  const toggleTrimMode = useCallback(() => {
    if (isEditing) {
      clearEditing();
    } else {
      setEditingElementWithState(selectedElement.id, {
        isTrimMode: true,
        hasEditMenu: true,
        showOverflow: false,
      });

      getVideoData();
    }
    trackEvent('video_trim_mode_toggled', {
      status: isEditing ? 'closed' : 'open',
    });
  }, [
    isEditing,
    clearEditing,
    setEditingElementWithState,
    selectedElement,
    getVideoData,
  ]);

  const { isTranscodingEnabled } = useFFmpeg();

  const hasTrimMode = useMemo(() => {
    if (selectedElement?.type !== 'video' || !selectedElement?.resource) {
      return false;
    }

    const { id, isExternal } = selectedElement.resource;

    return (
      isTranscodingEnabled && !isExternal && !isCurrentResourceUploading(id)
    );
  }, [selectedElement, isTranscodingEnabled, isCurrentResourceUploading]);

  return {
    isTrimMode: Boolean(isEditing && isTrimMode),
    hasTrimMode,
    toggleTrimMode,
    videoData,
  };
}

export default useVideoTrimMode;
