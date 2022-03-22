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
import { act, renderHook } from '@testing-library/react-hooks';
import { ConfigProvider } from '@googleforcreators/dashboard';

/**
 * Internal dependencies
 */
import { ERRORS } from '../../constants';
import {
  useEditorSettings,
  EditorSettingsProvider,
} from '../../components/editorSettings';

jest.mock('../settings', () => ({
  fetchSettings: () => Promise.reject(new Error()),
  updateSettings: () => Promise.reject(new Error()),
}));

jest.mock('../user', () => ({
  getUser: () => {
    return Promise.resolve({
      id: 1,
      name: 'dev',
      url: 'https://www.story-link.com',
      description: '',
      link: 'https://www.story-link.com/author/dev/',
      slug: 'dev',
      avatar_urls: {},
      meta: {
        web_stories_tracking_optin: false,
        web_stories_media_optimization: true,
        web_stories_onboarding: {
          safeZone: true,
        },
      },
    });
  },
}));

describe('useSettingsApi', () => {
  it('should return an error when fetching settings API request fails', async () => {
    const { result } = renderHook(() => useEditorSettings(), {
      wrapper: (props) => (
        <ConfigProvider
          config={{
            api: { settings: 'wordpress' },
          }}
        >
          <EditorSettingsProvider {...props} />
        </ConfigProvider>
      ),
    });

    await act(async () => {
      await result.current.actions.settingsApi.fetchSettings();
    });

    expect(result.current.state.settings.error.message).toStrictEqual(
      ERRORS.LOAD_SETTINGS.MESSAGE
    );
  });

  it('should return an error when updating settings API request fails', async () => {
    const { result } = renderHook(() => useEditorSettings(), {
      wrapper: (props) => (
        <ConfigProvider
          config={{
            api: { settings: 'wordpress' },
          }}
        >
          <EditorSettingsProvider {...props} />
        </ConfigProvider>
      ),
    });

    await act(async () => {
      await result.current.actions.settingsApi.updateSettings('2738237892739');
    });

    expect(result.current.state.settings.error.message).toStrictEqual(
      ERRORS.UPDATE_EDITOR_SETTINGS.MESSAGE
    );
  });
});
