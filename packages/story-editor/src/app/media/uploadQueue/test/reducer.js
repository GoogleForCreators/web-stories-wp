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
import { revokeBlob, ResourceType } from '@googleforcreators/media';

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
import { ItemStatus } from '../types';

jest.mock('@googleforcreators/media', () => ({
  ...jest.requireActual('@googleforcreators/media'),
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
            state: ItemStatus.Pending,
            file: {},
            originalResourceId: 789,
            resource: expect.objectContaining({
              id: 456,
              foo: 'bar',
            }),
            additionalData: {},
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
            state: ItemStatus.Pending,
            file: {},
            originalResourceId: 789,
            resource: expect.objectContaining({
              id: 456,
              type: 'video',
              foo: 'bar',
              isMuted: false,
            }),
            additionalData: {
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
            state: ItemStatus.Pending,
            file: {},
            originalResourceId: 789,
            resource: expect.objectContaining({
              id: 456,
              type: 'video',
              foo: 'bar',
              baseColor: 'barbaz',
            }),
            additionalData: {
              baseColor: 'barbaz',
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
            state: ItemStatus.Pending,
            file: {},
            originalResourceId: 789,
            resource: expect.objectContaining({
              id: 456,
              type: 'video',
              foo: 'bar',
              blurHash: 'barbaz',
            }),
            additionalData: {
              blurHash: 'barbaz',
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
            state: ItemStatus.Pending,
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
            state: ItemStatus.Uploading,
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
            state: ItemStatus.Uploading,
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
            type: ResourceType.Video,
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
              type: ResourceType.Video,
              poster: 'new-url',
            },
            previousResourceId: 456,
            state: ItemStatus.Uploaded,
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
            state: ItemStatus.Uploading,
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
            state: ItemStatus.Pending,
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
              type: ResourceType.Video,
              poster: 'blob-url',
            },
            state: ItemStatus.Pending,
          },
        ],
      };

      finishUploading(initialState, {
        payload: {
          id: 123,
          resource: {
            id: 456,
            bar: 'baz',
            type: ResourceType.Video,
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
              type: ResourceType.Video,
              poster: 'blob-url',
            },
            state: ItemStatus.Pending,
          },
        ],
      };

      const result = finishUploading(initialState, {
        payload: {
          id: 123,
          resource: {
            id: 456,
            bar: 'baz',
            type: ResourceType.Video,
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
              type: ResourceType.Video,
              poster: 'blob-url',
            },
            state: ItemStatus.Uploaded,
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
            state: ItemStatus.Uploaded,
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
            state: ItemStatus.Finished,
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
            state: ItemStatus.Uploaded,
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
            state: ItemStatus.Uploading,
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
            state: ItemStatus.Cancelled,
            error: undefined,
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
            state: ItemStatus.Pending,
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
            state: ItemStatus.Muting,
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
            state: ItemStatus.Muting,
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
            state: ItemStatus.Muted,
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
            state: ItemStatus.Pending,
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
            state: ItemStatus.Trimming,
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
            state: ItemStatus.Trimming,
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
            state: ItemStatus.Trimmed,
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
            state: ItemStatus.Pending,
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
            state: ItemStatus.Preparing,
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
            state: ItemStatus.Preparing,
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
            state: ItemStatus.PendingTranscoding,
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
            state: ItemStatus.Pending,
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
            state: ItemStatus.Transcoding,
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
            state: ItemStatus.Transcoding,
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
            state: ItemStatus.Transcoded,
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
            state: ItemStatus.Uploading,
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
            state: ItemStatus.Uploading,
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
