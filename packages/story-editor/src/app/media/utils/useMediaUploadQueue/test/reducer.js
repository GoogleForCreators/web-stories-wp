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
import { revokeBlob } from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import {
  addItem,
  cancelUploading,
  finishItem,
  finishMuting,
  finishTranscoding,
  finishTrimming,
  finishUploading,
  prepareItem,
  prepareForTranscoding,
  replacePlaceholderResource,
  startMuting,
  startTranscoding,
  startTrimming,
  startUploading,
} from '../reducer';
import { ITEM_STATUS } from '../constants';

jest.mock('@googleforcreators/media', () => ({
  revokeBlob: jest.fn(),
}));

describe('useMediaUploadQueue', () => {
  afterEach(() => {
    revokeBlob.mockReset();
  });

  describe('addItem', () => {
    it('should add item to queue with ID and pending state', () => {
      const initialState = { queue: [] };

      const result = addItem(initialState, {
        payload: {
          file: {},
          resource: {
            id: 456,
            foo: 'bar',
          },
          originalResourceId: 789,
        },
      });

      expect(result).toStrictEqual({
        queue: [
          expect.objectContaining({
            id: expect.any(String),
            state: ITEM_STATUS.PENDING,
            file: {},
            originalResourceId: 789,
            resource: expect.objectContaining({
              id: 456,
              foo: 'bar',
            }),
            additionalData: {
              meta: {},
            },
          }),
        ],
      });
    });

    it('sets additionalData.isMuted if possible', () => {
      const initialState = { queue: [] };

      const result = addItem(initialState, {
        payload: {
          file: {},
          resource: {
            id: 456,
            type: 'video',
            foo: 'bar',
            isMuted: false,
          },
          originalResourceId: 789,
        },
      });

      expect(result).toStrictEqual({
        queue: [
          expect.objectContaining({
            id: expect.any(String),
            state: ITEM_STATUS.PENDING,
            file: {},
            originalResourceId: 789,
            resource: expect.objectContaining({
              id: 456,
              type: 'video',
              foo: 'bar',
              isMuted: false,
            }),
            additionalData: {
              meta: {},
              isMuted: false,
            },
          }),
        ],
      });
    });

    it('sets additionalData.muted.baseColor if possible', () => {
      const initialState = { queue: [] };

      const result = addItem(initialState, {
        payload: {
          file: {},
          resource: {
            id: 456,
            type: 'video',
            foo: 'bar',
            baseColor: 'barbaz',
          },
          originalResourceId: 789,
        },
      });

      expect(result).toStrictEqual({
        queue: [
          expect.objectContaining({
            id: expect.any(String),
            state: ITEM_STATUS.PENDING,
            file: {},
            originalResourceId: 789,
            resource: expect.objectContaining({
              id: 456,
              type: 'video',
              foo: 'bar',
              baseColor: 'barbaz',
            }),
            additionalData: {
              meta: {
                baseColor: 'barbaz',
              },
            },
          }),
        ],
      });
    });

    it('sets additionalData.muted.blurHash if possible', () => {
      const initialState = { queue: [] };

      const result = addItem(initialState, {
        payload: {
          file: {},
          resource: {
            id: 456,
            type: 'video',
            foo: 'bar',
            blurHash: 'barbaz',
          },
          originalResourceId: 789,
        },
      });

      expect(result).toStrictEqual({
        queue: [
          expect.objectContaining({
            id: expect.any(String),
            state: ITEM_STATUS.PENDING,
            file: {},
            originalResourceId: 789,
            resource: expect.objectContaining({
              id: 456,
              type: 'video',
              foo: 'bar',
              blurHash: 'barbaz',
            }),
            additionalData: {
              meta: {
                blurHash: 'barbaz',
              },
            },
          }),
        ],
      });
    });
  });

  describe('startUploading', () => {
    it('changes state of uploaded item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {},
            state: ITEM_STATUS.PENDING,
          },
        ],
      };

      const result = startUploading(initialState, {
        payload: {
          id: 123,
          resource: {
            foo: 'bar',
          },
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {},
            resource: {},
            state: ITEM_STATUS.UPLOADING,
          },
        ],
      });
    });
  });

  describe('finishUploading', () => {
    it('changes state of uploaded item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              src: 'foo',
              poster: 'blob-url',
            },
            originalResourceId: 111,
            state: ITEM_STATUS.UPLOADING,
            posterFile: {},
          },
        ],
      };

      const result = finishUploading(initialState, {
        payload: {
          id: 123,
          resource: {
            id: 789,
            src: 'bar',
            poster: 'new-url',
          },
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {},
            posterFile: null,
            originalResourceId: null,
            resource: {
              id: 789,
              src: 'bar',
              poster: 'new-url',
            },
            previousResourceId: 456,
            state: ITEM_STATUS.UPLOADED,
          },
        ],
      });
    });

    it('leaves state unchanged if item is not in queue', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {},
            state: ITEM_STATUS.UPLOADING,
          },
        ],
      };

      const result = finishUploading(initialState, {
        payload: {
          id: 456,
        },
      });

      expect(result).toStrictEqual(initialState);
    });

    it('revokes previous src blob URL', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
              src: 'blob-url',
            },
            state: ITEM_STATUS.PENDING,
          },
        ],
      };

      finishUploading(initialState, {
        payload: {
          id: 123,
          resource: {
            id: 456,
            bar: 'baz',
            src: 'new-url',
          },
        },
      });
      expect(revokeBlob).toHaveBeenCalledWith('blob-url');
    });

    it('revokes previous poster blob URL', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
              poster: 'blob-url',
            },
            state: ITEM_STATUS.PENDING,
          },
        ],
      };

      finishUploading(initialState, {
        payload: {
          id: 123,
          resource: {
            id: 456,
            bar: 'baz',
            poster: 'new-url',
          },
        },
      });
      expect(revokeBlob).toHaveBeenCalledWith('blob-url');
    });

    it('keeps existing poster if no new one was provided', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
              poster: 'blob-url',
            },
            state: ITEM_STATUS.PENDING,
          },
        ],
      };

      const result = finishUploading(initialState, {
        payload: {
          id: 123,
          resource: {
            id: 456,
            bar: 'baz',
          },
        },
      });
      expect(revokeBlob).not.toHaveBeenCalled();
      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              bar: 'baz',
              poster: 'blob-url',
            },
            state: ITEM_STATUS.UPLOADED,
            previousResourceId: 456,
            posterFile: null,
            originalResourceId: null,
          },
        ],
      });
    });
  });

  describe('finishItem', () => {
    it('changes state of finished item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              src: 'foo',
            },
            originalResourceId: 111,
            state: ITEM_STATUS.UPLOADED,
            posterFile: {},
          },
        ],
      };

      const result = finishItem(initialState, {
        payload: {
          id: 123,
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {},
            posterFile: {},
            resource: {
              id: 456,
              src: 'foo',
            },
            originalResourceId: 111,
            state: ITEM_STATUS.FINISHED,
          },
        ],
      });
    });

    it('leaves state unchanged if item is not in queue', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {},
            state: ITEM_STATUS.UPLOADED,
          },
        ],
      };

      const result = finishItem(initialState, {
        payload: {
          id: 456,
        },
      });

      expect(result).toStrictEqual(initialState);
    });
  });

  describe('cancelUploading', () => {
    it('changes state of uploaded item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {},
            state: ITEM_STATUS.UPLOADING,
          },
        ],
      };

      const result = cancelUploading(initialState, {
        payload: {
          id: 123,
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {},
            resource: {},
            state: ITEM_STATUS.CANCELLED,
          },
        ],
      });
    });
  });

  describe('startMuting', () => {
    it('changes state of uploaded item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: ITEM_STATUS.PENDING,
          },
        ],
      };

      const result = startMuting(initialState, {
        payload: {
          id: 123,
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: ITEM_STATUS.MUTING,
          },
        ],
      });
    });
  });

  describe('finishMuting', () => {
    it('changes state of uploaded item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {
              bar: 'baz',
            },
            resource: {
              id: 456,
              foo: 'bar',
            },
            additionalData: {},
            state: ITEM_STATUS.MUTING,
          },
        ],
      };

      const result = finishMuting(initialState, {
        payload: {
          id: 123,
          file: {
            bar: 'foobar',
          },
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {
              bar: 'foobar',
            },
            resource: {
              foo: 'bar',
              id: 456,
              isMuted: true,
            },
            additionalData: {},
            state: ITEM_STATUS.MUTED,
          },
        ],
      });
    });
  });

  describe('startTrimming', () => {
    it('changes state of uploaded item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: ITEM_STATUS.PENDING,
          },
        ],
      };

      const result = startTrimming(initialState, {
        payload: {
          id: 123,
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: ITEM_STATUS.TRIMMING,
          },
        ],
      });
    });
  });

  describe('finishTrimming', () => {
    it('changes state of uploaded item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {
              bar: 'baz',
            },
            resource: {
              id: 456,
              foo: 'bar',
            },
            additionalData: {},
            state: ITEM_STATUS.TRIMMING,
          },
        ],
      };

      const result = finishTrimming(initialState, {
        payload: {
          id: 123,
          file: {
            bar: 'foobar',
          },
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {
              bar: 'foobar',
            },
            resource: {
              id: 456,
              foo: 'bar',
            },
            additionalData: {},
            state: ITEM_STATUS.TRIMMED,
          },
        ],
      });
    });
  });

  describe('prepareItem', () => {
    it('changes state of pending item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: ITEM_STATUS.PENDING,
          },
        ],
      };

      const result = prepareItem(initialState, {
        payload: {
          id: 123,
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: ITEM_STATUS.PREPARING,
          },
        ],
      });
    });
  });

  describe('prepareForTranscoding', () => {
    it('changes state of pending item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: ITEM_STATUS.PREPARING,
          },
        ],
      };

      const result = prepareForTranscoding(initialState, {
        payload: {
          id: 123,
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: ITEM_STATUS.PENDING_TRANSCODING,
          },
        ],
      });
    });
  });

  describe('startTranscoding', () => {
    it('changes state of uploaded item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: ITEM_STATUS.PENDING,
          },
        ],
      };

      const result = startTranscoding(initialState, {
        payload: {
          id: 123,
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: ITEM_STATUS.TRANSCODING,
          },
        ],
      });
    });
  });

  describe('finishTranscoding', () => {
    it('changes state of uploaded item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {
              bar: 'baz',
            },
            resource: {
              id: 456,
              foo: 'bar',
            },
            additionalData: {},
            state: ITEM_STATUS.TRANSCODING,
          },
        ],
      };

      const result = finishTranscoding(initialState, {
        payload: {
          id: 123,
          file: {
            bar: 'foobar',
          },
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {
              bar: 'foobar',
            },
            resource: {
              id: 456,
              foo: 'bar',
              isOptimized: true,
            },
            additionalData: {},
            state: ITEM_STATUS.TRANSCODED,
          },
        ],
      });
    });
  });

  describe('replacePlaceholderResource', () => {
    it('leaves state unchanged if item is not in queue', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: ITEM_STATUS.UPLOADING,
          },
        ],
      };

      const result = replacePlaceholderResource(initialState, {
        payload: {
          id: 456,
          resource: {
            id: 456,
            foo: 'baz',
          },
        },
      });

      expect(result).toStrictEqual(initialState);
    });

    it('leaves state unchanged if resource is not a placeholder', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
              isPlaceholder: false,
            },
            state: ITEM_STATUS.UPLOADING,
          },
        ],
      };

      const result = replacePlaceholderResource(initialState, {
        payload: {
          id: 456,
          resource: {
            id: 456,
            foo: 'baz',
          },
        },
      });

      expect(result).toStrictEqual(initialState);
    });
  });

  describe('removeItem', () => {});
});
