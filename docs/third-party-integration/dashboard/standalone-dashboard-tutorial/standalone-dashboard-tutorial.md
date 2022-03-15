# Standalone dashboard tutorial

## Step 1: Setting up the dashboard with minimum config

Installing dependencies

```sh
npm install @googleforcreators/dashboard
```

After that you can use code block given below to scaffold a minimal story dashboard.

```js
import { Dashboard, InterfaceSkeleton } from "@googleforcreators/dashboard";

const CustomDashboard = () => {
  const apiCallbacks = {
    fetchStories: () =>
      Promise.resolve({
        stories: {},
        fetchedStoryIds: [],
        totalPages: 1,
        totalStoriesByStatus: {
          all: 0,
          publish: 0,
        },
      }),
  };

  return (
    <Dashboard config={{ apiCallbacks }}>
      <InterfaceSkeleton />
    </Dashboard>
  );
};

export default CustomDashboard;
```

<!-- Writup explaining fetchStories is required and why this response was send -->

## Step 2: Adding hard-coded stories and updating `fetchStories` to handle its argument

```js
const STORIES_RESP = {
  stories: {
    1: {
      id: 1,
      status: "publish",
      title: "Example story",
      created: "2021-11-04T10:12:47",
      createdGmt: "2021-11-04T10:12:47Z",
      author: {
        name: "Author 1",
        id: 1,
      },
      featuredMediaUrl:
        "https://wp.stories.google/static/main/images/templates/food-and-stuff/page1_bg.jpg",
    },
    2: {
      id: 2,
      status: "publish",
      title: "Example story 2",
      created: "2021-12-05T10:12:47",
      createdGmt: "2021-12-05T10:12:47Z",
      author: {
        name: "Author 2",
        id: 2,
      },
      featuredMediaUrl:
        "https://wp.stories.google/static/main/images/templates/fresh-and-bright/page8_figure.jpg",
    },
    3: {
        id: 3,
        status: "publish",
        title: "Example story 3",
        created: "2021-12-06T10:12:47",
        createdGmt: "2021-12-06T10:12:47Z",
        author: {
          name: "Author 3",
          id: 3,
        },
        featuredMediaUrl:
          "https://wp.stories.google/static/main/images/templates/fresh-and-bright/page7_product2.jpg",
      },
  },
  fetchedStoryIds: [1, 2, 3],
  totalPages: 1,
  totalStoriesByStatus: {
    all: 3,
    publish: 2,
  },
};

const fetchStories = () => {
  return Promise.resolve(STORIES_RESP);
};

export default fetchStories;
```

Update `fetchStories` as below to allow basic filtering an ordering of stories

```jsx
  const fetchStories = ({
  status,
  sortDirection,
}) => {
  let newFetchedIds = [];
  try {
    const statusArray = status.split(",");
    if (statusArray.length === 6) {
      newFetchedIds = STORIES_RESP.fetchedStoryIds;
    } else {
      Object.values(STORIES_RESP.stories).forEach(
        ({ status: storyStatus, id }) => {
          if (statusArray.includes(storyStatus)) {
            newFetchedIds.push(id);
          }
        }
      );
    }
    if (sortDirection && sortDirection === "desc") {
      newFetchedIds = newFetchedIds.reverse();
    }
    return Promise.resolve({
      ...STORIES_RESP,
      fetchedStoryIds: newFetchedIds,
      //stories: newStories,
    });
  } catch (err) {
    console.log(err);
    return Promise.resolve();
  }
};

export default fetchStories;
```

## Step 4: Adding a custom settings page
