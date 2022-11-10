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
import { useCallback, useRef } from '@googleforcreators/react';
import type { ReactNode } from 'react';
import { getAllTemplates, Template } from '@googleforcreators/templates';

/**
 * Internal dependencies
 */
import { useConfig } from '../config';
import Context from './context';

interface APIProviderProps {
  children: ReactNode;
}
function APIProvider({ children }: APIProviderProps) {
  const { apiCallbacks: actions, cdnURL } = useConfig();
  const pageTemplates = useRef<{ base: Template[] }>({
    base: [],
  });

  actions.getPageTemplates = useCallback(async () => {
    // check if pageTemplates have been loaded yet
    if (pageTemplates.current.base.length === 0) {
      pageTemplates.current.base = await getAllTemplates({ cdnURL });
    }
    return pageTemplates.current.base;
  }, [cdnURL]);

  return <Context.Provider value={{ actions }}>{children}</Context.Provider>;
}

export default APIProvider;
