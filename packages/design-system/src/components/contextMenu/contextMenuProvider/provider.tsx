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

import { useCallback, useState } from '@googleforcreators/react';
import type { PropsWithChildren } from 'react';
/**
 * Internal dependencies
 */
import ContextMenuContext from './context';

interface ContextMenuProviderProps {
  isIconMenu?: boolean;
  isHorizontal?: boolean;
  onDismiss: (evt?: Event) => void;
}

export default function ContextMenuProvider({
  children,
  isIconMenu = false,
  isHorizontal = false,
  onDismiss,
}: PropsWithChildren<ContextMenuProviderProps>) {
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const handleFocus = useCallback((id: string) => setFocusedId(id), []);
  const handleBlur = useCallback(() => setFocusedId(null), []);

  const value = {
    state: {
      focusedId,
      isIconMenu,
      isHorizontal,
    },
    actions: {
      onDismiss,
      onMenuItemBlur: handleBlur,
      onMenuItemFocus: handleFocus,
      setFocusedId,
    },
  };

  return (
    <ContextMenuContext.Provider value={value}>
      {children}
    </ContextMenuContext.Provider>
  );
}
