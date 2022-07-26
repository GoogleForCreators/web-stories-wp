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
import { useState, useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import useFFmpeg from '../../app/media/utils/useFFmpeg';

function useTrim({ setDuration, onTrimmed, file }) {
  const [trimData, setTrimData] = useState({ start: 0, end: null });
  const [isTrimming, setIsTrimming] = useState(false);
  const [isProcessingTrim, setIsProcessingTrim] = useState(false);
  const { trimVideo } = useFFmpeg();
  const onTrim = useCallback(
    async (newTrimData) => {
      setIsTrimming(false);
      if (newTrimData) {
        setTrimData(newTrimData);
        setIsProcessingTrim(true);
        const start = formatMsToHMS(newTrimData.start);
        const end = formatMsToHMS(newTrimData.end);
        const result = await trimVideo(file, start, end);
        onTrimmed(result);
        setDuration(newTrimData.end - newTrimData.start);
        setIsProcessingTrim(false);
      }
    },
    [file, onTrimmed, setDuration, trimVideo]
  );
  const startTrim = useCallback(() => setIsTrimming(true), []);
  const resetTrim = useCallback(() => setIsTrimming(false), []);

  return {
    trimData,
    isTrimming,
    isProcessingTrim,
    onTrim,
    startTrim,
    resetTrim,
  };
}

export default useTrim;
