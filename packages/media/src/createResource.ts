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
import {
  ResourceInput,
  GifResource,
  Resource,
  ResourceType,
  VideoResource,
  AudioResource,
  ImageResource,
} from './types';
import getTypeFromMime from './getTypeFromMime';

/**
 * Creates a resource object.
 *
 * @param data Resource data.
 * @return Resource object.
 */
function createResource({
  type,
  mimeType,
  poster,
  posterId,
  length,
  lengthFormatted,
  sizes = {},
  output,
  width = 0,
  height = 0,
  isPlaceholder = false,
  isOptimized = false,
  isMuted = false,
  isExternal = false,
  trimData,
  needsProxy = false,
  ...rest
}: ResourceInput): Resource | ImageResource | VideoResource | GifResource | AudioResource {
  type = type || getTypeFromMime(mimeType);
  const resource: Resource = {
    type,
    mimeType,
    width,
    height,
    sizes,
    isPlaceholder,
    isExternal,
    needsProxy,
    ...rest,
  } as Resource;
  const sequenceProps = {
    poster,
    posterId,
    isOptimized,
  };
  if (type === ResourceType.Image) {
    return resource as ImageResource;
  }
  if (type === ResourceType.Video) {
    return {
      ...resource,
      ...sequenceProps,
      length,
      lengthFormatted,
      isMuted,
      trimData,
    } as VideoResource;
  }
  if (type === ResourceType.Gif) {
    return {
      ...resource,
      ...sequenceProps,
      output,
    } as GifResource;
  }
  if (type === ResourceType.Audio) {
    return {
      ...resource,
      length,
      lengthFormatted,
    } as AudioResource;
  }
  return resource;
}

export default createResource;
