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
import { useMemo, useState } from 'react';
import { ApiContext } from '../app/api/apiProvider';
import { defaultStoriesState } from '../app/reducer/stories';
import { defaultTemplatesState } from '../app/reducer/templates';
import formattedUsersObject from '../storybookUtils/formattedUsersObject';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../edit-story/app/font/defaultFonts';

/* eslint-disable jasmine/no-unsafe-spy */
export default function ApiProviderFixture({ children }) {
  const [stories] = useState(defaultStoriesState);
  const [templates] = useState(defaultTemplatesState);
  const [users] = useState(formattedUsersObject);

  const storyApi = useMemo(
    () => ({
      duplicateStory: jasmine.createSpy('duplicateStory'),
      fetchStories: jasmine.createSpy('fetchStories'),
      createStoryFromTemplate: jasmine.createSpy('createStoryFromTemplate'),
      trashStory: jasmine.createSpy('trashStory'),
      updateStory: jasmine.createSpy('updateStory'),
    }),
    []
  );

  const templateApi = useMemo(
    () => ({
      bookmarkTemplateById: jasmine.createSpy('bookmarkTemplateById'),
      createTemplateFromStory: jasmine.createSpy('createTemplateFromStory'),
      fetchBookmarkedTemplates: jasmine.createSpy('fetchBookmarkedTemplates'),
      fetchExternalTemplates: jasmine.createSpy('fetchExternalTemplates'),
      fetchExternalTemplateById: jasmine.createSpy('fetchExternalTemplateById'),
      fetchMyTemplates: jasmine.createSpy('fetchMyTemplates'),
      fetchMyTemplateById: jasmine.createSpy('fetchMyTemplateById'),
      fetchRelatedTemplates: jasmine.createSpy('fetchRelatedTemplates'),
      fetchSavedTemplates: jasmine.createSpy('fetchSavedTemplates'),
    }),
    []
  );

  const usersApi = useMemo(
    () => ({
      fetchUsers: jasmine.createSpy('fetchUsers'),
    }),
    []
  );

  const fontApi = useMemo(
    () => ({
      getAllFonts: () => {
        return Promise.resolve(
          [TEXT_ELEMENT_DEFAULT_FONT].map((font) => ({
            name: font.family,
            value: font.family,
            ...font,
          }))
        );
      },
    }),
    []
  );

  const value = useMemo(
    () => ({
      state: {
        stories,
        templates,
        users,
      },
      actions: {
        storyApi,
        templateApi,
        fontApi,
        usersApi,
      },
    }),
    [stories, templates, users, usersApi, storyApi, templateApi, fontApi]
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}
/* eslint-enable jasmine/no-unsafe-spy */

ApiProviderFixture.propTypes = {
  children: PropTypes.node,
};
