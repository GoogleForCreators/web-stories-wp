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
import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */

import { ApiContext } from '../app/api/apiProvider';

const noop = () => {};

export default function MockApiProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(getCurrentUserState());

  const usersApi = useMemo(
    () => ({
      fetchUsers: noop,
      fetchCurrentUser: noop,
      toggleWebStoriesTrackingOptIn: () =>
        setCurrentUser(toggleOptInTracking(currentUser)),
    }),
    [currentUser]
  );

  const value = useMemo(
    () => ({
      state: { currentUser },
      actions: { usersApi },
    }),
    [currentUser, usersApi]
  );
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

MockApiProvider.propTypes = {
  children: PropTypes.node,
};

function getCurrentUserState() {
  return {
    data: { id: 1, meta: { web_stories_tracking_optin: false } },
    isUpdating: false,
  };
}

function toggleOptInTracking(currentUser) {
  return {
    ...currentUser,
    data: {
      ...currentUser.data,
      meta: {
        web_stories_tracking_optin: !currentUser.data.meta
          .web_stories_tracking_optin,
      },
    },
  };
}
