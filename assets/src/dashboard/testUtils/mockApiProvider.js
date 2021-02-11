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

export default function MockApiProvider({ children, value }) {
  const [currentUser, setCurrentUser] = useState(getCurrentUserState());

  const usersApi = useMemo(
    () => ({
      fetchCurrentUser: noop,
      toggleWebStoriesTrackingOptIn: () =>
        setCurrentUser(toggleOptInTracking(currentUser)),
    }),
    [currentUser]
  );

  const mergedValue = useMemo(
    () => ({
      state: { currentUser },
      actions: { usersApi },
      ...value,
    }),
    [currentUser, usersApi, value]
  );
  return (
    <ApiContext.Provider value={mergedValue}>{children}</ApiContext.Provider>
  );
}

MockApiProvider.propTypes = {
  children: PropTypes.node,
  value: PropTypes.object,
};

function getCurrentUserState() {
  return {
    data: {
      id: 1,
      meta: {
        web_stories_tracking_optin: false,
        web_stories_onboarding: {},
        web_stories_media_optimization: true,
      },
    },
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
