# Integration Layer

Story editor can be integrated with any platform by configuring the `StoryEditor` and other components like `InterfaceSkeleton`. This section of the documentation gives a comprehensive guide on what aspects of the story editor can be modified and how to modify them.

As seen in the getting started guide, a minimal story editor can be created by using the two main components  `StoryEditor` and `InterfaceSkeleton`  like below.

```js
import { StoryEditor, InterfaceSkeleton } from '@googleforcreators/story-editor';

const Editor = () => {
  const apiCallbacks = {
    saveStoryById: () => Promise.resolve({}),
  };

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
    - type: `object`
    - required: Yes
    - description: Used for most of the editor configuration. See the Editor Config section below for full detail.

- `initialEdits`
    - type: `object`
    - required: Yes
    - description: The initial edits/state of the story editor. Currently it only supports `story`.
        - `story`
            - type: `object`
            - required: Yes
            - description: The story editor needs initial story when it loads. You can either provide the initial story object from this prop or via `getStoryById` API callback. See the expected response of `getStoryById` for the shape of this object.



## `InterfaceSkeleton`

This component is responsible for rendering the story editor interface UI and can be configured by using multiple props. Please look at the `InterfaceSkeleton` section below for detailed documentation of this component.

**Props:**

- `header`
    - type: `React.ReactElement`
    - required: No
    - description: Used for rendering the workspace header. See workspace section of getting started guide to get the definition of header.

- `footer`
    - type: `object`
    - required: No
    - description: Used for rendering some parts of the footer. See workspace section of getting started guide for the definition of footer.

- `inspectorTabs`
    - type: `object`
    - required: No
    - description: Used for rendering the inspector tabs of the story editor. See workspace section of getting started guide for the definition of inspector tabs.



## Editor Config

To configure the editor to your needs you can pass various config options to the story editor via `config` prop of the `StoryEditor` component.

### `apiCallbacks`

- type : `object`
- description : Takes various callback functions for story editor's side effects. The only required API callback is `saveStoryById`. For detailed documentation of `apiCallbacks`,  see [API Callbacks](./API-Callbacks.md) section.



### `additionalTips` 

- type : `array`
- description : Used to provide additional tips in editor help center 
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

### `allowedFileTypes`

- type : `array`
- description : An array of file extensions accepted by element library.
- example :

```js
const allowedFileTypes = ['jpeg','mp4'];
```

### `allowedMimeTypes` 

- type : `object`
- description : A map of file mime types accepted by element library.
- example :

```js
const allowedMimeTypes = {
	image: [
            "image/webp",
            "image/png",
        ],
	"audio": [],
	"video": []
};
```

### `allowedAudioFileTypes`

- type : `array`
- description : An array of file extensions accepted in the design panel.
- example :

```js
const allowedAudioFileTypes = ['aac', 'wav'];
```

### `allowedAudioMimeTypes`

- type: `array`
- description : An array of file mime-types accepted in the design panel.
- example :

```js
const allowedAudioMimeTypes = ['audio/aac', 'audio/wav'];
```

### `allowedImageFileTypes`

- type : `array`
- description : An array of file extensions accepted in the design panel. Generates a message if incorrect file type is uploaded.
- example :

```js
const allowedFileTypes = ['jpeg','png'];
```

### `allowedImageMimeTypes` 

- type : `array`
- description : An array of file mime types accepted in the design panel.
- example :

```js
const allowedFileTypes = ['image/jpeg', 'image/png'];
```

### `allowedTranscodableMimeTypes` 

- type : `array`
- description : An array of mime types which can be transcoded
- example :

```js
const allowedTranscodableMimeTypes = [
	"video/3gpp",
    "video/3gpp2",
    "video/MP2T",
]
```

### `autoSaveInterval`

- type : `number`
- description : Time Interval (in seconds) after which story editor automatically saves a story by calling `saveStoryById`.

### `canViewDefaultTemplates`

- type : `boolean`
- description : flag to allow for enabling default page template

### `capabilities`

- type : `object`
- description : Controls story editor's capabilities, currently 2 capabilities can be customized
    - `hasMediaUploadAction`
        - type: `boolean`
        - description: Allow media upload
    - `canManageSettings`
        - type: `boolean`
        - description: Allow visiting settings page on the dashboard
- example :

```js
const capabilities = {
	"hasUploadMediaAction": true,
	"canManageSettings": true
}
```

### `cdnURL`

- type : `string`
- description : URL to element resources.

### `dashboardLink`

- type : `string`
- description : URL to story editor's dashboard.

### `encodeMarkup`

- type : `boolean`
- description : Flag to toggle markup generation in story data.

### `ffmpegCoreUrl`

- type: `string`
- description : URL to `ffmpeg` core required for optimizing uploaded media.

### `flags`

- type : `object`
- description : Many experimental features can be enabled/disabled in the story editor. Below is a list of all feature flags.
    - `enableSVG`
        - type: `boolean`
        - description: Enables SVG support in link icons.
    - `customFonts`
        - type: `boolean`
        - description: Enables custom fonts in rich text elements.
    - `enableExperimentalAnimationEffects`
        - type: `boolean`
        - description: Enables experimental animations effects.
    - `showElementsTab`
        - type: `boolean`
        - description: Adds new custom element pane to elements library.
    - `incrementalSearchDebounceMedia`
        - type: `boolean`
        - description: Enables debouncing while searching first party or third party media.
    - `enablePostLockingTakeOver`
        - type: `boolean`
        - description: Lock in-progress stories from being edited by other authors.
    - `enableUpdatedPublishStoryModal`
        - type: `boolean`
        - description: Enable new pre-publish confirmation modal.
    - `enableHotlinking`
        - type: `boolean`
        - description: Enables hot-linking media using external URLs.
    - `enableVideoTrim`
        - type: `boolean`
        - description: Enables functionality to trim videos.
    - `enableThumbnailCaching`
        - type: `boolean`
        - description: Enable thumbnail caching.
    - `enhancedPageBackgroundAudio`
        - type: `boolean`
        - description: Enable adding captions to background audio.
    - `floatingMenu`
        - type: `boolean`
        - description: Enable the new floating design menu.
    - `semanticHeadingTags`
        - type: `boolean`
        - description: Automatically use semantic heading tags for text elements.
    - `libraryTextStyles`
        - type: `boolean`
        - description: Allow inserting/applying Saved Styles from Text Library.

### `generalSettingsLink`

- type : `string`
- description : URL for settings page of the dashboard

### `isRTL`

- type : `boolean`
- description : switches all styles to accommodate RTL languages.

### `locale`

- type : `object`
- description : locale data 
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

- type : `number`
- description : Size limit on uploaded media in bytes.

### `MediaUpload`

- type : `React.ReactElement`
- description : React component used for rendering media upload modal. See [First party Media Support](./API-Callbacks.md#First-party-Media-Support)

### `showMedia3p`

- type : `boolean`
- description : to enable or disable third party media usage.

### `storyId`

- type : `number`
- description : ID of the current story being rendered by the editor.

### `styleConstants`

- type : `object`
- description : Style constants for story editor modals.
    - `topOffset`
        - type: `number`
        - description: Top offset for modal overlay.
    - `leftOffset`
        - type: `number`
        - description: Left offset for modal overlay.

## InterfaceSkeleton

Many aspects of the editor can be customized by adding custom components through A component called `InterfaceSkeleton` from `@googleforCreators/story-editor`. This section will give details about what aspects of the story editor can be modified by custom components.
Before reading this you might want to check out [Getting Started](../Getting-Started/Getting-Started.md) to know about different visual components of the editor.

## Workspace

### Header 

Editor Workspace has reserved space to render a custom header. This can be used to provide custom UI elements for users to interact with. 
Although you can use custom UI elements in the header, it is advised to use elements provided in `@googleForCreators/design-system`. That will guarantee design consistency and compatibility with the `RTL` layout.

An example use case is available in [Standalone Editor Tutorial](./standalone-editor-tutorial/standalone-editor-tutorial.md) where a few buttons have been added to the header.

```jsx
import {
  StoryEditor,
  InterfaceSkeleton,
} from "@googleforcreators/story-editor";
import React, { useState } from "react";

const CustomHeader = () => (
  <div style={{ height: `100px`, width: "100%", backgroundColor: "red" }}>
    {" Custom Header "}
  </div>
);

const App = () => {
  const [story, setStory] = useState({});

  const apiCallbacks = {
    saveStoryById: (story) => {
      setStory(story);
      return Promise.resolve();
    },
  };

  return (
    <div style={{ height: "100vh" }}>
      <StoryEditor config={{ apiCallbacks }} initialEdits={{ story }}>
        <InterfaceSkeleton header={<CustomHeader />} />
      </StoryEditor>
    </div>
  );
};

export default App;
```


### Footer 

Editor workspace also has a footer space, but unlike header space, this can only be partially modified. Modifications include adding a footer to the Help center Menu and adding a pre-publish checklist.

### Adding a footer to Help Center

Adding a footer to the help center is straightforward, just pass a component to the component as shown below.

```jsx
import {
  StoryEditor,
  InterfaceSkeleton,
} from "@googleforcreators/story-editor";
import React, { useState } from "react";

const CustomFooter = () => <div>{" Custom Help Center Footer "}</div>;

const App = () => {
  const [story, setStory] = useState({});

  const apiCallbacks = {
    saveStoryById: (story) => {
      setStory(story);
      return Promise.resolve();
    },
  };

  return (
    <div style={{ height: "100vh" }}>
      <StoryEditor config={{ apiCallbacks }} initialEdits={{ story }}>
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
export default App;
```

### Adding a pre-publish checklist

You can also initialize a checklist for the user to see after they are done creating a story. There are many pre-built checks in `@googleForCreators/story-editor` for you to use. Also, you can create your own checks as shown in the later parts of this section.

Story editor accepts 3 categories of checks, below is the list of all categories with corresponding pre-built checks available for initializing the checklist.

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

### Using pre-built checks

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
import React, { useState } from "react";
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

const App = () => {
  const [story, setStory] = useState({});

  const apiCallbacks = {
    saveStoryById: (story) => {
      setStory(story);
      return Promise.resolve();
    },
  };

  return (
    <StoryEditor config={{ apiCallbacks }} initialEdits={{ story }}>
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
export default App;
```

### Implementing a custom check

Below is an example of a check, this check will pop up in the checklist if story has less than 2 pages.

```jsx
import {
  ChecklistCard,
  DefaultFooterText,
  useRegisterCheck,
  useIsChecklistMounted,
  useStory,
} from "@googleforcreators/story-editor";
import React from "react";

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
import React, { useState } from "react";
import { LessThan2PageCheck } from "./footer/checks";

const CustomDesignChecklist = () => (
  <>
    <LessThan2PageCheck />
  </>
);

const App = () => {
  const [story, setStory] = useState({});

  const apiCallbacks = {
    saveStoryById: (story) => {
      setStory(story);
      return Promise.resolve();
    },
  };

  return (
    <StoryEditor config={{ apiCallbacks }} initialEdits={{ story }}>
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

export default App;

```

## Inspector tabs

### Document Pane

Story editor can have an additional document pane alongside the design pane, which is meant to provide UI elements for editing data about the story as a whole.
Document Pane can be configured as shown below.

```jsx
import {
	StoryEditor,
	InterfaceSkeleton,
} from '@googleforcreators/story-editor';

import { useState } from '@googleforcreators/react';

const CustomDocumentPanel = ()=>(
	<div>
		{" Custom Document Panel "}
	</div>
)

const CustomEditor = () =>{

	const [story,setStory] = useState({});

	const apiCallbacks = {
		saveStoryById: (story) =>{
			setStory(story);
			return Promise.resolve()
		}
	}

	return (
    <StoryEditor config={{ apiCallbacks }} initialEdits={{ story }}>
      <InterfaceSkeleton  
        inspectorTabs={{
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
