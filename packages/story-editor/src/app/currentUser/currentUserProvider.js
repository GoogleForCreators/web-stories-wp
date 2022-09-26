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
import { useCallback, useEffect, useState } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useAPI } from '../api';
import Context from './context';

function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const {
    actions: { getCurrentUser, updateCurrentUser: _updateCurrentUser },
  } = useAPI();

  useEffect(() => {
    let isMounted = true;
    if (getCurrentUser && !Object.keys(currentUser).length) {
      getCurrentUser().then((user) => {
        if (!isMounted) {
          return;
        }
        setCurrentUser(user);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [currentUser, getCurrentUser]);

  const updateCurrentUser = useCallback(
    (data) =>
      _updateCurrentUser ? _updateCurrentUser(data).then(setCurrentUser) : null,
    [_updateCurrentUser]
  );

  const toggleWebStoriesMediaOptimization = useCallback(() => {
    return updateCurrentUser({
      mediaOptimization: !currentUser.mediaOptimization,
    });
  }, [currentUser, updateCurrentUser]);

  const state = {
    state: {
      currentUser,
    },
    actions: {
      toggleWebStoriesMediaOptimization,
      updateCurrentUser,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

CurrentUserProvider.propTypes = {
  children: PropTypes.node,
};

export default CurrentUserProvider;
