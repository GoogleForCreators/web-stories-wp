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
import { createContext, useMemo } from 'react';

/**
 * Internal dependencies
 */
import { useConfig } from '../config';
import useFontApi from './useFontApi';
import useStoryApi from './useStoryApi';
import useTemplateApi from './useTemplateApi';
import dataAdapter from './wpAdapter';

export const ApiContext = createContext({ state: {}, actions: {} });

export default function ApiProvider({ children }) {
  const { api, editStoryURL, pluginDir } = useConfig();

  const { templates, api: templateApi } = useTemplateApi(dataAdapter, {
    pluginDir,
  });

  const { stories, api: storyApi } = useStoryApi(dataAdapter, {
    editStoryURL,
    wpApi: api.stories,
  });

  const { api: fontApi } = useFontApi(dataAdapter, { wpApi: api.fonts });

  const value = useMemo(
    () => ({
      state: {
        stories,
        templates,
      },
      actions: {
        storyApi,
        templateApi,
        fontApi,
      },
    }),
    [stories, templates, storyApi, templateApi, fontApi]
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

ApiProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
