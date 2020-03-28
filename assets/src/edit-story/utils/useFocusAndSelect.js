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
import { useEffect, useState, useCallback } from 'react';

function useFocusAndSelect(ref) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocusIn = useCallback(() => setIsFocused(true), []);
  const handleFocusOut = useCallback(() => setIsFocused(false), []);

  useEffect(() => {
    if (isFocused && ref.current) {
      ref.current.select();
    }
  }, [isFocused, ref]);

  return {
    isFocused,
    handleFocusIn,
    handleFocusOut,
  };
}

export default useFocusAndSelect;
