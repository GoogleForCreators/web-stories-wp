/*
 * Copyright 2021 Google LLC
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
import { useCallback, useEffect, useState } from 'react';

function useInputEventHandlers({ inputRef, forwardedRef, onFocus, onBlur }) {
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    // focus input when isFocused state is set
    if (isFocused && forwardedRef?.current) {
      forwardedRef.current?.select();
    } else if (isFocused) {
      inputRef.current?.select();
    }
  }, [isFocused, forwardedRef, inputRef]);

  const handleFocus = useCallback(
    (ev) => {
      onFocus?.(ev);
      setIsFocused(true);
    },
    [onFocus, setIsFocused]
  );
  const handleBlur = useCallback(
    (ev) => {
      onBlur?.(ev);
      setIsFocused(false);
    },
    [onBlur, setIsFocused]
  );
  return {
    handleBlur,
    handleFocus,
    isFocused,
  };
}

export default useInputEventHandlers;
