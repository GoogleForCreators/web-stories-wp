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
import { useConfig } from '../../../../../app/config';
import {
  PublisherLogoSize,
  StoryMissingExcerpt,
  StoryMissingTitle,
  StoryPosterSize,
  StoryPosterAttached,
  StoryTitleLength,
  VideoElementMissingPoster,
  VideoOptimization,
  StoryAmpValidationErrors,
  PublisherLogoMissing,
} from '../../../../../components/checklist';
import useFFmpeg from '../../../../../app/media/utils/useFFmpeg';

function Priority() {
  const { hasUploadMediaAction } = useConfig(({ capabilities }) => ({
    canManageSettings: capabilities.canManageSettings,
    hasUploadMediaAction: capabilities.hasUploadMediaAction,
  }));
  const { isTranscodingEnabled } = useFFmpeg();

  return (
    <>
      <StoryMissingTitle />
      <StoryTitleLength />
      <StoryMissingExcerpt />
      {hasUploadMediaAction && <StoryPosterAttached />}
      {hasUploadMediaAction && <StoryPosterSize />}
      {hasUploadMediaAction && <PublisherLogoMissing />}
      {hasUploadMediaAction && <PublisherLogoSize />}
      {hasUploadMediaAction && <VideoElementMissingPoster />}
      {/* `isTranscodingEnabled` already checks for `hasUploadMediaAction` */}
      {isTranscodingEnabled && <VideoOptimization />}
      <StoryAmpValidationErrors />
    </>
  );
}

export default Priority;
