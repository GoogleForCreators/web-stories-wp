# Dashboard

If you want a companion dashboard which goes along with the Story editor `@googleforcreators/dashboard` has got you covered. Similar to `StoryEditor` you can use the `Dashboard` in the package `@googleforcreators/dashboard` which can be used to maintain multiple stories stored in a CMS.


## Scaffolding a Story Dashboard

You can quickly spin up a dashboard in a few steps described below.

### Step 1: Set up a React project

The easiest way of setting up an SPA React project is to use [CRA](https://create-react-app.dev/) or to use templates such as [react-boilerplate](https://github.com/react-boilerplate/react-boilerplate).

### Step 2: Install dependencies

For a minimal story dashboard, you only need to install a single package `@googleforcreators/dashboard`.

```sh
npm install @googleforcreators/dashboard
```

### Step 3: Use the `Dashboard` component to render the dashboard

If you have used CRA, simply replace the contents of `src/App.js` with the code sample given below.

```js
import React from "react";
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

You should now have the story editor that looks like this.

![dashboard](./assets/dashboard-minimal.png)

## Meet The Dashboard

Now that you have a Story Editor up and running, let's get to know a little about it.

The Dashboard has 2 main area that one should know about.

![dashboard-labelled](./assets/dashboard-labelled.png)

### Left Rail - (1)

Left rail provides a list of links to different pages configured in the dashboard. Selecting any link by clicking on it will result in its content being loaded in the **Page Content** area.
By default, **Left Rail** only has one link to a page which shows all stories a user has saved.

### Page Content - (2)

In this area a page contents will be loaded depending on what link is selected in the left rail. 
