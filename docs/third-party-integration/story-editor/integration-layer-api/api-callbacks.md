# API Callbacks

Side effects are added to the Story Editor by defining callbacks. One such callback is `saveStoryById` which is used to save stories and is the only required callback. Other callbacks can be used to add or handle functionalities like first-party media and custom page templates etc. All API callbacks can be asynchronous and should eventually resolve to their corresponding expected responses.

Below is a list of available api callbacks categorised in different sections.



## Story Editing

### `saveStoryById`

The only required callback, that is used for saving stories.

Arguments

- `storyState`  :
    - type: `Object`
    - description: The current state of the story. The required shape of the object is described in the table below.
        - `storyId`
            - type: `number`
            - description: Unique id for the story.

        - `title`
            - type: `string`
            - description:  Tittle of the story.

        - `excerpt`
            - type: `string`
            - description:  Short description of the story.

        - `version`
            - type: `number`
            - description:  Version of the story saved ( latest is `DATA_VERSION` from @googleforcreators/migration).

        - `currentStoryStyles`
            - type: `Object`
            - description:  Saved styles available the current story (`colors`).

        - `globalStoryStyles`
            - type: `Object`
            - description:  Saved styles available to all stories (`colors` & `textStyles`).

        - `pages`
            - type: `array<Page>`
            - description: Array of page objects in the story. See [page object shape](#page-object-shape)

#### Page object shape

- `elements`
    - type: `array<Element>`
    - description: Array of elements in this page.

- `backgroundColor`
    - type: `Object`
    - description: Background color of this page.
        - `color`
            - type: `Object`
                - `r`
                    - type: `number`
                    - description: Red value.
                - `g`
                    - type: `number`
                    - description: Blue value.
                - `b`
                    - type: `number`
                    - description: Green value.
            

- `type`
    - type: `string`
    - description: Page type.

- `id`
    - type: `string`
    - description: Unique id for this page.


Expected response

An `Object` with the following shape

`storyId`

- type: `number`
- required: No
- description: Unique id for the story.

`title`

- type: `string`
- required: No
- description: Short description of the story.

`excerpt`

- type: `string`
- require: No
- description: Short description of the story.

`version`

- type: `number`
- require:  No
- description: Version of the story saved.

`currentStoryStyles`

- type: `Object`
- require: No
- description: Saved styles available in the current story (`colors`).

`globalStoryStyles`

- type: `Object`
- require: No
- description: Saved styles available to all stories (`colors` & `textStyles`).

`pages`

- type: `array<Page>`
- require: No
- description: Array of page objects in the story. See [page object shape](#page-object-shape) for more details.



Example ( Expected response )

```json
{
  "storyId": 1,
  "title": "Epic story",
  "excerpt": "A totally epic story",
  "version" : 39,
  "currentStoryStyles": {
      "colors": []
    },
    "globalStoryStyles": {
        "textStyles": [],
        "colors": []
    },
    "pages" :[]
}
```



### `getStoryById`

Fallback of `initialEdits` prop of `StoryEditor` component. If `initialEdits` prop is undefined, this callback will be used to populate the initial story.

Arguments

- `storyId` :
    - type: `number `
    - description: Unique id of a story that needs to be loaded.


Expected response

`title`

- type: `Object`
- required: No
- description: Tittle of the story.

`excerpt`

- type: `Object`
- required: No
- description: Story data.

`storyData`

- type: `Object`
- required: No
- description: Story data.

`author`

- type: `Object`
- required: No
- description: Details of author who created the story.
    - `id`
        - type: `number`
        - required: Yes
        - description: Author id.
    - `name`
        - type: `string
        - required: Yes
        - description: Author name.

`stylePresets`

- type: `Object`
- required: No
- description: Saved style Presets.



Example ( Expected response )

```json
{
    "title": {
      "raw": "Epic story",
    },
    "excerpt": {
      "raw": "A totally epic story",
    },
    "storyData": {
      "version": 39,
      "pages": [],
      "autoAdvance": true,
      "defaultPageDuration": 7,
      "currentStoryStyles": {},
      "backgroundAudio": {},
    },
    "author": {
      "id": 1,
      "name": "John Doe",
    },
    "stylePresets": {
        "colors": [],
        "textStyles": []
    },
  };
```

## Custom Page Templates

In the element library, there is a section for page templates, by default it only serves pre-built templates. You can enable users to save and use their own custom page templates by defining these 3 callbacks.

### `getCustomPageTemplates`

For fetching custom page templates.

Arguments

- `page` :
  
    - type: `number `
    - description: Page number for a set of template.


Expected response

An array of the template objects whose shape is described below.

#### Template object shape

`templateId`

- type: `number`
- required: Yes
- description: Template id.

`version`

- type: `string`
- required: Version of the story shape used ( `DATA_VERSION` )
- description: Details of author who created the story.

`elements`

- type: `array<element>`
- required: Yes
- description: Array of elements used in the template. See [element object](#element-object-shape).


`backgroundColor`

- type: `Object`
- required: Yes
- description: Background color RGB values.

`type`

- type: `string`
- required: Yes
- description: Template type.

`id`

- type: `string`
- required: Yes
- description: Page id.

`image`

- type: `Object`
- required: Yes
- description: Placeholder image data.
    -`id`
        - type: `string`
        - required: Yes
        - description: Image id.
    -`height`
        - type: `string`
        - required: Yes
        - description: Height of the placeholder image.
    -`width`
        - type: `string`
        - required: Yes
        - description: Width of the placeholder image.
    -`url`
        - type: `string`
        - required: Yes
        - description: Link to the placeholder image.

#### Element object shape

- `opacity`
    - type: `number`
    - description: Opacity of element in percent.

- `flip`
    - type: `Object`
    - description: Flip data of element.
        - `vertical`
            - type: `boolean`
            - description: Vertical flip.
        - `horizontal`
            - type: `boolean`
            - description: horizontal flip.

- `rotationAngle`
    - type: `number`
    - description: Rotation angle of the element.

- `lockAspectRatio`
    - type: `boolean`
    - description: Flag to lock aspect ratio.

- `scale`
    - type: `number`
    - description: Scale of element in percent.

- `focalX`
    - type: `number`
    - description: X focal point in percent.

- `focalY`
    - type: `number`
    - description: Y focal point in percent.

- `resource`
    - type: `Object`
    - description: Element resource data.

- `type`
    - type: `string`
    - description: Element type.

- `x`
    - type: `number`
    - description: X coordinate of the element on canvas in pixels.

- `y`
    - type: `number`
    - description: Y coordinate of the element on canvas in pixels.

- `width`
    - type: `number`
    - description: Width coordinate of the element in pixels.

- `height`
    - type: `number`
    - description: Height coordinate of the element in pixels.

- `mask`
    - type: `Object`
    - description: Details about mask over the element.
        - `type`
            - type: `string`
            - description: Mask type.
        - `showInLibrary`
            - type: `boolean`
            - description: 
        - `name`
            - type: `string`
            - description: Mask name.
        - `path`
            - type: `string`
            - description: Mask path.
        - `ratio`
            - type: `number`
            - description: Mask ratio.
        - `supportsBorder`
            - type: `boolean`
            - description: 

- `id`
    - type: `string`
    - description: Unique id for this element.




Example ( Expected response )

```json
{
    "templateId": 358,
    "version": 39,
    "elements": [],
    "backgroundColor": {
        "color": {
            "r": 255,
            "g": 255,
            "b": 255
        }
    },
    "type": "page",
    "id": "0d009686-a8d7-4cd9-a076-80e3e56efb68",
    "image": {
        "id": 0,
        "height": 0,
        "width": 0,
        "url": "https://url-to-image"
    }
}
```



### `addPageTemplate`

For adding custom page templates.

Arguments

- `template` :
    - type: `Object`
    - description: See [Template Object Shape](#template-object-shape) for object shape.


Expected response

- `void`

### `deletePageTemplate`

For deleting custom page templates.

Arguments

- `templateId` :
    - type: `number`
    - description: Template Id.


Expected response

- `void`

## First party Media Support

Adding usage of first-party media for the user includes defining a few callbacks listed below and a component `MediaUpload`

### `getMedia`

Fetches first-party media in the element library.

Arguments

- `params` :
    - type: `Object`
    - description: Describes search or filter parameters which includes `mediaType`, `searchTerm`& `pagingNum`
    - `mediaType`
        - type: `string`
        - description: Media type requested by the user. One of `image`, `video` or `gif`
    - `searchTerm`
        - type: `string`
        - description: Search string enter by the user.
    - `pagingNum`
        - type: `string`
        - description: Page number


Expected response

- An array of **Media Object**

#### Media Object Shape

- `baseColor` :

    - type: `string`
    - required: No
    - description: Dominant color in hexadecimal format.

- `blurHash` :

    - type: `string`
    - required: No
    - description: Blur hash string of the media.

- `type` :

    - type: `string`
    - required: Yes
    - description: Type of media object. One of `image`, `video` or `gif`.

- `mimeType` :

    - type: `string`
    - required: Yes
    - description: Media mime type.

- `creationDate` :

    - type: `string`
    - required: No
    - description: Media creation date in UTC format.

- `src` :

    - type: `string`
    - required: Yes
    - description: Media source URL.

- `width` :

    - type: `number`
    - required: Yes
    - description: Media width in pixels.

- `height` :

    - type: `number`
    - required: Yes
    - description: Media height in pixels.

- `id` :

    - type: `number`
    - required: Yes
    - description: Media id

- `alt` :

    - type: `string`
    - required: No
    - description: Media Alt text

- `sizes` :

    - type: `Object`
    - required: Yes
    - description: Map of media in various sizes (thumbnail, medium, full).
        - `file`
            - type: `string`
            - required: Yes
            - description: Width of this particular size.
        - `width`
            - type: `number`
            - required: Yes
            - description: Width of this particular size.
        - `height`
            - type: `number`
            - required: Yes
            - description: Height of this particular size.
        - `mimeType`
            - type: `string`
            - required: Yes
            - description: Mime type of this particular size.
        - `sourceURL`
            - type: `string`
            - required: Yes
            - description: Link for this particular size.

- `isPlaceholder` :

    - type: `boolean`
    - required: No
    - description: Flag to denote if media is placeholder image.

- `isOptimized` :

    - type: `boolean`
    - required: No
    - description: Flag to denote if media is optimized.

- `isMuted` :

    - type: `boolean`
    - required: No
    - description: Flag to denote if media is muted.

- `isExternal` :

    - type: `boolean`
    - required: No
    - description: Flag to denote if media is external.

- `needsProxy` :

    - type: `boolean`
    - required: No
    - description: Flag to denote getting media requires proxy.



Example ( Expected response )

```json
{
    "baseColor": "#ffffff",
    "blurHash": "UmJ*SDxtIVWB~VayRkj[M|Rkj[ofM|WBWBay",
    "type": "image",
    "mimeType": "image/jpeg",
    "creationDate": "2022-02-08T11:13:06",
    "src": "http://webstories.local/wp-content/uploads/2022/02/laptop_man.jpg",
    "width": 367,
    "height": 267,
    "id": 251,
    "alt": "laptop_man",
    "sizes": {
        "medium": {
            "file": "laptop_man-300x218.jpg",
            "width": 300,
            "height": 218,
            "mimeType": "image/jpeg",
            "sourceUrl": "http://webstories.local/wp-content/uploads/2022/02/laptop_man-300x218.jpg"
        },
        "thumbnail": {
            "file": "laptop_man-150x150.jpg",
            "width": 150,
            "height": 150,
            "mimeType": "image/jpeg",
            "sourceUrl": "http://webstories.local/wp-content/uploads/2022/02/laptop_man-150x150.jpg"
        },
        "full": {
            "file": "laptop_man.jpg",
            "width": 367,
            "height": 267,
            "mimeType": "image/jpeg",
            "sourceUrl": "http://webstories.local/wp-content/uploads/2022/02/laptop_man.jpg"
        }
    },
    "isPlaceholder": false,
    "isOptimized": false,
    "isMuted": false,
    "isExternal": false,
    "needsProxy": false
}
```

### `getMediaById`

Used to get media for video trim functionality

Arguments

- `id` :
    - type: `number`
    - description: Media id.

Expected response

- **Media Object** (see [Media Object Shape](#media-object-shape))

### `getMutedMediaById`

Used to get muted version of a video

Arguments

- `id` :
    - type: `number`
    - description: Media id.

Expected response

- **Media Object** (see [Media Object Shape](#media-object-shape))

### `getOptimizedMediaById`

Used to get optimized version of a video

Arguments

- `id` :
    - type: `number`
    - description: Media id.

Expected response

- **Media Object** (see [Media Object Shape](#media-object-shape))

### `updateMedia`

Story editor calculates and updates data about media element stored in the back-end using these callbacks. Users can also update data if required interface is added. Out of the box users can only update `altText`

Arguments

- `id` :
    - type: `number`
    - description: Media id.

- `data` :
    - type: `Object`
    - description: Updated data of a media object.
        - `posterId` :
            - type: `number`
            - description: Id of the poster image element of this media element.

        - `storyId` :
            - type: `number`
            - description: Id of the story in which a video element's poster was generated.

        - `isMuted` :
            - type: `boolean`
            - description: Flag to identify if this element has audio.

        - `mutedId` :
            - type: `number`
            - description: Id of the muted version of this media element.

        - `mediaSource` :
            - type: `string`
            - description: Source from which the media was uploaded. One of `source-image`, `source-video`.

        - `optimizedId` :
            - type: `number`
            - description: Id of optimized version of this media element.

        - `altText` :
            - type: `string`
            - description: Alt text for media.

        - `baseColor` :
            - type: `string`
            - description: Calculated base color (most prominent color) for media element.

        - `blurHash` :
            - type: `string`
            - description: Calculated blur hash string for media element.

Expected response

- `void`

### `uploadMedia`

Called when editor uploads -

- Poster image for a video.
- Poster image for a story.
- Poster image for a template.
- Altered media (muted, trimmed, optimized or converted to GIF)

After uploading altered media Story editor calls `updateMedia` to update original version of altered media.

Arguments

- `file` :
    - type: `blob`
    - description: Media File to upload.

- `data` :
    - type: `Object`
    - description: Updated data of a media object.
        - `originalId` :
            - type: `number`
            - description: Id of a media of which this element is an altered version of.

        - `mediaId` :
            - type: `number`
            - description: Id of a video of which this element is a poster.

        - `storyId` :
            - type: `number`
            - description: Id of a story of which this element is a poster.

        - `templateId` :
            - type: `number`
            - description: Id of a template of which this element is a poster.

        - `isMuted` :
            - type: `boolean`
            - description: flag to identify if this element has audio.

        - `mediaSource` :
            - type: `string`
            - description: Upload source. One of `video-optimization`, `editor`, `poster-generation`,`gif-conversion`or `page-template`.

        - `trimData` :
            - type: `Object`
            - description: `TrimData` data object linking a trimmed video to its original.

        - `baseColor` :
            - type: `string`
            - description: Calculated base color (most prominent color) for media element.

        - `blurHash` :
            - type: `string`
            - description: Calculated blur hash string for media element.

Expected response

- `null`

### `deleteMedia`

For deleting any media

Arguments

- `id` :
    - type: `number`
    - description: Id of a media element which needs to be deleted.

Expected response

- `null`

### `MediaUpload` component

`MediaUpload` component is a modal rendered which will be used to render media upload button and open a media upload modal when a user instantiates a media upload by clicking previously mentioned button.
This modal should provide the user to insert any media already with the CMS or upload new items.

- `title` :
    - type: `string`
    - required: No
    - description: Title for the modal.

- `buttonInsertText` :
    - type: `string`
    - required: No
    - description: Text to use for the "Insert" button.

- `onSelect` :
    - type: `function`
    - required: Yes
    - description: Selection callback. Used to process the inserted image.

- `onSelectErrorMessage` :
    - type: `function`
    - required: Yes
    - description: Text displayed when incorrect file type is selected.

- `onClose` :
    - type: `function`
    - required: Yes
    - description: Modal close callback.

- `onPermissionError` :
    - type: `function`
    - required: No
    - description: Callback for when user does not have upload permissions.

- `type` :
    - type: `array<string>`
    - required: Yes
    - description: Array of allowed mime types modal should present or accept when a user uploads a new file.

- `multiple` :
    - type: `boolean`
    - required: No
    - description: Whether multi-selection should be allowed.

- `cropParams` :
    - type: `Object`
    - required: No
    - description: Width and height for cropped images.

- `render` :
    - type: `function`
    - required: Yes
    - description: React functional component responsible for rendering required media upload button. Takes a callback which should instantiate the modal for media upload.


```jsx
function MediaUpload({
  buttonInsertText,
  onSelect,
  onSelectErrorMessage,
  onClose,
  onPermissionError,
  type,
  multiple,
  cropParams,
  render,
}) {
  const openModal = () =>{
    // routine to open modal
    // this modal will call callbacks passed to MediaUpload according to the context.
  }

  return render(openModal);
}
```



## Adding Custom Fonts

Customize the Story editor for users to use with custom fonts.

### `getFonts`

 Used to get fonts

Arguments

- `params`
    - type: `Object`
    - description: Filter parameters for fetching fonts.
        - `search`
            - type: `string`
            - description: Search string entered by the user.
        - `service`
            - type: `string`
            - description: One of `builtin` or `custom`.
        - `include`
            - type: `string`
            - description: Comma separated names for font in the curated list.


Expected response

- Array of **Font Object**

#### Font Object Shape

- `id`
    - type: `string`
    - required: No
    - description: Unique id of the font.

- `name`
    - type: `string`
    - required: No
    - description: Name of the font.

- `value`
    - type: `string`
    - required: No
    - description: 

- `family`
    - type: `string`
    - required: Yes
    - description: Family of the font.

- `fallbacks`
    - type: `array<string>`
    - required: No
    - description: Array of fallback font names.

- `weights`
    - type: `array<number>`
    - required: No
    - description: Array of available font weight.

- `variants`
    - type: `array<array<number>>`
    - required: No
    - description: Array of variant tuple.

- `service`
    - type: `string`
    - required: Yes
    - description: URL to font service which hosts the font.

- `metrics`
    - type: `Object`
    - required: No
    - description: Font metrics.


Example ( Expected response )

```json
{
    "id": "Alegreya",
    "name": "Alegreya",
    "value": "Alegreya",
    "family": "Alegreya",
    "fallbacks": [
        "serif"
    ],
    "weights": [
        400,
    ],
    "styles": [
        "regular",
        "italic"
    ],
    "variants": [
        [0,400],
    ],
    "service": "fonts.google.com",
    "metrics": {
        "upm": 1000,
        "asc": 1016,
        "des": -345,
        "tAsc": 1016,
        "tDes": -345,
        "tLGap": 0,
        "wAsc": 1123,
        "wDes": 345,
        "xH": 452,
        "capH": 637,
        "yMin": -293,
        "yMax": 962,
        "hAsc": 1016,
        "hDes": -345,
        "lGap": 0
    }
}
```



## Hot linking media

Customize the Story editor for users to hotlink media with links rather than uploading files.

### `getHotlinkInfo`

Used to get data about links while hot linking media in media pane.

Arguments

- `url` 
    - type:`string` 
    - description: External link.

Expected response

- `ext` 
    - type:`string` 
    - required: Yes
    - description: File extension.

- `mimeType` 
    - type:`string`
    - required: Yes
    - description: File mime type.

- `type` 
    - type:`string`
    - required: Yes 
    - description: File type. One of `image` or `video`.

- `fileName` 
    - type:`string`
    - required: Yes 
    - description: File name.

Example ( Expected response )

```json
{
    "ext": "jpg",
    "mimeType": "image/jpeg",
    "type":"image",
    "fileName": "file_name.jpg"
}
```

## Adding Links to story elements

Links can be added to any elements in the Story editor through design panel with only requirement being defining the callback `getLinkMetadata`

### `getLinkMetadata`

Arguments

- `url` 
    - type: `string`
    - description: External Link.


Expected response

- `title` 
    - type: `string`
    - required: Yes
    - description: OG title.

- `icon` 
    - type: `string`
    - required: Yes
    - description: OG image.

Example ( Expected response )

```json
{
    "title": "link to external",
    "icon": "https://link-to-icon",
}
```

## Adding user capabilities

Caters Story editor with different capabilities on per-user basis

### `getCurrentUser`

Fetch details about the current user.

Arguments

None

Expected response

- `id` 
    - type: `number`
    - required: Yes
    - description: Current user id.

- `trackingOptin` 
    - type: `boolean`
    - required: Yes
    - description: Flag to know if the user has opted in for tracking.

- `onboarding` 
    - type: `boolean`
    - required: Yes
    - description: Flag to know if the user needs to be shown onboarding.

- `mediaOptimization` 
    - type: `boolean`
    - required: Yes
    - description: Flag to know if the user can upload optimized media.


Example ( Expected response )

```json
{
    "id": 1,
    "trackingOptin": true,
    "onboarding": false,
    "mediaOptimization": true,
}
```

### `updateCurrentUser`

Update details about the current user.

Arguments

- `id` 
    - type: `number`
    - description: User Id.

- `data` 
    - type: `Object`
    - description: Data to be updated.
        - `trackingOptin` 
            - type: `boolean`
            - description: Flag to know if the user has opted in for tracking.
        - `onboarding` 
            - type: `boolean`
            - description: Flag to know if the user needs to be shown onboarding.
        - `mediaOptimization` 
            - type: `boolean`
            - description: Flag to know if the user can upload optimized media.

Expected response

- `null`

