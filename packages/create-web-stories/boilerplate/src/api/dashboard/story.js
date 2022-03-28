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
 * Internal dependencies
 */
import { LOCAL_STORAGE_CONTENT_KEY } from '../../constants';

export const updateStory = (story) => {
  const storyData =
    JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY)) || {};

  const singleStoryData = storyData[story.id];

  singleStoryData.title = story.title;
  storyData[singleStoryData.storyId] = singleStoryData;

  window.localStorage.setItem(
    LOCAL_STORAGE_CONTENT_KEY,
    JSON.stringify(storyData)
  );

  return Promise.resolve({
    id: Number(singleStoryData?.storyId),
    status: 'publish',
    title: story.title.raw,
    created: '2021-11-04T10:12:47',
    createdGmt: '2021-11-04T10:12:47Z',
    author: singleStoryData?.author,
    capabilities: {
      hasEditAction: true,
    },
    featuredMediaUrl: '',
    editStoryLink: '/editor?id=' + Number(singleStoryData?.storyId),
  });
};

export const fetchStories = () => {
  const content =
    JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY)) || {};
  console.log(content);
  const contentKeys = Object.keys(content).map((x) => {
    return parseInt(x);
  });
  const response = {
    stories: {},
    totalPages: 1,
    totalStoriesByStatus: {
      all: contentKeys.length,
      publish: contentKeys.length,
    },
    fetchedStoryIds: contentKeys,
  };
  contentKeys.forEach((key) => {
    const { storyId, author, title } = content[key];
    response.stories[storyId] = {
      id: Number(storyId),
      status: 'publish',
      title: title?.raw || '',
      created: '2021-11-04T10:12:47',
      createdGmt: '2021-11-04T10:12:47Z',
      author: author,
      capabilities: {
        hasEditAction: true,
        hasDeleteAction: true,
      },
      featuredMediaUrl:
        'https://wp.stories.google/static/main/images/templates/food-and-stuff/page1_bg.jpg',
      editStoryLink: '/editor?id=' + Number(storyId),
    };
  });
  return Promise.resolve(response);
};
export const trashStory = (id) => {
  try {
    const storyData =
      JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY)) || {};

    const newStoryData = {};
    const storyIdList = Object.keys(storyData);

    storyIdList.forEach((storyId) => {
      if (storyId !== id) {
        newStoryData[id] = storyData[id];
      }
    });

    window.localStorage.setItem(
      LOCAL_STORAGE_CONTENT_KEY,
      JSON.stringify(newStoryData)
    );
    return Promise.resolve();
  } catch (err) {
    console.error('trash story', err);
  }
};
