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
import { ReactComponent as CirclesCarouselViewIcon } from '../images/view-type/circles-carousel-view.svg';
import { ReactComponent as CirclesCarouselConfigIcon } from '../images/config-panel/circles-carousel-view-panel-icon.svg';
import { ReactComponent as LatestStoriesBlockIcon } from './icons/block-type/latest-stories-block.svg';
import { ReactComponent as SelectedStoriesBlockIcon } from './icons/block-type/selected-stories-block.svg';
import { ReactComponent as EmbedStoriesBlockIcon } from './icons/block-type/embed-story-block.svg';

import { ReactComponent as GridViewIcon } from './icons/view-type/grid-view.svg';
import { ReactComponent as ListViewIcon } from './icons/view-type/list-view.svg';
import { ReactComponent as BoxCarouselViewIcon } from './icons/view-type/box-carousel-view.svg';

import { ReactComponent as GridViewConfigIcon } from './icons/config-panel/grid-view-panel-icon.svg';
import { ReactComponent as ListViewConfigIcon } from './icons/config-panel/list-view-panel-icon.svg';
import { ReactComponent as BoxCarouselConfigIcon } from './icons/config-panel/box-carousel-view-panel-icon.svg';

// Icons for block types.
export const LATESTS_STORIES_BLOCK_ICON = (
  <LatestStoriesBlockIcon width={31} height={42} />
);

export const SELECTED_STORIES_BLOCK_ICON = (
  <SelectedStoriesBlockIcon width={32} height={32} />
);

export const EMBED_STORY_BLOCK_ICON = (
  <EmbedStoriesBlockIcon width={32} height={16} />
);

// Icons for view types.
export const CAROUSEL_VIEW_TYPE_ICON = (
  <BoxCarouselViewIcon width={18} height={14} />
);

export const CIRCLES_VIEW_TYPE_ICON = (
  <CirclesCarouselViewIcon
    className="web-stories-block__toolbar-icon icon__circles-carousel"
    width={23}
    height={18}
  />
);

export const GRID_VIEW_TYPE_ICON = <GridViewIcon width={12} height={14} />;
export const LIST_VIEW_TYPE_ICON = <ListViewIcon width={12} height={13} />;

// Configuration panel view type icons.
export const BOX_CAROUSEL_CONFIG_ICON = (
  <BoxCarouselConfigIcon width={26} height={20} />
);

export const LIST_VIEW_CONFIG_ICON = (
  <ListViewConfigIcon width={22} height={26} />
);

export const CIRCLE_CAROUSEL_CONFIG_ICON = (
  <CirclesCarouselConfigIcon width={42} height={24} />
);

export const GRID_VIEW_CONFIG_ICON = (
  <GridViewConfigIcon width={20} height={27} />
);
