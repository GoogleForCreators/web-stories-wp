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
import PageTooManyLinks from './checks/pageTooManyLinks';
import PageTooMuchText from './checks/pageTooMuchText';
import PageTooLittleText from './checks/pageTooLittleText';
import VideoElementResolution from './checks/videoElementResolution';
import ImageElementResolution from './checks/imageElementResolution';
import StoryPagesCount from './checks/storyPagesCount';

export function DesignChecks() {
  return (
    <>
      <StoryPagesCount />
      <PageTooMuchText />
      <PageTooLittleText />
      <PageTooManyLinks />
      <VideoElementResolution />
      <ImageElementResolution />
    </>
  );
}
