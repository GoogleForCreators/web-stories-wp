# Getting Started

The following documentation explains how to integrate the visual story editor with any platform. 

The documentation is divided into 3 sections:

- Getting Started - This current doc provides a setup guide to instantiate a story editor with bare minimum functionality and explains significant UI elements of the editor.
- [Standalone Editor Tutorial](./tutorial.md) - A tutorial to create a standalone story editor which works without a CMS.
- [Integration Layer API](./integration-layer.md) - A comprehensive guide on the integration layer of the story editor

## Minimal Setup Guide

You can quickly spin up a story editor in a few steps described below.

### Step 1: Set up a React project

The easiest way of setting up a simple React project is by using [Create React App](https://create-react-app.dev/) or templates such as [react-webpack-babel-starter](https://github.com/vikpe/react-webpack-babel-starter).

### Step 2: Install dependencies

For a minimal story editor, you need to install three packages

```sh
npm install @googleforcreators/story-editor @googleforcreators/element-library @googleforcreators/elements
```

### Step 3: Use the `StoryEditor` component to render the editor

The code sample given below shows how to scaffold a story editor.

```jsx
import { StoryEditor, InterfaceSkeleton } from '@googleforcreators/story-editor';
import { elementTypes } from '@googleforcreators/element-library';
import { registerElementType } from '@googleforcreators/elements';

const Editor = () => {
  const apiCallbacks = {
    saveStoryById: () => Promise.resolve({}),
  };

  elementTypes.forEach(registerElementType);

  return (
    <StoryEditor config={{ apiCallbacks }} initialEdits={{ story: {} }}>
      <InterfaceSkeleton />
    </StoryEditor>
  );
};

export default Editor;
```

Note: You may have to wrap the editor in `<div style={ { height: '100vh' } }>`,  if the parent container doesn't have any height set.

You should now have a story editor that looks like this:

![editor](https://user-images.githubusercontent.com/841956/159525789-9c669dc1-78a4-473b-a30f-6bf0bd72cc8b.png)

To learn more about the individual aspects of the story editor UI and the components it's comprised of, check out the [Web Stories for WordPress user documentation](https://wp.stories.google/docs/) as a reference point.

For a more in-depth example of setting up a custom story editor, check out the more in-depth [Standalone Editor Tutorial](./tutorial.md)
