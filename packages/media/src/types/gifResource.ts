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
import type { SequenceResource } from './sequenceResource';
import type { ResourceType } from './resourceType';

export interface Output {
  /** The MIME type of the resource. E.g. "image/png". */
  mimeType: string;
  /** The source URL of the resource. */
  src: string;
}

export interface GifResource extends SequenceResource {
  type: ResourceType.Gif;
  output: Output;
}
