# Integration Layer

Similar to Story Editor, Dashboard can be integrated by configuring the `Dashboard` and other components like `InterfaceSkeleton`.

As seen in the getting started guide, a minimal dashboard can be created by using the two main components  `Dashboard` and `InterfaceSkeleton`  like below.

```js
import { Dashboard, InterfaceSkeleton } from "@googleforcreators/dashboard";

const StoriesDashboard = () => {
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

export default StoriesDashboard;
```



## `Dashboard`

This is the top level component which has all the provider components but doesn't render any UI itself.

**Props:**

- `config`
    - type: `Object`
    - required: Yes
    - description: Used for most of the dashboard configuration. See the [Dashboard Config](#dashboard-config) section below for full detail.



## `InterfaceSkeleton`

This component is responsible for rendering the story editor interface UI and can be configured by using multiple props. Please look at the `InterfaceSkeleton` section below for detailed documentation of this component.

**Props:**

- `additionalRoutes`
    - type: `array<Object>`
    - required: No
    - description: Used to add additional routes to the left rail.
        - `path`
            - type: `string`
            - required: Yes
            - description: Unique path to this page. For example - `/editor-settings`.
        - `component`
            - type: `React.ReactElement`
            - required: Yes
            - description: A component which will be rendered on the page content area if corresponding link is selected




## Dashboard Config

To configure the dashboard to your needs you can pass various config options to the story dashboard via `config` prop of the `Dashboard` component.

- `isRTL`
    - type: `boolean`
    - required: No
    - description: It defines the direction of the layout of the dashboard.

- `userId`
    - type: `number`
    - required: No
    - description: The id of the user who is currently viewing the dashboard.

- `locale`
    - type: `Object`
    - required: No
    - description: It is a set of parameters that defines the user's language, region and any special variant preferences that the user wants to see in their user interface.

- `newStoryURL`
    - type: `string`
    - required: Yes
    - description: This specifies the exact url to create a new story.

- `archiveURL`
    - type: `string`
    - required: No
    - description: URL to archives page for web story. 

- `defaultArchiveURL`
    - type: `string`
    - required: No
    - description: default URL archives page for web stories 

- `cdnURL`
    - type: `string`
    - required: No
    - description: URL to dashboard resources.

- `allowedImageMimeTypes`
    - type: `array<string>`
    - required: Yes
    - description: It specifies the allowed Image types that are supported by web stories

- `version`
    - type: `string`
    - required: No
    - description: Shows the current version of web-story 

- `encodeMarkup`
    - type: `boolean`
    - required: No
    - description: It specifies whether the markup need to be encoded while making api calls. 

- `api`
    - type: `Object`
    - required: Yes
    - description: It specifies the URL for different api calls.

- `maxUpload`
    - type: `number`
    - required: No
    - description: It specifies the maximum size of a file that can be uploaded to the backend.

- `maxUploadFormatted`
    - type: `string`
    - required: No
    - description: It specifies the maximum size of a formatted file that can be uploaded to the backend

- `capabilities`
    - type: `Object`
    - required:
    - description: 
        - `canManageSettings`
            - type: `boolean`
            - required: No
            - description: It specifies the capabilities of the user to manage settings of web story.
        - `canUploadFiles`
            - type: `boolean`
            - required: No
            - description: It specifies the capabilities of the user to upload files.

- `canViewDefaultTemplates`
    - type: `boolean`
    - required: No
    - description: It specifies ability of user to view default templates. 

- `localeData`
    - type: array
    - required: Yes
    - description: Returns the translation of the translatable strings.

- `apiCallbacks`
    - type: `Object`
    - required: Yes
    - description: It consists of functions that are used to make request to API endpoints.

- `leftRailSecondaryNavigation`
    - type: `array<Object>`
    - required: No
    - description: It shows the navigation panel on the left side.
        - `value`
            - type: `string`
            - required: No
            - description: It specifies the value of its corresponding label in navigation panel.
        - `label`
            - type: `string`
            - required: No
            - description: It shows the value to be shown to the user for certain links. 
        - `isExternal`
            - type: `boolean`
            - required:
            - description: 
        - `trackingEvent`
            - type: `string`
            - required:
            - description: 

- `styleConstants`
    - type: `Object`
    - required: No
    - description: This contains various style constants which are used while calculating position for various components in dashboard. 
        - `topOffset`
            - type: `boolean`
            - required: No
            - description: It defines the top bar height, which is used in calculation for placement of components. 

- `siteKitStatus`
    - type: `Object`
    - required: No
    - description: It specifies the status of installation of site kit by google.
        - `installed`
            - type: `boolean`
            - required: No
            - description: It specifies whether site kit is installed. 
        - `active`
            - type: `boolean`
            - required: No
            - description: It specifies whether site kit is active. 
        - `analyticsActive`
            - type: `boolean`
            - required: No
            - description: It specifies whether analytics in site kit is active.
        - `adsenseActive`
            - type: `boolean`
            - required: No
            - description: It specifies whether adsense in site kit is active.
        - `analyticsLink`
            - type: `string`
            - required: No
            - description: It specifies the analytics link where analytics data are being recorded.
        - `adsenseLink`
            - type: `string`
            - required: No
            - description: It specifies adsense link where adsense data are being recorded.
