# Browsing stories

## `getAuthors`

A callback used to get all the authors who have created a story and is stored in a CMS. Response from this will be used in a dropdown menu from which selecting a particular author will invoke `fetchStories` with the required arguments to get stories created only by this author.

Arguments

- `search`
    - type: `string`
    - description: Search string entered by the user.

Response

Array of the author object whose keys are described below

- `id`
    - type: `number`
    - description: User id.

- `name`
    - type: `string`
    - description: Username.

Example Response


## Story Management

### Story Shape Object

`author`

- type: `object`
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

- type: `object`
- required: No
- description: Capabilities of user to perform on current story.

`created`

- type: `datetime`
- required: Yes
- description: Created date and time of the story without timezone.

`createdGmt`

- type: `datetime`
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

- type: `object`
- required: No
- description: used to show the user who is currently editing the story.
     `id`
    - type: `number`
    - required: No
    - description: id of the user who is currently editing the story.

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

- type: `datetime`
- required: Yes
- description: latest modified date and time of the story without timezone.

`modifiedGmt`

- type: `datetime`
- required: Yes
- description: latest modified date and time of the story with timezone.

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

Response
An `object` with the following shape.

`fetchedStoryIds`

- type: `array<number>`
- required: Yes
- description: Array of the story ids. 

`stories`

- type: `array<Story>`
- required: Yes
- description: Array of object consisting of story details of each story where story-id is key.
    
`totalPages`

- type: `number`
- required: Yes
- description: Total number of pages.

`totalStoriesByStatus`

- type: `object`
- required: Yes
- description: Total stories by status of publishing where status is key and value is total stories of that status.

Example Response

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
    - type: `object`
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
an `object` of `<Story>` shape.


Example Response

```JSON
{
    "id": 1,
    "status": "draft",
    "title": "Test (Copy)",
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
    - description: 

Response

- `void`

### `createStoryFromTemplate`

Arguments

-  `template`
    - type: `object`
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

Response
an `object` of the following shape.

`editLink`

- type: `string`
- required: Yes
- description: Link to edit the new story created from template.

Example Response

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

an `object` in `<Story>` shape.

Example Response

```JSON
{
    "id": 1,
    "status": "draft",
    "title": "Test (Copy)",
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
