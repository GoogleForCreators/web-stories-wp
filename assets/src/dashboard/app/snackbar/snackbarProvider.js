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
import { useMemo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { createContext } from '../../utils';

export const SnackbarContext = createContext(null);

const SnackbarProvider = ({ children }) => {
  const [messages, setMessages] = useState({});

  const activeSnack = useMemo(() => {
    const snacksInQueue = Object.values(messages).map((message) => message);
    return snacksInQueue.length > 0 ? snacksInQueue[0] : [];
  }, [messages]);

  const removeSnackbarMessage = useCallback((id) => {
    if (id) {
      setMessages((existingMessages) => {
        const updatedMessages = Object.keys(existingMessages).reduce(
          (memoizedMessages, existingMessageId) => {
            if (parseInt(existingMessageId) !== parseInt(id)) {
              memoizedMessages[existingMessageId] = {
                ...existingMessages[existingMessageId],
              };
            }
            return memoizedMessages;
          },
          {}
        );
        return updatedMessages;
      });
    }
  }, []);

  const addSnackbarMessage = useCallback(
    ({ message, severity, id }) =>
      setMessages((existingMessages) => ({
        ...existingMessages,
        [id]: { message, severity, id },
      })),
    []
  );

  const value = useMemo(
    () => ({
      state: { activeSnackbarMessage: activeSnack },
      actions: { addSnackbarMessage, removeSnackbarMessage },
    }),
    [activeSnack, addSnackbarMessage, removeSnackbarMessage]
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
    </SnackbarContext.Provider>
  );
};

SnackbarProvider.propTypes = {
  children: PropTypes.node,
};

export default SnackbarProvider;
