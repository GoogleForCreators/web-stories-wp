# API Callbacks

Similar to story editor, side effects are added to the Dashboard by defining callbacks. One such callback is `fetchStories` which is used to get stories from the backend and is the only required callback. Other callbacks can be used to add or handle functionalities for story management. All API callbacks can be asynchronous and should eventually resolve to their corresponding expected responses.

Below is a list of available API callbacks categorized in different sections.

## Browsing stories

A dropdown with a list of all the authors for filtering out the stories would be added if the callback below is defined.

### `getAuthors`

A callback used to get all the authors who have created a story and is stored in a CMS. Response from this will be used in a dropdown menu from which selecting a particular author will invoke `fetchStories` with the required arguments to get stories created only by this author.

Arguments

- `search`
    - type: `string`
    - description: Search string entered by the user.

Expected Response:

Array of the author object whose keys are described below

- `id`
    - type: `number`
    - required: Yes
    - description: User id.
    
- `name`
    - type: `string`
    - required: Yes
    - description: Username.

Example ( Expected response )

```json
{
    "id": 2,
    "name": "admin"
}
```



## Story Management

A set of callbacks that help in performing create, update, delete and read operations on a single web-story.

### `fetchStories`

A callback which fetches stories to be shown in the dashboard.

Arguments

- `status`
    - type: `string`
    - description: Status of a story. One of `draft`, `pending`, `public`, `future` or `private`

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
- description: Array of the story ids. 

`stories`

- type: `array<Story>`
- required: Yes
- description: Array of object consisting of story details of each story where story-id is key. See [Story Shape Object](#story-shape-object) section for full documentation of `Story` object.
  

`totalPages`

- type: `number`
- required: Yes
- description: Total number of pages.

`totalStoriesByStatus`

- type: `Object`
- required: Yes
- description: Total stories by status of publishing where status is key and value is total stories of that status.



### Story Shape Object

`author`

- type: `Object`

- required: No

- description: Name and id of the author for the web-story.
  `name` 

    - type: `string`
    - required: No
    - description: Name of the author.

  `id`

    - type: `number`
    - required: No
    - description: Id of the author.

`bottomTargetAction`

- type: `string`
- required: No
- description: Link to edit the story in story-editor.

`capabilities`

- type: `Object`
- required: No
- description: Capabilities of user to perform on current story.

`created`

- type: `string`
- required: Yes
- description: Created date and time of the story without timezone.

`createdGmt`

- type: `string`
- required: Yes
- description: Created date and time of the story with timezone.

`editStoryLink`

- type: `string`
- required: Yes
- description: Link to open story in story-editor.

`featuredMediaUrl`

- type: `string`
- required: No
- description: Link to show the featured media/poster.

`id`

- type: `number`
- required: Yes
- description: Id of the current story.

`link`

- type: `string`
- required: No
- description: Link to display the web-story output.

`lockUser`

- type: `Object`

- required: No

- description: Used to show the user who is currently editing the story.
  `id`

    - type: `number`
    - required: No
    - description: Id of the user who is currently editing the story.

  `name`

    - type: `string`
    - required: No
    - description: Name of the user who is currently editing the story.

  `avatar`

    - type: `string`
    - required: No
    - description: Link to the avatar picture of the user who is curently editing the story.

`locked`

- type: `boolean`
- required: No
- description: Shows whether or not the story is being edited by another user.

`modified`

- type: `string`
- required: Yes
- description: Latest modified date and time of the story without timezone.

`modifiedGmt`

- type: `string`
- required: Yes
- description: Latest modified date and time of the story with timezone.

`previewLink`

- type: `string`
- required: No
- description: Link to preview the story.

`status`

- type: `string`
- required: Yes
- description: Publishing status of the web story.

`title`

- type: `string`
- required: Yes
- description: Title of the web-story.



Example ( Expected response )

```JSON
{
    "fetchedStoryIds": [],
    "stories":[{...}],
    "totalPages": 1,
    "totalStoriesByStatus": {...}
}
```

### `updateStory`

Arguments

- `data`
    - type: `Object`
    - description: 
        - `id`
            - type: `number`
            - description: 
        - `author`
            - type: `number`
            - description: 
        - `title`
            - type: `number`
            - description: 

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
    "locked": false,
    "lockUser": {
        "id": 0,
        "name": "",
        "avatar": null
    },
    "bottomTargetAction": "https://testsite.local/wp-admin/post.php?post=2247&action=edit",
    "featuredMediaUrl": "",
    "editStoryLink": "https://testsite.local/wp-admin/post.php?post=2247&action=edit",
    "previewLink": "https://testsite.local/?post_type=web-story&p=2247&preview=true",
    "link": "https://testsite.local/?post_type=web-story&p=2247",
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
    - required: Yes
    - description: The story id which needs to be trashed.

Response

- `void`

### `createStoryFromTemplate`

Arguments

-  `template`
    - type: `Object`
    - description: 
        - `createdBy`
            - type: `number`
            - description: 
        - `pages`
            - type: `number`
            - description: 
        - `version`
            - type: `number`
            - description: 
        - `colors`
            - type: `number`
            - description: 

Expected Response:
An `Object` of the following shape.

`editLink`

- type: `string`
- required: Yes
- description: Link to edit the new story created from template.

Example ( Expected Response )

```JSON
{
    "editLink":"https://testsite.local/wp-admin/post.php?post=1&action=edit"
}
```

### `duplicateStory`

Arguments

- `story`
    - type: `id`
    - description:

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
    "locked": false,
    "lockUser": {
        "id": 0,
        "name": "",
        "avatar": null
    },
    "bottomTargetAction": "https://testsite.local/wp-admin/post.php?post=2247&action=edit",
    "featuredMediaUrl": "",
    "editStoryLink": "https://testsite.local/wp-admin/post.php?post=2247&action=edit",
    "previewLink": "https://testsite.local/?post_type=web-story&p=2247&preview=true",
    "link": "https://testsite.local/?post_type=web-story&p=2247",
    "capabilities": {
        "hasEditAction": true,
        "hasDeleteAction": true
    }
}
```
