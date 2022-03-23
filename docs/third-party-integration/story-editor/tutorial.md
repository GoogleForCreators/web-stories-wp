# Standalone Editor Tutorial

This tutorial explains how to create a standalone story editor using React that works without any CMS. It encompasses saving stories to the browser's local storage as well as previewing created stories.

## Step 1: Setting up the editor with minimum config

You can bootstrap your React project using something like [Create React App](https://create-react-app.dev/) or similar.

Let's start with installing the required dependencies.

```sh
npm install @googleforcreators/story-editor @googleforcreators/design-system @googleforcreators/migration
```

The following code block scaffolds a minimal story editor:

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

## Step 2: Saving stories in local storage

We will now define the API callback `saveStoryById` which is invoked by the editor while saving a story.

For details about other API callbacks accepted by the story editor, check out the [API Callbacks](./api-callbacks.md) section.

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

The `saveStoryById` callback expects an object which has data about the story (`pages`, `globalStoryStyles`, `currentStoryStyles`) which will be stored in the local storage. Story editor also creates markup for the story with the key `content`, which will also be saved in the local storage and will be used for creating a preview in later sections of the tutorial.

Now let's pass down this callback to the editor and use the data stored in local storage to hydrate it.

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

## Step 3: Adding Save Button

Now we can add a Save button which will call the `saveStoryById` callback from the previous step in order to save story data in local storage.

The following code shows how to accomplish that by using components from `@googleforcreators/design-system`:

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

In the above code, `useStory` is a custom hook that exposes functionality to read and manipulate data of the story currently being edited. A state variable `isSaving` is being used to disable the save button when a story is being saved and the `saveStory` action is being used to actually save the story.

The `useSnackBar` hook exposes a `showSnackBar` action to display a snackbar message in the editor.

### Header

Now that we have a Save button, we can display it in the editor in a dedicated header area shown at the top of the workspace area.

Here is how such a header component can be passed to the story editor in order to display the Save button:

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

Passing the component to the editor:

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

## Step 4: Adding Preview button

Similar to the Save button in the previous step, we can add a new button that will open a new tab with the preview of a story.

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

This new button is very similar to the Save button, but it is styled a little differently and uses an icon (`Icons.Eye`) from the component library rather than a text label.

Clicking this button will:

1. Store the story data and markup in local storage.
2. Open a new tab with some loading state text.
3. Redirect to the preview once the preview has been generated, or after a given timeout is reached.

This button can then be displayed in the header area next to the Save button.

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

A new route has to be introduced which will serve a preview of the story, for example using [React Router](https://reactrouter.com/) or a server-side solution. 

On this route, simply display story markup which was previously stored in the browser's local storage using `saveStoryById`.

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

This is it! You should now have a working story editor which is capable of saving stories and generating a preview. 

Check out the [Integration Layer API](./integration-layer.md) for a comprehensive documentation of the story editor's integration layer if you want to implement your own custom version.
