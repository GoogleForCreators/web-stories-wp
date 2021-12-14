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

import PropTypes from 'prop-types';
import { useCallback, useState } from '@web-stories-wp/react';
/**
 * Internal dependencies
 */
import ContextMenuContext from './context';

export default function ContextMenuProvider({
  children,
  isIconMenu = false,
  onDismiss,
}) {
  const [focusedId, setFocusedId] = useState(-1);

  const handleBlur = useCallback((id) => setFocusedId(id), []);
  const handleFocus = useCallback(() => setFocusedId(-1), []);

  const value = {
    state: {
      focusedId,
      isIconMenu,
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
ContextMenuProvider.propTypes = {
  children: PropTypes.node,
  isIconMenu: PropTypes.bool,
  onDismiss: PropTypes.func,
};
