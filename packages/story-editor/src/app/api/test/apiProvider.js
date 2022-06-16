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
import { act, renderHook } from '@testing-library/react';
import { getAllTemplates } from '@googleforcreators/templates';

/**
 * Internal dependencies
 */
import useAPI from '../useAPI';
import ApiProvider from '../apiProvider';
import { ConfigProvider } from '../../config';

jest.mock('@googleforcreators/templates');

const renderApiProvider = ({ configValue }) => {
  return renderHook(() => useAPI(), {
    wrapper: (props) => (
      <ConfigProvider config={configValue}>
        <ApiProvider {...props} />
      </ConfigProvider>
    ),
  });
};

describe('APIProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getPageTemplates gets pageTemplates with cdnURL', async () => {
    const pageTemplates = [{ id: 'templateid' }];
    getAllTemplates.mockReturnValue(pageTemplates);

    const cdnURL = 'https://test.url';
    const { result } = renderApiProvider({
      configValue: {
        api: {},
        apiCallbacks: {},
        cdnURL,
      },
    });

    let pageTemplatesResult;
    await act(async () => {
      pageTemplatesResult = await result.current.actions.getPageTemplates();
    });

    expect(pageTemplatesResult).toStrictEqual(pageTemplates);
  });

  it('getPageTemplates should memoize the templates if they have already been fetched', async () => {
    const pageTemplates = [{ id: 'templateid' }];
    getAllTemplates.mockReturnValue(pageTemplates);

    const cdnURL = 'https://test.url';
    const { result } = renderApiProvider({
      configValue: {
        api: {},
        apiCallbacks: {},
        cdnURL,
      },
    });

    let pageTemplatesResult;
    await act(async () => {
      pageTemplatesResult = await result.current.actions.getPageTemplates();
    });

    expect(getAllTemplates).toHaveBeenCalledTimes(1);
    expect(pageTemplatesResult).toStrictEqual(pageTemplates);

    await act(async () => {
      pageTemplatesResult = await result.current.actions.getPageTemplates();
    });

    expect(getAllTemplates).toHaveBeenCalledTimes(1);
    expect(pageTemplatesResult).toStrictEqual(pageTemplates);
  });
});
