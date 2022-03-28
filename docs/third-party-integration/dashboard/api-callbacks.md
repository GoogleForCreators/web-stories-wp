# API Callbacks

Side effects are added to the Dashboard by defining callbacks. One such callback is `fetchStories` which is used to get stories from the backend and is the only required callback.
Other callbacks can be used to add or handle functionalities for story management.

All API callbacks are asynchronous and should eventually resolve to their corresponding expected responses.

Below is a list of available API callbacks categorized in different sections.

## Story Management

A set of callbacks that help in performing create, update, delete and read operations on web stories stored in the CMS.

### `fetchStories`

A callback which fetches stories to be shown in the dashboard.

Arguments

- `queryParams`
    - type: `Object`
    - description: An object which contains the query parameters.
        - `status`
            - type: `string`
            - description: Status of a story. One of `draft`, `pending`, `public`, `future` or `private`.
        - `searchTerm`
            - type: `string`
            - description: Search string.

        - `sortOption`
            - type: `string`
            - description: User selected option from a dropdown. Sort by `title`,`date`,`date` or `story_author`.

        - `sortDirection`
            - type: `string`
            - description: Sort order. One of `asc` or `desc`.

        - `author`
            - type: `string`
            - description: Author name.

Expected Response:

An `Object` with the following shape.

`fetchedStoryIds`

- type: `array<number>`
- required: Yes
- description: An array of story id's corresponding to the order of the stories to be shown in the dashboard. 

`stories`

- type: `Object`
- required: Yes
- description:  Object consisting of story details of each story, where story-id is the key and [story object](#story-shape-object) is the value.
  

`totalPages`

- type: `number`
- required: Yes
- description: Total number of pages.

`totalStoriesByStatus`

- type: `Object`
- required: Yes
- description: A map with data about how many stories have a particular status.



### Story Shape Object

- `author`
    - type: `Object`
    - required: No
    - description: Name and id of the author for the web story.
        - `name` 
            - type: `string`
            - required: No
            - description: Name of the author.

        - `id`
            - type: `number`
            - required: No
            - description: Id of the author.

- `bottomTargetAction`
    - type: `string`
    - required: No
    - description: Link to edit the story in story-editor.

- `capabilities`
    - type: `Object`
    - required: No
    - description: Capabilities of user to perform on current story.
        - `hasEditAction`
            - type: `boolean`
            - required: No
            - description: Defines the capability of user to edit the story.

        - `hasDeleteAction`
            - type: `boolean`
            - required: No
            - description: Defines the capability of user to delete the story.
- `created`
    - type: `string`
    - required: Yes
    - description: Created date and time of the story without timezone.

- `createdGmt`
    - type: `string`
    - required: Yes
    - description: Created date and time of the story with timezone.

- `editStoryLink`
    - type: `string`
    - required: Yes
    - description: Link to open story in story-editor.

- `featuredMediaUrl`
    - type: `string`
    - required: No
    - description: Link to show the featured media/poster.

- `id`
    - type: `number`
    - required: Yes
    - description: Id of the current story.

- `link`
    - type: `string`
    - required: No
    - description: Link to display the web-story output.

- `modified`
    - type: `string`
    - required: Yes
    - description: Latest modified date and time of the story without timezone.

- `modifiedGmt`
    - type: `string`
    - required: Yes
    - description: Latest modified date and time of the story with timezone.

- `previewLink`
    - type: `string`
    - required: No
    - description: Link to preview the story.

- `status`
    - type: `string`
    - required: Yes
    - description: Publishing status of the web story.

- `title`
    - type: `string`
    - required: Yes
    - description: Title of the web-story.

Example ( Story Object )

```JSON
{
    "author": {
        "name": "dev",
        "id": 1
    },
    "bottomTargetAction": "https://example.org/post.php?post=1&action=edit",
    "capabilities": {
        "hasEditAction": true,
        "hasDeleteAction": true
    },
    "created": "2022-01-18T07:36:32",
    "createdGmt": "2022-01-18T07:36:32Z",
    "editStoryLink": "https://example.org/post.php?post=1&action=edit",
    "featuredMediaUrl": "",
    "id": 1,
    "link": "https://example.org/?post_type=web-story&p=1",
    "modified": "2022-01-18T07:36:32",
    "modifiedGmt": "2022-01-18T07:36:32Z",
    "previewLink": "https://example.org/?post_type=web-story&p=1&preview=true",
    "status": "draft",
    "title": "Test Title",
}
```

Example ( Expected response )

```JSON
{
    "fetchedStoryIds": [],
    "stories":{
        "1":{...},
        "2":{...},
    },
    "totalPages": 1,
    "totalStoriesByStatus": {...}
}
```

### `updateStory`

Arguments

- `data`
    - type: `Object`
    
    - description: The Object containing params which contain details to update the story.
        - `id`
            - type: `number`
            - description: The id of the story that needs to be updated
        - `author`
            - type: `number`
            - description: The id of the author.
        - `title`
            - type: `number`
            - description: The changed story title.

Response:
An `Object` of `<Story>` shape.

Example ( Expected response )

```JSON
{
    "id": 1,
    "status": "draft",
    "title": "Test",
    "created": "2022-03-15T08:28:02",
    "createdGmt": "2022-03-15T08:28:02Z",
    "modified": "2022-03-15T08:28:02",
    "modifiedGmt": "2022-03-15T08:28:02Z",
    "author": {
        "name": "Dev",
        "id": 1
    },
    "bottomTargetAction": "https://example.org/post.php?post=2247&action=edit",
    "featuredMediaUrl": "",
    "editStoryLink": "https://example.org/post.php?post=2247&action=edit",
    "previewLink": "https://example.org/?post_type=web-story&p=2247&preview=true",
    "link": "https://example.org/?post_type=web-story&p=2247",
    "capabilities": {
        "hasEditAction": true,
        "hasDeleteAction": true
    }
}
```

### `trashStory`

Arguments

-  `id`
    - type: `number`
    - description: The story id which needs to be trashed.

Response

- `void`

### `createStoryFromTemplate`

Arguments

-  `template`
    - type: `Object`
    - description: The details of a template
        - `id`
            - type: `number`
            - description: Id of the template
        - `createdBy`
            - type: `string`
            - description: Name of the creator of the template.
        - `modified`
            <!-- Need to find appropriate datatype since whole date is shown as like "Wed Aug 25 2021 05:30:00 GMT+0530 (India Standard Time)" -->
            - type: `string`
            - description: Date and time of modification of the template.
        - `slug`
            - type: `string`
            - description: Slug of the template.
        - `creationDate`
            <!-- Need to find appropriate datatype since whole date is shown as like "Wed Aug 25 2021 05:30:00 GMT+0530 (India Standard Time)"-->
            - type: `string`
            - description: Date and time of creation of the template.
        - `title`
            - type: `string`
            - description: Title of the template which will be default title for story.
        - `tags`
            - type: `Array<string>`            
            - description: set of words tht describe the template.
        - `colors`
            - type: `Array<Object>`            
            - description: Set of colors which are mostly used in template.
                - `color`
                    - type: `string`
                    - description: Hex code of the color.
                - `family`
                    - type: `string`
                    - description: Name of the base color.
                - `label`
                    - type: `string`
                    - description: Name of the color.
        - `description`
            - type: `string`
            - description: A brief description of the template.
        - `vertical`
            - type: `string`
            - description: Category of the template
        - `version`
            - type: `number`
            - description: Version of the template used for migration.
        - `pages`
            - type: `array<Page>`
            - description: Each attay item corrresponds to each page in template.[ page object ](../story-editor/integration-layer-api/api-callbacks.md/#page-object-shape)
        - `postersByPage`
            - type: `array<Object>`
            - description: Each object consisting of the URL for the page poster.
                - `png`
                    - type: `string`
                    - description: URL for png image.
                - `type`
                    - type: `string` 
                    - description: Type of poster image.
                - `webp`
                    - type: `string`
                    - description: URL for webp image.
        - `status`
            - type: `string`
            - description: String showing the status of template.

Expected Response:
An `Object` of the following shape.

`editLink`

- type: `string`
- required: Yes
- description: Link to edit the new story created from template.

Example (Template)

```JSON
{
    "id": 51,
    "createdBy": "Google",
    "modified": "2020-04-21T00:00:00.000Z",
    "slug": "celebrity-life-story",
    "creationDate": "2021-08-25T00:00:00.000Z",
    "title": "Celebrity Life Story",
    "tags": [
        "Entertainment",
        "Celebrity",
        "Pop",
        "Bright",
        "Black"
    ],
    "colors": [
        {
            "label": "Phantom Black",
            "color": "#020202",
            "family": "Black"
        },
        {
            "label": "Gecko Green",
            "color": "#80FF44",
            "family": "Green"
        }
    ],
    "description": "With an upbeat neon green color and a powerful headings font, this template is great for creating stories around pop culture, music and the show business.",
    "vertical": "Entertainment",
    "version": 40,
    "pages": [{...}],
    "postersByPage": [{...}],
    "status": "template",
    "isLocal": false
}
```

Example ( Expected Response )

```JSON
{
    "editLink":"https://example.org/post.php?post=1&action=edit"
}
```

Note that when the "Use template" button is clicked, it internally needs to know the registered element types.
Therefore, you need to register them using `elementTypes.forEach(registerElementType)` in the same way as 
it is done for the Story Editor ( See [Getting Started](./../story-editor/getting-started.md) )

### `duplicateStory`

Arguments

- `story`
    - type: `id`
    - description: Id of the story which is to be dupilicated

Response

An `Object` in `<Story>` shape.

Example ( Expected response )

```JSON
{
    "id": 1,
    "status": "draft",
    "title": "Test",
    "created": "2022-03-15T08:28:02",
    "createdGmt": "2022-03-15T08:28:02Z",
    "modified": "2022-03-15T08:28:02",
    "modifiedGmt": "2022-03-15T08:28:02Z",
    "author": {
        "name": "Dev",
        "id": 1
    },
    "bottomTargetAction": "https://example.org/post.php?post=2247&action=edit",
    "featuredMediaUrl": "",
    "editStoryLink": "https://example.org/post.php?post=2247&action=edit",
    "previewLink": "https://example.org/?post_type=web-story&p=2247&preview=true",
    "link": "https://example.org/?post_type=web-story&p=2247",
    "capabilities": {
        "hasEditAction": true,
        "hasDeleteAction": true
    }
}
```

## Filtering stories

A dropdown with a list of all the authors for filtering the stories would be added if the callback below is defined.

### `getAuthors`

A callback used to get all the authors of the CMS. Response from this will be used in a dropdown menu from which selecting a particular author will invoke `fetchStories` with the required arguments to get stories created by this author.

Arguments

- `search`
    - type: `string`
    - description: Search string entered by the user.

Expected Response:

Array of the `Object` which describes author details.

- `id`
    - type: `number`
    - required: Yes
    - description: User id.

- `name`
    - type: `string`
    - required: Yes
    - description: Name of the author.

Example ( Expected response )

```json
[
    {
    "id": 1,
    "name": "dev"
    },
    {
    "id": 2,
    "name": "admin"
    }
]
```
