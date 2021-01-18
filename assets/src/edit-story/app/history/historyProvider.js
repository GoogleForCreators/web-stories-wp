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
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState, useRef } from 'react';

/**
 * Internal dependencies
 */
import { useGlobalKeyDownEffect } from '../../../design-system';
import usePreventWindowUnload from '../../utils/usePreventWindowUnload';
import useHistoryReducer from './useHistoryReducer';
import Context from './context';

function HistoryProvider({ children, size }) {
  const {
    requestedState,
    stateToHistory,
    clearHistory,
    offset,
    historyLength,
    undo,
    redo,
    versionNumber,
  } = useHistoryReducer(size);

  const [hasNewChanges, setHasNewChanges] = useState(false);
  const setPreventUnload = usePreventWindowUnload();
  // The version number for the initially loaded (saved) state is 1.
  const savedVersionNumber = useRef(1);

  useEffect(() => {
    setPreventUnload('history', hasNewChanges);
    return () => setPreventUnload('history', false);
  }, [setPreventUnload, hasNewChanges]);

  useEffect(() => {
    setHasNewChanges(versionNumber !== savedVersionNumber.current);
  }, [versionNumber]);

  const resetNewChanges = useCallback(() => {
    // When new changes are saved, let's track which version was saved.
    savedVersionNumber.current = versionNumber;
    setHasNewChanges(false);
  }, [versionNumber]);

  const state = {
    state: {
      hasNewChanges,
      requestedState,
      canUndo: offset < historyLength - 1,
      canRedo: offset > 0,
      versionNumber,
    },
    actions: {
      stateToHistory,
      clearHistory,
      resetNewChanges,
      undo,
      redo,
    },
  };

  useGlobalKeyDownEffect({ key: 'undo', dialog: true }, () => undo(), [undo]);
  useGlobalKeyDownEffect({ key: 'redo', dialog: true }, () => redo(), [redo]);

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

HistoryProvider.propTypes = {
  children: PropTypes.node,
  size: PropTypes.number,
};

HistoryProvider.defaultProps = {
  size: 50,
};

export default HistoryProvider;
