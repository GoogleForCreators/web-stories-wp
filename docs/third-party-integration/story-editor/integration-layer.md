# Integration Layer

The story editor can be integrated with any platform by configuring the `StoryEditor` and other components like `InterfaceSkeleton`.
This section of the documentation gives a comprehensive guide on what aspects of the story editor can be modified and how to modify them.

As seen in the [Getting Started](./getting-started.md) guide, a minimal story editor can be created by using the two main components  `StoryEditor` and `InterfaceSkeleton`  like below.

```js
import { StoryEditor, InterfaceSkeleton } from '@googleforcreators/story-editor';
import { elementTypes } from '@googleforcreators/element-library';
import { registerElementTypes } from '@googleforcreators/elements';

const Editor = () => {
  const apiCallbacks = {
    saveStoryById: () => Promise.resolve({}),
  };

  registerElementTypes( elementTypes );

  return (
    <StoryEditor config={{ apiCallbacks }} initialEdits={{ story: {} }}>
      <InterfaceSkeleton />
    </StoryEditor>
  );
};
```

## `StoryEditor`

This is the top level component of the story editor which has all the provider components but doesn't render any UI itself.

**Props:**

- `config`
    - type: `Object`
    - required: Yes
    - description: Used for most of the editor configuration. See the [Editor Config](#editor-config) section below for full detail.

- `initialEdits`
    - type: `Object`
    - required: Yes
    - description: The initial edits/state of the story editor. Currently it only supports `story`.
        - `story`
            - type: `Object`
            - required: Yes
            - description: The story editor needs initial story when it loads. You can either provide the initial story object from this prop or via `getStoryById` API callback. See the [expected response](./api-callbacks.md#getstorybyid) of `getStoryById` for the shape of this object.

## `InterfaceSkeleton`

This component is responsible for rendering the story editor interface UI and can be configured by using multiple props. Please look at the [InterfaceSkeleton](#interfaceskeleton) section below for detailed documentation of this component.

**Props:**

- `header`
    - type: `React.ReactElement`
    - required: No
    - description: Used for rendering the workspace header.

- `footer`
    - type: `Object`
    - required: No
    - description: Used for rendering some parts of the footer.

- `sidebarTabs`
    - type: `Object`
    - required: No
    - description: Used for rendering the sidebar tabs of the story editor.

## Editor Config

To configure the editor to your needs you can pass various config options to the story editor via `config` prop of the `StoryEditor` component.

### `apiCallbacks`

- type: `Object`
- description: Takes various callback functions for story editor's side effects. The only required API callback is `saveStoryById`. For detailed documentation of `apiCallbacks`,  see [API Callbacks](./api-callbacks.md) section.

### `additionalTips` 

- type: `array`
- description: Used to provide additional tips in editor help center. 
- example :
  
  ```js
  const additionalTips = [{
    title: 'Example Tip Title',
      figureSrcImg: 'http://link/to/image',
      figureAlt: 'Figure alt text',
      description: [
        'This is an example tip used for testing. <a>Learn more</a>',
      ],
      href: 'https://external/link',
  }]
  ```

You can also provide an external link in the description of the tip.

### `allowedMimeTypes` 

- type: `Object`
- description: A map of file mime types accepted by element library.
- example :
  
  ```js
  const allowedMimeTypes = {
    audio: ['audio/mpeg', 'audio/aac', 'audio/wav', 'audio/ogg'],
    image: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
    caption: ['text/vtt'],
    vector: ['image/svg+xml']
  };
  ```

### `autoSaveInterval`

- type: `number`
- description: Time Interval (in seconds) after which story editor automatically saves a story by calling `saveStoryById`.

### `canViewDefaultTemplates`

- type: `boolean`
- description: Flag to allow for enabling default page template in the editor.

### `capabilities`

- type: `Object`
- description: Controls story editor's capabilities, currently 2 capabilities can be customized.
    - `hasMediaUploadAction`
        - type: `boolean`
        - description: Allow media upload.
    - `canManageSettings`
        - type: `boolean`
        - description: Allow visiting settings page on the dashboard.
- example :
  
  ```js
  const capabilities = {
    "hasUploadMediaAction": true,
    "canManageSettings": true
  }
  ```

### `cdnURL`

- type: `string`
- description: URL to element resources.

### `dashboardLink`

- type: `string`
- description: URL to story editor's dashboard.

### `encodeMarkup`

- type: `boolean`
- description: Flag to toggle markup generation in story data.

### `ffmpegCoreUrl`

- type: `string`
- description: URL to `ffmpeg` core required for optimizing uploaded media.

### `flags`

- type: `Object`
- description: Many experimental features can be enabled/disabled in the story editor. For a current list of existing flags, check out [`Experiments.php`](https://github.com/GoogleForCreators/web-stories-wp/blob/main/includes/Experiments.php).

### `generalSettingsLink`

- type: `string`
- description: URL for settings page of the dashboard

### `isRTL`

- type: `boolean`
- description: switches all styles to accommodate RTL languages.

### `locale`

- type: `Object`
- description: locale data 
  
    - `locale`
        - type: `string`
        - description: Locale code.

    - `dateFormat`
        - type: `string`
        - description: Date format used by the editor.

    - `timeFormat`
        - type: `string`
        - description: Time format used by the editor.

    - `gmtOffset`
        - type: `string`
        - description: GMT offset of user's location

    - `timezone`
        - type: `string`
        - description: User's time zone

    - `months`
        - type: `array<string>`
        - description: Ordered array of month names.

    - `monthsShort`
        - type: `array<string>`
        - description: Ordered array of shortened month names.

    - `weekdays`
        - type: `array<string>`
        - description: Ordered array of weekday names.

    - `weekdaysShort`
        - type: `array<string>`
        - description: Ordered array of shortened weekday names.

    - `weekdaysInitials`
        - type: `array<string>`
        - description: Ordered array of weekday initial.

    - `weekStartsOn`
        - type: `number`
        - description: Index of the first day of the week in `weekdays` array

- example :

```js
const locale ={
	"locale": "en-US",
	"dateFormat": "F j, Y",
	"timeFormat": "g:i a",
	"gmtOffset": "-4",
	"timezone": "America/New_York",
	"months": [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	],
	"monthsShort": [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	],
	"weekdays": [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	],
	"weekdaysShort": [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	],
	"weekdaysInitials": [
		"S",
		"M",
		"T",
		"W",
		"T",
		"F",
		"S"
	],
	"weekStartsOn": 1
}
```

### `maxUpload`

- type: `number`
- description: Size limit on uploaded media in bytes.

### `MediaUpload`

- type: `React.ReactElement`
- description: React component used for rendering media upload modal. See [First party Media Support](./api-callbacks.md#First-party-Media-Support)

### `showMedia3p`

- type: `boolean`
- description: Flag used to enable or disable third party media usage.

### `storyId`

- type: `number`
- description: ID of the current story being rendered by the editor.

### `styleConstants`

- type: `Object`
- description: Style constants for story editor modals.
  
    - `topOffset`
        - type: `number`
        - description: Top offset for modal overlay.

    - `leftOffset`
        - type: `number`
        - description: Left offset for modal overlay.

## InterfaceSkeleton

Many aspects of the editor can be customized by adding custom components through A component called `InterfaceSkeleton` from `@googleforCreators/story-editor`. This section will give details about what aspects of the story editor can be modified by custom components.
Before reading this you might want to check out [Getting Started](./getting-started.md) to know about different visual components of the editor.

## Workspace

### Header 

Editor Workspace has reserved space to render a custom header. This can be used to provide custom UI elements for users to interact with. 
Although you can use custom UI elements in the header, it is advised to use elements provided in `@googleForCreators/design-system`. That will guarantee design consistency and compatibility with the `RTL` layout.

An example use case is available in [Standalone Editor Tutorial](./tutorial.md) where a few buttons have been added to the header.

```jsx
import {
  StoryEditor,
  InterfaceSkeleton,
} from "@googleforcreators/story-editor";
import { elementTypes } from '@googleforcreators/element-library';
import { registerElementType } from '@googleforcreators/elements';

const CustomHeader = () => (
  <div style={{ height: `100px`, width: "100%", backgroundColor: "red" }}>
    {" Custom Header "}
  </div>
);

const Editor = () => {
  const apiCallbacks = {
    saveStoryById: () => Promise.resolve({}),
  };

  elementTypes.forEach(registerElementType);

  return (
    <div style={{ height: "100vh" }}>
      <StoryEditor config={{ apiCallbacks }} initialEdits={{ story:{} }}>
        <InterfaceSkeleton header={<CustomHeader />} />
      </StoryEditor>
    </div>
  );
};
```

### Footer 

Editor workspace also has a footer space, but unlike header space, this can only be partially modified. Modifications include adding a footer to the Help center Menu and adding a pre-publish checklist.

### Adding a footer to Help Center

Adding a footer to the help center is straightforward, just pass a component to the `InterfaceSkeleton` component as shown below.

```jsx
import {
  StoryEditor,
  InterfaceSkeleton,
} from "@googleforcreators/story-editor";
import { elementTypes } from '@googleforcreators/element-library';
import { registerElementType } from '@googleforcreators/elements';

const CustomFooter = () => <div>{" Custom Help Center Footer "}</div>;

const Editor = () => {
  const apiCallbacks = {
    saveStoryById: () => Promise.resolve({}),
  };

  elementTypes.forEach(registerElementType);

  return (
    <div style={{ height: "100vh" }}>
      <StoryEditor config={{ apiCallbacks }} initialEdits={{ story:{} }}>
        <InterfaceSkeleton
          footer={{
            secondaryMenu: {
              helpCenter: {
                Footer: CustomFooter,
              },
            },
          }}
        />
      </StoryEditor>
    </div>
  );
};
```

### Adding a pre-publish checklist

You can also initialize a checklist to assist the user by offering design suggestions. There are many pre-built checks in `@googleForCreators/story-editor` for you to use. It's also possible to add additional checks if needed.

The application accepts 3 categories of checks, below is the list of all categories with corresponding pre-built checks available for initializing the checklist.

Accessibility Checks :

- `PageBackgroundTextLowContrast`
- `TextElementFontSizeTooSmall`
- `VideoElementMissingDescription`
- `VideoElementMissingCaptions`
- `ElementLinkTappableRegionTooSmall`
- `ElementLinkTappableRegionTooBig`
- `ImageElementMissingAlt`

Design Checks :

- `StoryPagesCount`
- `PageTooMuchText`
- `PageTooLittleText`
- `PageTooManyLinks`
- `VideoElementResolution`
- `ImageElementResolution`

Priority Checks :

- `StoryMissingTitle` 
- `StoryMissingPublisherName`
- `StoryTitleLength` 
- `StoryMissingExcerpt` 
- `StoryPosterAttached`
- `StoryPosterSize`
- `PublisherLogoMissing`
- `PublisherLogoSize`
- `VideoElementMissingPoster`
- `VideoOptimization`
- `StoryAmpValidationErrors`

#### Using pre-built checks

```jsx
import {
  StoryEditor,
  InterfaceSkeleton,
  PageBackgroundTextLowContrast,
  TextElementFontSizeTooSmall,
  StoryPagesCount,
  PageTooMuchText,
  StoryMissingTitle,
  StoryTitleLength,
} from "@googleforcreators/story-editor";
import { elementTypes } from '@googleforcreators/element-library';
import { registerElementType } from '@googleforcreators/elements';

const Accessibility = () => (
  <>
    <PageBackgroundTextLowContrast />
    <TextElementFontSizeTooSmall />
  </>
);

const Design = () => (
  <>
    <StoryPagesCount />
    <PageTooMuchText />
  </>
);

const Priority = () => (
  <>
    <StoryMissingTitle />
    <StoryTitleLength />
  </>
);

const Editor = () => {
  const apiCallbacks = {
    saveStoryById: () => Promise.resolve({}),
  };

  elementTypes.forEach(registerElementType);

  return (
    <StoryEditor config={{ apiCallbacks }} initialEdits={{ story:{} }}>
      <InterfaceSkeleton
        footer={{
          secondaryMenu: {
            checklist: {
              Priority,
              Design,
              Accessibility,
            },
          },
        }}
      />
    </StoryEditor>
  );
};
```

#### Implementing a custom check

Below is an example of a custom check, this check will pop up in the checklist if story has less than 2 pages.

```jsx
import {
  ChecklistCard,
  DefaultFooterText,
  useRegisterCheck,
  useIsChecklistMounted,
  useStory,
} from "@googleforcreators/story-editor";

const LessThan2PageCheck = () => {
  const isChecklistMounted = useIsChecklistMounted();
  const { pagesLength } = useStory(({ state: { pages } }) => ({
    pagesLength: pages.length,
  }));
  const hasLessThan2Pages = pagesLength < 2;

  useRegisterCheck("LessThan2PageCheck", hasLessThan2Pages);

  return (
    LessThan2PageCheck &&
    isChecklistMounted && (
      <ChecklistCard
        title={"Check title"}
        footer={
          <DefaultFooterText>{"Please add more pages"}</DefaultFooterText>
        }
      />
    )
  );
};

export { LessThan2PageCheck };

```

```jsx
import {
  StoryEditor,
  InterfaceSkeleton,
} from "@googleforcreators/story-editor";
import { elementTypes } from '@googleforcreators/element-library';
import { registerElementType } from '@googleforcreators/elements';
import React, { useState } from "react";
import { LessThan2PageCheck } from "./footer/checks";

const CustomDesignChecklist = () => (
  <>
    <LessThan2PageCheck />
  </>
);

const Editor = () => {
  const apiCallbacks = {
    saveStoryById: () => Promise.resolve({}),
  };

  elementTypes.forEach(registerElementType);

  return (
    <StoryEditor config={{ apiCallbacks }} initialEdits={{ story:{} }}>
      <InterfaceSkeleton
        footer={{
          secondaryMenu: {
            checklist: {
              Design: CustomDesignChecklist,
            },
          },
        }}
      />
    </StoryEditor>
  );
};
```

## Sidebar Tabs

### Document Pane

The story editor can have an additional Document pane alongside the Insert and Style panes, which is meant to provide UI elements for editing data about the story as a whole.
The Document pane can be configured as shown below.

```jsx
import {
	StoryEditor,
	InterfaceSkeleton,
} from '@googleforcreators/story-editor';
import { elementTypes } from '@googleforcreators/element-library';
import { registerElementType } from '@googleforcreators/elements';

const CustomDocumentPanel = ()=>(
	<div>
		{" Custom Document Panel "}
	</div>
)

const Editor = () =>{

	const apiCallbacks = {
      saveStoryById: () => Promise.resolve({}),
    };

    elementTypes.forEach(registerElementType);

	return (
    <StoryEditor config={{ apiCallbacks }} initialEdits={{ story }}>
      <InterfaceSkeleton  
        sidebarTabs={{
          document: {
            title: __('Document', 'web-stories'),
            Pane: DocumentPane,
          },
        }}
      />
    </StoryEditor>
	)
}	
```
