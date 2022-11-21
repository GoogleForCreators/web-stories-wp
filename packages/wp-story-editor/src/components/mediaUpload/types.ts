/*
 * Copyright 2022 Google LLC
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
  GifResource,
  Resource,
  ResourceType,
  VideoResource,
  AudioResource,
} from '@googleforcreators/media';

export interface useMediaPickerProps {
  title: string;
  buttonInsertText: string;
  onSelect: (
    resource:
      | GifResource
      | Resource
      | ResourceType
      | VideoResource
      | AudioResource
  ) => void;
  onSelectErrorMessage: string;
  onClose: () => void;
  onPermissionError: () => void;
  type: string | string[];
  cropParams: object;
  multiple: boolean;
}

export interface MediaUploadProps extends useMediaPickerProps {
  render: (Function) => void;
}
