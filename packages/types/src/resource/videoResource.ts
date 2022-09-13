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
import type { Resource } from './resource';
import type { ResourceType } from './resourceType';

export interface TrimData {
  /** ID of the original video. */
  original: string;
  /** Time stamp of start time of new video. Example '00:01:02.345'. */
  start: string;
  /** Time stamp of end time of new video. Example '00:01:02.345'. */
  end: string;
}

export interface VideoResource extends Resource {
  type: ResourceType.VIDEO;
  /** The resource's poster. */
  poster?: string;
  /** The resource's poster ID. */
  posterId?: string;
  /** Length in seconds. */
  length: number;
  /** The formatted length, e.g. "01:17". */
  lengthFormatted: string;
  /** Whether the resource has already been optimized. */
  isOptimized?: boolean;
  /** Whether the resource is muted. */
  isMuted?: boolean;
  /** Information about trimmed video and its original. */
  trimData?: TrimData;
}
