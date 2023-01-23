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
import type {
  ImageResource,
  VideoResource,
  GifResource,
  AudioResource,
  ResourceId,
  TrimData,
} from '@googleforcreators/media';
import type { ElementId } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import type { CropParams } from '../types';

export enum ItemStatus {
  Pending = 'PENDING',
  Preparing = 'PREPARING',
  PendingTranscoding = 'PENDING_TRANSCODING',
  Cancelled = 'CANCELLED',
  Uploaded = 'UPLOADED',
  Uploading = 'UPLOADING',
  Transcoded = 'TRANSCODED',
  Transcoding = 'TRANSCODING',
  Muting = 'MUTING',
  Muted = 'MUTED',
  Cropping = 'CROPPING',
  Cropped = 'CROPPED',
  Trimming = 'TRIMMING',
  Trimmed = 'TRIMMED',
  Finished = 'FINISHED',
}

export type AdditionalData = {
  isMuted?: boolean;
  cropParams?: CropParams;
  mediaSource?: string;
  baseColor?: string;
  blurHash?: string;
  batchId?: string;
};

export type QueueItem = {
  id: string;
  resource: ImageResource | VideoResource | GifResource | AudioResource;
  originalResourceId?: ResourceId | null;
  previousResourceId?: ResourceId;
  state: ItemStatus;

  file: File;
  posterFile?: File | null;
  onUploadStart?: () => void;
  onUploadProgress?: () => void;
  onUploadError?: () => void;
  onUploadSuccess?: () => void;

  additionalData: AdditionalData;
  elementId: ElementId;
  trimData?: TrimData;
  muteVideo?: boolean;
  cropVideo?: boolean;
  isAnimatedGif?: boolean;
  error?: Error;
};

export type QueueState = {
  queue: QueueItem[];
};
