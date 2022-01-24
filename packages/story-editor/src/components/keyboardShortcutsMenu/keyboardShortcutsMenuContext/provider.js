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
import { useState, useMemo, useCallback } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import Context from './context';

const KeyboardShortcutsMenuProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(
    (e) => {
      e.preventDefault();
      trackEvent('shortcuts_menu_toggled', {
        status: isOpen ? 'closed' : 'open',
      });

      setIsOpen((prevIsOpen) => !prevIsOpen);
    },
    [isOpen]
  );

  const close = useCallback(() => {
    if (isOpen) {
      trackEvent('shortcuts_menu_toggled', {
        status: 'closed',
      });
      setIsOpen(false);
    }
  }, [isOpen]);

  const contextValue = useMemo(
    () => ({
      state: {
        isOpen,
      },
      actions: {
        toggle,
        close,
      },
    }),
    [close, isOpen, toggle]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

KeyboardShortcutsMenuProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default KeyboardShortcutsMenuProvider;
