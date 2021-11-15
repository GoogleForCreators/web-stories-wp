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
import StoryPropTypes from '../../../types';
import PagePreview from '../../footer/pagepreview';
import { THUMBNAIL_DIMENSIONS } from '../../thumbnail';

export const ThumbnailPagePreview = ({ page }) => (
  <PagePreview
    page={page}
    width={THUMBNAIL_DIMENSIONS.WIDTH}
    height={THUMBNAIL_DIMENSIONS.HEIGHT}
    as="div"
    help="checklist"
    isActive
    className="pagePreviewOverrides"
  />
);
ThumbnailPagePreview.propTypes = {
  page: StoryPropTypes.page.isRequired,
};
