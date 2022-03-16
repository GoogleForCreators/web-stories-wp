# Standalone Editor Tutorial

This tutorial shows you how to create a standalone story editor using react that works without any CMS. You will implement the following functionalities while following this tutorial.

- Saving stories to browser's local storage.
- Showing preview of the story created.


## STEP 1: Setting up the editor with minimum config

You can bootstrap your React project using [CRA](https://create-react-app.dev/) or you can do it on your own. Regardless of the method you choose, the next step going to be the same.

Let's start with installing the required dependencies.

```sh
npm install @googleforcreators/story-editor @googleforcreators/design-system @googleforcreators/migration
```

You can use the below code block to scaffold a minimal story editor 

```jsx
import {
  StoryEditor,
  InterfaceSkeleton,
} from "@googleforcreators/story-editor";

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

export default Editor;
```

## STEP 2: Saving stories in browser's local storage

We will now define the API callback `saveStoryById` which is invoked by the editor while saving a story. For details about other API callbacks accepted by the story editor checkout [API Callbacks](../integration-layer-api/api-callbacks.md)

The following code block is given to show an example of how a story can be saved to the browser's local storage.

```jsx
import { DATA_VERSION } from "@googleforcreators/migration";

const saveStoryById = ({
  pages,
  globalStoryStyles,
  currentStoryStyles,
  content,
  title,
}) => {
  const storySaveData = {
    title: {
      raw: title,
    },
    storyData: {
      version: DATA_VERSION,
      pages,
      currentStoryStyles,
    },
    stylePresets: globalStoryStyles,
    permalinkTemplate: "https://example.org/web-stories/%pagename%/",
  };

  window.localStorage.setItem("STORY_CONTENT", JSON.stringify(storySaveData));
  window.localStorage.setItem("STORY_MARKUP", content);

  return Promise.resolve({});
};

export default saveStoryById;


```

Argument to the callback `saveStoryById` is an object which has data about the story (`pages`, `globalStoryStyles`, `currentStoryStyles`) which will be stored in the local storage. Story editor also creates markup for the story with the key `content`, which will also be saved in the local storage and will be used for creating a preview in later sections of the tutorial.

Now let's pass down this callback to the editor and use data stored in local storage to hydrate it.

```jsx
import {
  StoryEditor,
  InterfaceSkeleton,
} from "@googleforcreators/story-editor";
import saveStoryById from "./saveStoryById";

const Editor = () => {
  const apiCallbacks = {
    saveStoryById,
  };

  const content = window.localStorage.getItem("STORY_CONTENT");
  const story = content ? JSON.parse(content) : {};

  return (
    <StoryEditor config={{ apiCallbacks }} initialEdits={{ story }}>
      <InterfaceSkeleton />
    </StoryEditor>
  );
};

export default Editor;
```

## STEP 3: Adding Save Button

Now we can add a save button will call the `saveStoryById` callback defined in the previous step to save story data in local storage.

Code block below shows you how to create a button by using components from `@googleforcreators/design-system`

```jsx
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  useSnackbar,
} from "@googleforcreators/design-system";
import { useStory } from "@googleforcreators/story-editor";

function SaveButton() {
  const { isSaving, saveStory } = useStory(
    ({
      state: {
        meta: { isSaving },
      },
      actions: { saveStory },
    }) => ({
      isSaving,
      saveStory,
    }),
  );

  const { showSnackbar } = useSnackbar();

  const handleSaveButton = () => {
    saveStory().then(() => {
      showSnackbar({
        message: "Story Saved",
      });
    });
  };

  return (
    <Button
      variant={BUTTON_VARIANTS.RECTANGLE}
      type={BUTTON_TYPES.PRIMARY}
      size={BUTTON_SIZES.SMALL}
      onClick={handleSaveButton}
      disabled={isSaving}
    >
      {"Save"}
    </Button>
  );
}

export default SaveButton;

```

- Button Component: In the above code sample we have imported a button component from `@googleforcreators/design-system` and used it to create a button that will be displayed in the Workspace's header. You may also create a custom button, but it is advised to import it from `@googleforcreators/design-system` for design consistency.
	
- `useStory`: A custom hook that exposes functionality to read and manipulate data of the story currently being edited. In the above code sample, a state variable `isSaving` is being used to disable the save button when a story is being saved and `saveStory` action is being used to save the story.

- `useSnackBar`: A custom hook that exposes functionality to use a snack bar in the Story editor. `showSnackBar` action is being used to show the user that a story has been saved.


### Header

Now that we have a save button we can make a header that would be shown on top of the workspace area.
Code sample below implements such header component which will be passed to the story editor and will use the save button.

```jsx
import SaveButton from "./saveButton";

function HeaderLayout() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "1em",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <SaveButton />
        </div>
      </div>
    </div>
  );
}

export default HeaderLayout;

```


Let's pass this header to the editor now.

```jsx
import {
  StoryEditor,
  InterfaceSkeleton,
} from "@googleforcreators/story-editor";
import saveStoryById from "./saveStoryById";
import HeaderLayout from "./header";

const Editor = () => {
  const apiCallbacks = {
    saveStoryById,
  };

  const content = window.localStorage.getItem("STORY_CONTENT");
  const story = content ? JSON.parse(content) : {};

  return (
    <StoryEditor config={{ apiCallbacks }} initialEdits={{ story }}>
      <InterfaceSkeleton header={<HeaderLayout />} />
    </StoryEditor>
  );
};

export default Editor;
```


## STEP 4: Adding Preview button

Similar to the save button added in the previous step now we will add a new button that will open a new tab to show a preview of the story.


```jsx
import { Tooltip, useStory } from "@googleforcreators/story-editor";
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
} from "@googleforcreators/design-system";

function PreviewButton() {
  const { isSaving, saveStory } = useStory(
    ({
      state: {
        meta: { isSaving },
      },
      actions: { saveStory },
    }) => ({
      isSaving,
      saveStory,
    }),
  );

  const openPreviewLink = async () => {
    await saveStory();

    const previewLink = window.origin + "/preview";

    // Start a about:blank popup with waiting message until saving operation
    // is done. That way, we will not bust the popup timeout.
    try {
      const popup = window.open("about:blank", "story-preview");

      if (popup) {
        popup.document.write("<!DOCTYPE html><html><head>");
        popup.document.write("<title>");
        popup.document.write("Generating the preview…");
        popup.document.write("</title>");
        popup.document.write("</head><body>");
        popup.document.write("Please wait. Generating the preview…"); // Output "waiting" message.

        // Force redirect to the preview URL after 5 seconds. The saving tab
        // might get frozen by the browser.
        popup.document.write(
          `<script>
            setTimeout(function() {
              location.replace(${JSON.stringify(previewLink)});
            }, 5000);
          </script>`,
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Tooltip title={"Preview"} hasTail>
      <Button
        variant={BUTTON_VARIANTS.SQUARE}
        type={BUTTON_TYPES.QUATERNARY}
        size={BUTTON_SIZES.SMALL}
        onClick={openPreviewLink}
        disabled={isSaving}
      >
        <Icons.Eye />
      </Button>
    </Tooltip>
  );
}

export default PreviewButton;
```

This new button is very similar to the save button from earlier steps, but it is styled a little differently and uses an icon (`Icons.Eye`) from the story editor's component library rather than some text.

On clicking this button -

- Story data and markup will be stored in the local storage.
- A new tab with some waiting state text will be displayed.
- The new tab will be redirected to preview route after 5 sec

This button then can be added to the header as shown below

```jsx
import SaveButton from "./saveButton";
import PreviewButton from "./previewButton";

function HeaderLayout() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "1em",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <PreviewButton />
          <SaveButton />
        </div>
      </div>
    </div>
  );
}

export default HeaderLayout;
```

A new route has to be introduced which will serve a preview of the story. You can use client-side routing provided in the package [React router](https://reactrouter.com/) or handle your routes server side. 

On this route, simply display story markup which was stored in the browser's local storage by using the callback `saveStoryById` described in step 2.

You can use the following code sample to describe a component which overrides page's HTML with the one in the local storage.

```jsx
import { useEffect } from "@googleforcreators/react";

function Preview() {
  useEffect(() => {
    const content = window.localStorage.getItem("STORY_MARKUP");

    if (content) {
      document.open();
      document.write(content);
      document.close();
    }
  }, []);

  return null;
}

export default Preview;

```

Congratulations! You should now have a working story editor which is capable of saving stories and generating a preview. 


## Next

Story editor packs many more capabilities than the one shown in this tutorial. [Integration Layer API](../integration-layer-api/integration-layer.md) provides comprehensive documentation of Story Editor's integration layer for you to implement your own custom version.
