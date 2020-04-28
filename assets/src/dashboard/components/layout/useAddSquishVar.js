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
import { useEffect } from 'react';

/**
 * Internal dependencies
 */
import { SQUISH_CSS_VAR } from './provider';
import useLayoutContext from './useLayoutContext';

const useAddSquishVar = (rootRef) => {
  const {
    actions: { addSquishListener, removeSquishListener },
  } = useLayoutContext();

  useEffect(() => {
    const rootEl = rootRef.current;
    if (!rootEl) {
      return () => {};
    }

    const handleSquish = (event) => {
      rootEl.style.setProperty(SQUISH_CSS_VAR, event.data.progress);
    };

    addSquishListener(handleSquish);
    return () => {
      removeSquishListener(handleSquish);
    };
  }, [addSquishListener, removeSquishListener, rootRef]);
};

export default useAddSquishVar;
