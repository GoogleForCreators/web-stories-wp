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
import { useState, useCallback } from '@googleforcreators/react';

function useTrim(setDuration) {
  const [trimData, setTrimData] = useState({ start: 0, end: null });
  const [isTrimming, setIsTrimming] = useState(false);
  const onTrim = useCallback(
    (newTrimData) => {
      if (newTrimData) {
        setTrimData(newTrimData);
        const millis = newTrimData.end - newTrimData.start;
        const seconds = Math.ceil(millis / 1000);
        setDuration(seconds);
      }
      setIsTrimming(false);
    },
    [setDuration]
  );
  const startTrim = useCallback(() => setIsTrimming(true), []);
  const resetTrim = useCallback(() => {
    setIsTrimming(false);
    setTrimData({ start: 0, end: null });
  }, []);

  return { trimData, isTrimming, onTrim, startTrim, resetTrim };
}

export default useTrim;
