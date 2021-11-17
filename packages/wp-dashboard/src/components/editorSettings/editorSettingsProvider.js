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

/**
 * Internal dependencies
 */
import useUsersApi from '../../api/hooks/useUserApi';
import useMediaApi from '../../api/hooks/useMediaApi';
import useSettingsApi from '../../api/hooks/useSettingsApi';
import usePagesApi from '../../api/hooks/usePagesApi';
import usePublisherLogosApi from '../../api/hooks/usePublisherLogosApi';
import Context from './context';

function EditorSettingsProvider({ children }) {
  const { currentUser, api: usersApi } = useUsersApi();
  const { media, api: mediaApi } = useMediaApi();
  const { settings, api: settingsApi } = useSettingsApi();
  const { api: pagesApi } = usePagesApi();
  const { publisherLogos, api: publisherLogosApi } = usePublisherLogosApi();

  const state = {
    state: {
      media,
      settings,
      currentUser,
      publisherLogos,
    },
    actions: {
      mediaApi,
      settingsApi,
      usersApi,
      pagesApi,
      publisherLogosApi,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

EditorSettingsProvider.propTypes = {
  children: PropTypes.node,
};

export default EditorSettingsProvider;
