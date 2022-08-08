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
import { formatMsToHMS } from '@googleforcreators/media';
import { useState, useCallback, useRef } from '@googleforcreators/react';
import { useEffect } from 'react';

/**
 * Internal dependencies
 */
import useFFmpeg from '../../app/media/utils/useFFmpeg';

function useTrim({ setDuration, onTrimmed, file, isRecording }) {
  const [trimData, setTrimData] = useState({ start: 0, end: null });
  const [isAdjustingTrim, setIsAdjustingTrim] = useState(false);
  const [isProcessingTrim, setIsProcessingTrim] = useState(false);
  const { trimVideo } = useFFmpeg();
  const hasCancelledTrim = useRef();
  const onTrim = useCallback(
    async (newTrimData) => {
      setIsAdjustingTrim(false);
      if (newTrimData) {
        hasCancelledTrim.current = false;
        setIsProcessingTrim(true);
        const start = formatMsToHMS(newTrimData.start);
        const end = formatMsToHMS(newTrimData.end);
        const result = await trimVideo(file, start, end);
        // If it was cancelled in the meantime, just abort
        if (hasCancelledTrim.current) {
          return;
        }
        setTrimData(newTrimData);
        setIsProcessingTrim(false);
        onTrimmed(result);
        setDuration(newTrimData.end - newTrimData.start);
      }
    },
    [file, onTrimmed, setDuration, trimVideo]
  );
  const startTrim = useCallback(() => setIsAdjustingTrim(true), []);
  const resetTrim = useCallback(() => {
    setIsAdjustingTrim(false);
    setTrimData({ start: 0, end: null });
  }, []);
  const cancelTrim = useCallback(() => {
    hasCancelledTrim.current = true;
    setIsProcessingTrim(false);
  }, []);
  // Whenever a new recording starts, reset any previously captured trim data
  useEffect(() => {
    if (isRecording) {
      resetTrim();
    }
  }, [isRecording, resetTrim]);

  return {
    trimData,
    isAdjustingTrim,
    isProcessingTrim,
    onTrim,
    startTrim,
    resetTrim,
    cancelTrim,
  };
}

export default useTrim;
