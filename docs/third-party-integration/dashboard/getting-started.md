# Dashboard

If you want a companion dashboard to show stories created by the user or a list of story templates to choose from, you may use `Dashboard` from the `@googleforcreators/dashboard` package.
The dashboard can also be used to create a settings page for the story editor.

## Scaffolding a Story Dashboard

You can quickly spin up a dashboard in a few steps described below.

### Step 1: Set up a React project

The easiest way of setting up an SPA React project is to use [CRA](https://create-react-app.dev/) or to use templates such as [react-webpack-babel-starter](https://github.com/vikpe/react-webpack-babel-starter).

### Step 2: Install dependencies

For a minimal story dashboard, you only need to install a single package `@googleforcreators/dashboard`.

```sh
npm install @googleforcreators/dashboard
```

### Step 3: Use the `Dashboard` component to render the dashboard

```js
import { Dashboard, InterfaceSkeleton } from "@googleforcreators/dashboard";

const EditorDashboard = () => {
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

export default EditorDashboard;
```

By default, the dashboard looks like this:

![dashboard](https://user-images.githubusercontent.com/841956/159524205-43e27097-9321-487c-b236-28f9414f539e.png)

The dashboard application can be split into 2 different areas:

![dashboard-labelled](https://user-images.githubusercontent.com/841956/159524265-bf0a117a-2432-469d-8733-d61f1e94b3aa.png)

The left rail / sidebar (1) provides a list of menu items for different pages configured in the dashboard.
Clicking on a menu item will display the page's content on the right (2).

Out of the box, the left rail only contains a menu item for the main page showing all existing stories.
