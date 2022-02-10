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
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import CirclesCarouselViewIcon from './images/view-type/circles-carousel-view.svg';
import CirclesCarouselConfigIcon from './images/config-panel/circles-carousel-view-panel-icon.svg';
import LatestStoriesBlockIcon from './icons/block-type/latest-stories-block.svg';
import SelectedStoriesBlockIcon from './icons/block-type/selected-stories-block.svg';
import EmbedStoriesBlockIcon from './icons/block-type/embed-story-block.svg';

import GridViewIcon from './icons/view-type/grid-view.svg';
import ListViewIcon from './icons/view-type/list-view.svg';
import BoxCarouselViewIcon from './icons/view-type/box-carousel-view.svg';

import GridViewConfigIcon from './icons/config-panel/grid-view-panel-icon.svg';
import ListViewConfigIcon from './icons/config-panel/list-view-panel-icon.svg';
import BoxCarouselConfigIcon from './icons/config-panel/box-carousel-view-panel-icon.svg';

// Icons for block types.
export const LATEST_STORIES_BLOCK_ICON = (
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

// Defining the SVG like this ensures that IDs are unique
// even if there are multiple instances of the component.
// See https://github.com/googleforcreators/web-stories-wp/issues/8401
export const BlockIcon = () => {
  const id = useInstanceId(BlockIcon);

  return (
    <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle
        cx="32"
        cy="32"
        r="32"
        transform="rotate(-180 32 32)"
        fill={`url(#gradient-${id})`}
      />
      <g filter={`url(#filter-${id})`} fill="#fff">
        <path d="M41.6 19.2a3.2 3.2 0 013.2 3.2v19.2a3.2 3.2 0 01-3.2 3.2V19.2zm-24 0a3.2 3.2 0 013.2-3.2h14.4a3.2 3.2 0 013.2 3.2v25.6a3.2 3.2 0 01-3.2 3.2H20.8a3.2 3.2 0 01-3.2-3.2V19.2zM48 22.4a2.4 2.4 0 012.4 2.4v14.4a2.4 2.4 0 01-2.4 2.4V22.4z" />
      </g>
      <defs>
        <linearGradient
          id={`gradient-${id}`}
          x1="13.255"
          y1="6.599"
          x2="35.289"
          y2="62.791"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#79B3FF" />
          <stop offset="1" stopColor="#CBACFF" />
        </linearGradient>
        <filter
          id={`filter-${id}`}
          x="8.96"
          y="10.24"
          width="46.08"
          height="46.08"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="1.28" />
          <feGaussianBlur stdDeviation="1.92" />
          <feColorMatrix values="0 0 0 0 0.423529 0 0 0 0 0.490196 0 0 0 0 0.733333 0 0 0 0.3 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};
