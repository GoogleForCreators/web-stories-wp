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
 * Internal dependencies
 */
import { getStoryAmpValidationErrors } from '../storyAmpValidationErrors';

describe('getStoryAmpValidationErrors', () => {
  const fetchSpy = jest.spyOn(global, 'fetch');
  const windowSpy = jest.spyOn(global, 'window', 'get');

  beforeAll(() => {
    fetchSpy.mockResolvedValue({
      text: () => ({
        status: 200,
      }),
    });
  });

  afterAll(() => {
    fetchSpy.mockClear();
    windowSpy.mockRestore();
  });

  it('should return false if no link', async () => {
    await expect(
      getStoryAmpValidationErrors({ link: null, status: 'draft' })
    ).resolves.toBe(false);
  });

  it('should return false if there are no violations', async () => {
    windowSpy.mockImplementation(() => ({
      amp: {
        validator: {
          validateString: () => ({
            status: 'PASS',
            errors: [],
          }),
        },
      },
    }));

    await expect(
      getStoryAmpValidationErrors({
        link: 'http://test/web-stories/123',
        status: 'publish',
      })
    ).resolves.toBe(false);
  });

  it('should return true if there are AMP violations', async () => {
    windowSpy.mockImplementation(() => ({
      amp: {
        validator: {
          init: () => {},
          validateString: () => ({
            status: 'FAIL',
            errors: [
              { code: 'INVALID_URL_PROTOCOL', severity: 'ERROR' },
              { code: 'TAG_REQUIRED_BY_MISSING', severity: 'ERROR' },
              {
                code: 'MISSING_URL',
                severity: 'ERROR',
                params: ['poster-portrait-src'],
              },
            ],
          }),
        },
      },
    }));

    await expect(
      getStoryAmpValidationErrors({
        link: 'http://test/web-stories/123',
        status: 'publish',
      })
    ).resolves.toBe(true);
  });

  it('should return false if there are no ERROR severity errors', async () => {
    windowSpy.mockImplementation(() => ({
      amp: {
        validator: {
          validateString: () => ({
            status: 'FAIL',
            errors: [
              { severity: 'WARNING' },
              { code: 'LOREM IPSUM', severity: 'WARNING' },
            ],
          }),
        },
      },
    }));

    await expect(
      getStoryAmpValidationErrors({
        link: 'http://test/web-stories/123',
        status: 'publish',
      })
    ).resolves.toBe(false);
  });

  it('should return false if MISSING URL is the only AMP Violation', async () => {
    windowSpy.mockImplementation(() => ({
      amp: {
        validator: {
          validateString: () => ({
            status: 'FAIL',
            errors: [
              {
                code: 'MISSING_URL',
                severity: 'ERROR',
                params: ['poster-portrait-src'],
              },
            ],
          }),
        },
      },
    }));

    await expect(
      getStoryAmpValidationErrors({
        link: 'http://test/web-stories/123',
        status: 'publish',
      })
    ).resolves.toBe(false);
  });
});
