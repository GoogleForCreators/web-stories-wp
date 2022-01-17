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
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { STORY_STATUS, TEMPLATES_GALLERY_STATUS } from './constants';

export const DashboardStatusesPropType = PropTypes.oneOf([
  ...Object.values(STORY_STATUS),
  ...Object.values(TEMPLATES_GALLERY_STATUS),
]);

export const StoryPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  status: DashboardStatusesPropType,
  title: PropTypes.string.isRequired,
  modified: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  author: PropTypes.object,
  capabilities: PropTypes.shape({
    hasDeleteAction: PropTypes.bool,
    hasEditAction: PropTypes.bool,
  }),
});

export const TemplatePropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  status: DashboardStatusesPropType,
  title: PropTypes.string.isRequired,
  pages: PropTypes.array,
  modified: PropTypes.object,
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ),
  description: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  createdBy: PropTypes.string,
  postersByPage: PropTypes.arrayOf(
    PropTypes.shape({
      webp: PropTypes.string,
      png: PropTypes.string,
      type: PropTypes.string,
    })
  ),
});

export const TagPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
});

export const CategoryPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  parent: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
});

export const UserPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  avatarUrls: PropTypes.object,
});

export const StoriesPropType = PropTypes.arrayOf(StoryPropType);
export const TemplatesPropType = PropTypes.arrayOf(TemplatePropType).isRequired;

export const StoryActionsPropType = PropTypes.shape({
  duplicateStory: PropTypes.func,
  trashStory: PropTypes.func,
  updateStory: PropTypes.func,
});

export const TemplateActionsPropType = PropTypes.shape({
  createStoryFromTemplate: PropTypes.func,
  handleDetailsToggle: PropTypes.func,
  switchToTemplateByOffset: PropTypes.func,
});

export const TotalStoriesByStatusPropType = PropTypes.shape({
  all: PropTypes.number,
  draft: PropTypes.number,
  publish: PropTypes.number,
});

export const PageSizePropType = PropTypes.shape({
  width: PropTypes.number,
  height: PropTypes.number,
});

export const StoryMenuPropType = PropTypes.shape({
  handleMenuToggle: PropTypes.func.isRequired,
  contextMenuId: PropTypes.number.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      url: PropTypes.string,
      isEnabled: PropTypes.func,
      action: PropTypes.func,
    })
  ),
});

export const RenameStoryPropType = PropTypes.shape({
  handleOnRenameStory: PropTypes.func,
  id: PropTypes.number,
  handleCancelRename: PropTypes.func,
});
