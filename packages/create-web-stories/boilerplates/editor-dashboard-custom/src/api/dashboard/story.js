/**
 * Internal dependencies
 */
import { LOCAL_STORAGE_CONTENT_KEY } from "../../constants";

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
    status: "publish",
    title: story.title.raw,
    author: singleStoryData?.author,
    capabilities: {
      hasEditAction: true,
    },
    featuredMediaUrl:
      "https://wp.stories.google/static/main/images/templates/food-and-stuff/page1_bg.jpg",
    editStoryLink: "/editor?id=" + Number(singleStoryData?.storyId),
    created: singleStoryData?.created,
    createdGmt: singleStoryData?.createdGmt,
  });
};

export const fetchStories = ({ searchTerm }) => {
  const content =
    JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY)) || {};
  const contentKeys = Object.keys(content).map((x) => {
    return parseInt(x);
  });
  if (searchTerm) {
    let response = {
      stories: {},
      totalPages: 1,
      totalStoriesByStatus: {
        all: contentKeys.length,
        publish: 0,
      },
      fetchedStoryIds: [],
    };  
    contentKeys.forEach((key) => {
      const { storyId, author, title, createdGmt, created } = content[key];
      if (title?.raw.includes(searchTerm)) {  
        response.fetchedStoryIds.push(Number(storyId));
        response.totalStoriesByStatus.publish = response.totalStoriesByStatus.publish + 1;
        response.stories[storyId] = {
          id: Number(storyId),
          status: "publish",
          title: title?.raw || "",
          created,
          createdGmt,
          author: author,
          capabilities: {
            hasEditAction: true,
            hasDeleteAction: true,
          },
          featuredMediaUrl:
            "https://wp.stories.google/static/main/images/templates/food-and-stuff/page1_bg.jpg",
          editStoryLink: "/editor?id=" + Number(storyId),
        };
      }
    });
    return Promise.resolve(response);
  } else {
    let response = {
      stories: {},
      totalPages: 1,
      totalStoriesByStatus: {
        all: contentKeys.length,
        publish: contentKeys.length,
      },
      fetchedStoryIds: contentKeys,
    };
    contentKeys.forEach((key) => {
      const { storyId, author, title, createdGmt, created } = content[key];
        response.stories[storyId] = {
          id: Number(storyId),
          status: "publish",
          title: title?.raw || "",
          created,
          createdGmt,
          author: author,
          capabilities: {
            hasEditAction: true,
            hasDeleteAction: true,
          },
          featuredMediaUrl:
            "https://wp.stories.google/static/main/images/templates/food-and-stuff/page1_bg.jpg",
          editStoryLink: "/editor?id=" + Number(storyId),
        };
    });
    return Promise.resolve(response);
  }
};
export const trashStory = (id) => {
  try {
    const storyData =
      JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY)) || {};

    const newStoryData = {};
    const storyIdList = Object.keys(storyData);
    storyIdList.forEach((storyId) => {
      if (Number(storyId) !== id) {
        newStoryData[id] = storyData[id];
      }
    });

    window.localStorage.setItem(
      LOCAL_STORAGE_CONTENT_KEY,
      JSON.stringify(newStoryData)
    );
    return Promise.resolve();
  } catch (err) {
    console.error("trash story", err);
  }
};
