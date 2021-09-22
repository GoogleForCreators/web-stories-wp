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

export default [
  {
    name: 'Tags',
    slug: 'story-tag',
    capabilities: {
      manage_terms: 'manage_categories',
      edit_terms: 'manage_categories',
      delete_terms: 'manage_categories',
      assign_terms: 'edit_posts',
    },
    description: 'Story Tags',
    labels: {
      name: 'Tags',
      singular_name: 'Tag',
      search_items: 'Search Tags',
      popular_items: 'Popular Tags',
      all_items: 'All Tags',
      parent_item: null,
      parent_item_colon: null,
      edit_item: 'Edit Tag',
      view_item: 'View Tag',
      update_item: 'Update Tag',
      add_new_item: 'Add New Tag',
      new_item_name: 'New Tag Name',
      separate_items_with_commas: 'Separate tags with commas',
      add_or_remove_items: 'Add or remove tags',
      choose_from_most_used: 'Choose from the most used tags',
      not_found: 'No tags found.',
      no_terms: 'No tags',
      filter_by_item: null,
      items_list_navigation: 'Tags list navigation',
      items_list: 'Tags list',
      most_used: 'Most Used',
      back_to_items: '&larr; Go to Tags',
      item_link: 'Tag Link',
      item_link_description: 'A link to a tag.',
      menu_name: 'Tags',
      name_admin_bar: 'story-tag',
    },
    types: ['web-story'],
    showCloud: true,
    hierarchical: false,
    restBase: 'story-tags',
    visibility: {
      public: true,
      publicly_queryable: true,
      show_admin_column: false,
      show_in_nav_menus: true,
      show_in_quick_edit: true,
      show_ui: true,
    },
    _links: {
      collection: [
        {
          href: 'http://localhost:8899/wp-json/web-stories/v1/taxonomies',
        },
      ],
      'wp:items': [
        {
          href: 'http://localhost:8899/wp-json/wp/v2/story-tags',
        },
      ],
      curies: [
        {
          name: 'wp',
          href: 'https://api.w.org/{rel}',
          templated: true,
        },
      ],
    },
  },
  {
    name: 'Colors',
    slug: 'story-color',
    capabilities: {
      manage_terms: 'manage_categories',
      edit_terms: 'manage_categories',
      delete_terms: 'manage_categories',
      assign_terms: 'edit_posts',
    },
    description: 'Story Colors',
    labels: {
      name: 'Colors',
      singular_name: 'Color',
      search_items: 'Search Colors',
      popular_items: 'Popular Colors',
      all_items: 'All Colors',
      parent_item: null,
      parent_item_colon: null,
      edit_item: 'Edit Color',
      view_item: 'View Color',
      update_item: 'Update Color',
      add_new_item: 'Add New Color',
      new_item_name: 'New Color Name',
      separate_items_with_commas: 'Separate colors with commas',
      add_or_remove_items: 'Add or remove colors',
      choose_from_most_used: 'Choose from the most used colors',
      not_found: 'No colors found.',
      no_terms: 'No colors',
      filter_by_item: null,
      items_list_navigation: 'Colors list navigation',
      items_list: 'Colors list',
      most_used: 'Most Used',
      back_to_items: '&larr; Go to Colors',
      item_link: 'Color Color',
      item_link_description: 'A link to a color.',
      menu_name: 'Colors',
      name_admin_bar: 'Color',
      archives: 'All Colors',
    },
    types: ['web-story'],
    showCloud: true,
    hierarchical: false,
    restBase: 'story-colors',
    visibility: {
      public: true,
      publicly_queryable: true,
      show_admin_column: false,
      show_in_nav_menus: true,
      show_in_quick_edit: true,
      show_ui: true,
    },
    _links: {
      collection: [
        {
          href: 'http://localhost:8899/wp-json/web-stories/v1/taxonomies',
        },
      ],
      'wp:items': [
        {
          href: 'http://localhost:8899/wp-json/wp/v2/story-colors',
        },
      ],
      curies: [
        {
          name: 'wp',
          href: 'https://api.w.org/{rel}',
          templated: true,
        },
      ],
    },
  },
  {
    name: 'Categories',
    slug: 'story-category',
    capabilities: {
      manage_terms: 'manage_categories',
      edit_terms: 'manage_categories',
      delete_terms: 'manage_categories',
      assign_terms: 'edit_posts',
    },
    description: 'Story Categories',
    labels: {
      name: 'Categories',
      singular_name: 'Category',
      search_items: 'Search Categories',
      popular_items: null,
      all_items: 'All Categories',
      parent_item: 'Parent Category',
      parent_item_colon: 'Parent Category:',
      edit_item: 'Edit Category',
      view_item: 'View Category',
      update_item: 'Update Category',
      add_new_item: 'Add New Category',
      new_item_name: 'New Category Name',
      separate_items_with_commas: null,
      add_or_remove_items: null,
      choose_from_most_used: null,
      not_found: 'No categories found.',
      no_terms: 'No categories',
      filter_by_item: 'Filter by category',
      items_list_navigation: 'Categories list navigation',
      items_list: 'Categories list',
      most_used: 'Most Used',
      back_to_items: '&larr; Go to Categories',
      item_link: 'Category Link',
      item_link_description: 'A link to a category.',
      menu_name: 'Categories',
      name_admin_bar: 'story-category',
    },
    types: ['web-story'],
    showCloud: true,
    hierarchical: true,
    restBase: 'story-categories',
    visibility: {
      public: true,
      publicly_queryable: true,
      show_admin_column: false,
      show_in_nav_menus: true,
      show_in_quick_edit: true,
      show_ui: true,
    },
    _links: {
      collection: [
        {
          href: 'http://localhost:8899/wp-json/web-stories/v1/taxonomies',
        },
      ],
      'wp:items': [
        {
          href: 'http://localhost:8899/wp-json/wp/v2/story-categories',
        },
      ],
      curies: [
        {
          name: 'wp',
          href: 'https://api.w.org/{rel}',
          templated: true,
        },
      ],
    },
  },
  {
    name: 'Verticals',
    slug: 'story-vertical',
    capabilities: {
      manage_terms: 'manage_categories',
      edit_terms: 'manage_categories',
      delete_terms: 'manage_categories',
      assign_terms: 'edit_posts',
    },
    description: 'Story Verticals',
    labels: {
      name: 'Verticals',
      singular_name: 'Vertical',
      search_items: 'Search Verticals',
      popular_items: null,
      all_items: 'All Verticals',
      parent_item: 'Parent Vertical',
      parent_item_colon: 'Parent Vertical:',
      edit_item: 'Edit Vertical',
      view_item: 'View Vertical',
      update_item: 'Update Vertical',
      add_new_item: 'Add New Vertical',
      new_item_name: 'New Vertical Name',
      separate_items_with_commas: null,
      add_or_remove_items: null,
      choose_from_most_used: null,
      not_found: 'No verticals found.',
      no_terms: 'No verticals',
      filter_by_item: 'Filter by vertical',
      items_list_navigation: 'Verticals list navigation',
      items_list: 'Verticals list',
      most_used: 'Most Used',
      back_to_items: '&larr; Go to Verticals',
      item_link: 'Color Vertical',
      item_link_description: 'A link to a vertical.',
      menu_name: 'Verticals',
      name_admin_bar: 'Vertical',
      archives: 'All Verticals',
    },
    types: ['web-story'],
    showCloud: true,
    hierarchical: true,
    restBase: 'story-verticals',
    visibility: {
      public: true,
      publicly_queryable: true,
      show_admin_column: false,
      show_in_nav_menus: true,
      show_in_quick_edit: true,
      show_ui: true,
    },
    _links: {
      collection: [
        {
          href: 'http://localhost:8899/wp-json/web-stories/v1/taxonomies',
        },
      ],
      'wp:items': [
        {
          href: 'http://localhost:8899/wp-json/wp/v2/story-verticals',
        },
      ],
      curies: [
        {
          name: 'wp',
          href: 'https://api.w.org/{rel}',
          templated: true,
        },
      ],
    },
  },
];
