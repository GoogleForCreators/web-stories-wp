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
import { useEffect } from 'react';

/**
 * Internal dependencies
 */
import { useGlobalKeyDownEffect } from '../../components/keyboard';
import usePreventWindowUnload from '../../utils/usePreventWindowUnload';
import useHistoryReducer from './useHistoryReducer';
import Context from './context';

function HistoryProvider({ children, size }) {
  const {
    replayState,
    appendToHistory,
    clearHistory,
    offset,
    historyLength,
    undo,
    redo,
    versionNumber,
  } = useHistoryReducer(size);

  const setPreventUnload = usePreventWindowUnload();

  useEffect(() => {
    setPreventUnload('history', versionNumber - 1 > 0);

    return () => setPreventUnload('history', false);
  }, [setPreventUnload, versionNumber]);

  const state = {
    state: {
      replayState,
      canUndo: offset < historyLength - 1,
      canRedo: offset > 0,
    },
    actions: {
      appendToHistory,
      clearHistory,
      undo,
      redo,
    },
  };

  useGlobalKeyDownEffect('undo', () => undo(), [undo]);
  useGlobalKeyDownEffect('redo', () => redo(), [redo]);

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
