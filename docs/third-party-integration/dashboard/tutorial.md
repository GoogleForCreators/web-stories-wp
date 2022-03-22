# Tutorial

This tutorial explains how to create a standalone story dashboard step by step. It covers implementing the following functionalities:

- Fetching hard-coded stories.
- Adding filters for browsing stories.
- Adding a custom settings page in the dashboard

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
          all: 3,
          draft: 0,
          future: 0,
          pending: 0,
          private: 0,
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

Minimum requirement for a story dashboard is to fetch stories, so the user can browse them go to the editor to update them. The response for `fetchStories` that is shown in the above code sample emulates a CMS having no stories saved. 

## Step 2: Adding hard-coded stories and updating `fetchStories` to handle its argument

`fetchStories` callback be updated as shown in the below code sample to serve hard-coded data.

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

const fetchStories = () => Promise.resolve(STORIES_RESP);

export default fetchStories;
```

You can also update `fetchStories` as below to allow basic filtering and ordering stories on the basis of their statuses.

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
    return Promise.reject( err );
  }
};

export default fetchStories;
```

Similar to how `status` and `sortOrder` in used in the code sample you can add other filter based on parameters passed to `fetchStories`. See [API callbacks](./api-callbacks.md) for more information.

## Step 4: Adding a custom settings page

You can add a custom page or an external link to the dashboard's menu by passing required values to `config` and `InterfaceSkeletons`'s prop `additionalRoutes`. Below is a code sample doing just that.

```js
import { PageHeading, Layout } from "@googleforcreators/dashboard";

export function EditorSettings() {
  return (
    <Layout.Provider>
      <div>
        <PageHeading heading={"Settings"} />
        <Layout.Scrollable>
          <div
            style={{
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:"#EEE"
            }}
          >
            {"Settings"}
          </div>
        </Layout.Scrollable>
      </div>
    </Layout.Provider>
  );
}

export const leftRailRoutes = [
  {
    value: "/settings",
    label: "Settings",
  },
  {
    value: `https://googleforcreators.github.io/web-stories-wp/storybook/iframe.html?id=playground-dashboard--default&args=&viewMode=story#/`,
    label: "External link",
    isExternal: true,
  },
];

```

Now let's pass the required values to `config` and `additionalRoutes`.

```js
import { Dashboard, InterfaceSkeleton } from "@googleforcreators/dashboard";
import fetchStories from "./fetchStories";
import { leftRailRoutes, EditorSettings } from "./settings";

const CustomDashboard = () => {
  const apiCallbacks = {
    fetchStories,
  };

  return (
    <Dashboard
      config={{ apiCallbacks, leftRailSecondaryNavigation: leftRailRoutes }}
    >
      <InterfaceSkeleton
        additionalRoutes={[
          {
            path: "/settings",
            component: <EditorSettings />,
          },
        ]}
      />
    </Dashboard>
  );
};

export default CustomDashboard;
```
