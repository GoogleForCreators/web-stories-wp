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
import { TEXT_SET_ACTIONS, textSetReducerFn } from '../getTextSetReducer';

const textSets = {
  caption: [{ id: 'caption1' }, { id: 'caption2' }, { id: 'caption3' }],
  quote: [{ id: 'quote1' }, { id: 'quote2' }],
};

const allTextSets = Object.values(textSets).flat();

describe('getTextSetReducer', () => {
  const initialState = {
    filteredTextSets: allTextSets,
    renderedTextSets: [],
  };

  describe('when RESET action is triggered', () => {
    it('should set renderedTextSets to empty array', () => {
      const { renderedTextSets } = textSetReducerFn(
        {
          filteredTextSets: [],
          renderedTextSets: [1, 2, 3, 4],
        },
        {
          type: TEXT_SET_ACTIONS.RESET,
        }
      );

      expect(renderedTextSets).toStrictEqual([]);
    });

    it('should set filteredTextSets based on action.payload', () => {
      const { filteredTextSets: captionTextSet } = textSetReducerFn(
        initialState,
        {
          type: TEXT_SET_ACTIONS.RESET,
          payload: 'caption',
        }
      );

      expect(captionTextSet).toStrictEqual('caption');

      const { filteredTextSets } = textSetReducerFn(initialState, {
        type: TEXT_SET_ACTIONS.RESET,
      });

      expect(filteredTextSets).toStrictEqual(allTextSets);
    });
  });

  describe('when RENDER_NEXT_TEXT_SET action is triggered', () => {
    it('should pass through filteredTextSets unchanged', () => {
      const { filteredTextSets } = textSetReducerFn(
        {
          filteredTextSets: [1, 2, 3, 4],
          renderedTextSets: [],
        },
        {
          type: TEXT_SET_ACTIONS.RENDER_NEXT_TEXT_SET,
        }
      );

      expect(filteredTextSets).toStrictEqual([1, 2, 3, 4]);
    });

    it('should append text set from filteredTextSets at correct index', () => {
      const {
        renderedTextSets: firstTextSet,
        filteredTextSets: filtered1,
      } = textSetReducerFn(
        {
          filteredTextSets: allTextSets,
          renderedTextSets: [],
        },
        {
          type: TEXT_SET_ACTIONS.RENDER_NEXT_TEXT_SET,
        }
      );

      expect(firstTextSet[firstTextSet.length - 1]).toStrictEqual(
        filtered1[firstTextSet.length - 1]
      );

      const {
        renderedTextSets: thirdTextSet,
        filteredTextSets: filtered2,
      } = textSetReducerFn(
        {
          filteredTextSets: allTextSets,
          renderedTextSets: [allTextSets[0], allTextSets[1], allTextSets[2]],
        },
        {
          type: TEXT_SET_ACTIONS.RENDER_NEXT_TEXT_SET,
        }
      );

      expect(thirdTextSet[thirdTextSet.length - 1]).toStrictEqual(
        filtered2[thirdTextSet.length - 1]
      );
    });
  });

  describe('when default is triggered', () => {
    it('should pass through filteredTextSets and renderedTextSets unchanged', () => {
      const { renderedTextSets, filteredTextSets } = textSetReducerFn(
        {
          filteredTextSets: [1, 2, 3, 4],
          renderedTextSets: [1, 2, 3],
        },
        {
          type: 'FAKE',
        }
      );

      expect(filteredTextSets).toStrictEqual([1, 2, 3, 4]);
      expect(renderedTextSets).toStrictEqual([1, 2, 3]);
    });
  });
});
