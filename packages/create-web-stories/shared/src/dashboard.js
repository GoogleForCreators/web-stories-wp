/**
 * External dependencies.
 */
import React from "react";
import { Dashboard, InterfaceSkeleton } from "@googleforcreators/dashboard";
import { setAppElement } from "@googleforcreators/design-system";

const fetchStories = () => {
  const response = {
    stories: {
      1: {
        id: 1,
        status: "publish",
        title: "Example story",
        created: "2021-11-04T10:12:47",
        createdGmt: "2021-11-04T10:12:47Z",
        author: {
          name: "Author",
          id: 1,
        },
        featuredMediaUrl: "",
      },
      2: {
        id: 2,
        status: "publish",
        title: "Example story 2",
        created: "2021-12-04T10:12:47",
        createdGmt: "2021-12-04T10:12:47Z",
        author: {
          name: "Author",
          id: 1,
        },
        featuredMediaUrl:
          "https://wp.stories.google/static/main/images/templates/fresh-and-bright/page8_figure.jpg",
      },
    },
    fetchedStoryIds: [1, 2],
    totalPages: 1,
    totalStoriesByStatus: {
      all: 2,
      publish: 2,
    },
  };

  return Promise.resolve(response);
};


function CustomDashboard() {
  const appElement = document.getElementById("root");

  // see http://reactcommunity.org/react-modal/accessibility/
  setAppElement(appElement);
  const config = {
    apiCallbacks: {
      fetchStories,
    },
  };

  return (
    <Dashboard config={config}>
      <InterfaceSkeleton />
    </Dashboard>
  );
}
export default CustomDashboard;
