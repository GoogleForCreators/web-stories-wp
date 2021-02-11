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
 * Internal dependencies
 */
import { ERRORS } from '../../textContent';
import templateReducer, {
  ACTION_TYPES,
  defaultTemplatesState as initialState,
} from '../templates';

describe('templateReducer', () => {
  const MOCK_ERROR_ID = Date.now();

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => MOCK_ERROR_ID);
  });

  it(`should update templates state when ${ACTION_TYPES.FETCH_TEMPLATES_SUCCESS} is called`, () => {
    const result = templateReducer(initialState, {
      type: ACTION_TYPES.FETCH_TEMPLATES_SUCCESS,
      payload: {
        page: 1,
        templates: [
          {
            id: 1,
            title: 'Beauty',
          },
          {
            id: 2,
            title: 'Cooking',
          },
          {
            id: 3,
            title: 'DIY',
          },
          {
            id: 4,
            title: 'Cooking',
          },
          {
            id: 5,
            title: 'Entertainment',
          },
        ],
        totalTemplates: 33,
        totalPages: 4,
      },
    });

    expect(result).toMatchObject({
      ...initialState,
      error: {},
      templatesOrderById: [1, 2, 3, 4, 5],
      templates: {
        1: {
          id: 1,
          title: 'Beauty',
        },
        2: {
          id: 2,
          title: 'Cooking',
        },
        3: {
          id: 3,
          title: 'DIY',
        },
        4: {
          id: 4,
          title: 'Cooking',
        },
        5: {
          id: 5,
          title: 'Entertainment',
        },
      },
      totalTemplates: 33,
      totalPages: 4,
      allPagesFetched: false,
    });
  });

  it(`should update templates state when ${ACTION_TYPES.FETCH_TEMPLATES_SUCCESS} is called and maintain order from existing state`, () => {
    const result = templateReducer(
      { ...initialState, templatesOrderById: [1, 2, 3, 8, 9] },
      {
        type: ACTION_TYPES.FETCH_TEMPLATES_SUCCESS,
        payload: {
          page: 2,
          templates: [
            {
              id: 7,
              title: 'Beauty',
            },
            {
              id: 2,
              title: 'Cooking',
            },
            {
              id: 3,
              title: 'DIY',
            },
            {
              id: 4,
              title: 'Cooking',
            },
            {
              id: 5,
              title: 'Entertainment',
            },
          ],
          totalTemplates: 8,
          totalPages: 2,
        },
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      templatesOrderById: [1, 2, 3, 8, 9, 7, 4, 5],
      templates: {
        7: {
          id: 7,
          title: 'Beauty',
        },
        2: {
          id: 2,
          title: 'Cooking',
        },
        3: {
          id: 3,
          title: 'DIY',
        },
        4: {
          id: 4,
          title: 'Cooking',
        },
        5: {
          id: 5,
          title: 'Entertainment',
        },
      },
      totalTemplates: 8,
      totalPages: 2,
      allPagesFetched: true,
    });
  });

  it(`should update isLoading when ${ACTION_TYPES.LOADING_TEMPLATES} is called`, () => {
    const result = templateReducer(
      { ...initialState },
      {
        type: ACTION_TYPES.LOADING_TEMPLATES,
        payload: true,
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      isLoading: true,
    });
  });

  it(`should update isLoading when ${ACTION_TYPES.CREATING_TEMPLATE_FROM_STORY} is called`, () => {
    const result = templateReducer(
      { ...initialState },
      {
        type: ACTION_TYPES.CREATING_TEMPLATE_FROM_STORY,
        payload: true,
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      isLoading: true,
    });
  });

  it(`should update error when ${ACTION_TYPES.FETCH_TEMPLATES_FAILURE} is called`, () => {
    const result = templateReducer(
      { ...initialState },
      {
        type: ACTION_TYPES.FETCH_TEMPLATES_FAILURE,
        payload: {
          message: ERRORS.LOAD_TEMPLATES.MESSAGE,
          code: 'test-error-code',
        },
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      error: {
        message: ERRORS.LOAD_TEMPLATES.MESSAGE,
        id: MOCK_ERROR_ID,
        code: 'test-error-code',
      },
    });
  });

  it(`should update error when ${ACTION_TYPES.CREATE_TEMPLATE_FROM_STORY_FAILURE} is called`, () => {
    const result = templateReducer(
      { ...initialState },
      {
        type: ACTION_TYPES.CREATE_TEMPLATE_FROM_STORY_FAILURE,
        payload: {
          message: ERRORS.CREATE_TEMPLATE_FROM_STORY.MESSAGE,
          code: 'test-error-code',
        },
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      error: {
        message: ERRORS.CREATE_TEMPLATE_FROM_STORY.MESSAGE,
        id: MOCK_ERROR_ID,
        code: 'test-error-code',
      },
    });
  });

  it(`should return the existing state when ${ACTION_TYPES.CREATE_TEMPLATE_FROM_STORY_SUCCESS} is called`, () => {
    const result = templateReducer(
      { ...initialState },
      { type: ACTION_TYPES.CREATE_TEMPLATE_FROM_STORY }
    );

    expect(result).toMatchObject(initialState);
  });

  it(`should update savedTemplates state when ${ACTION_TYPES.FETCH_MY_TEMPLATES_SUCCESS} is called`, () => {
    const result = templateReducer(initialState, {
      type: ACTION_TYPES.FETCH_MY_TEMPLATES_SUCCESS,
      payload: {
        page: 1,
        savedTemplates: [
          {
            id: 1,
            title: 'Beauty',
          },
          {
            id: 2,
            title: 'Cooking',
          },
          {
            id: 3,
            title: 'DIY',
          },
          {
            id: 4,
            title: 'Cooking',
          },
          {
            id: 5,
            title: 'Entertainment',
          },
        ],
        totalTemplates: 12,
        totalPages: 2,
      },
    });

    expect(result).toMatchObject({
      ...initialState,
      error: {},
      savedTemplatesOrderById: [1, 2, 3, 4, 5],
      savedTemplates: {
        1: {
          id: 1,
          title: 'Beauty',
        },
        2: {
          id: 2,
          title: 'Cooking',
        },
        3: {
          id: 3,
          title: 'DIY',
        },
        4: {
          id: 4,
          title: 'Cooking',
        },
        5: {
          id: 5,
          title: 'Entertainment',
        },
      },
      totalTemplates: 12,
      totalPages: 2,
      allPagesFetched: false,
    });
  });
});
