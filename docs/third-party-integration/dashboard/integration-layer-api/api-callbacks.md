# API Callbacks

## Browsing stories

### `getAuthors`

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

Example Response

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

Response

Example Response

### `trashStory`

Arguments

-  `id`
    - type: `number`
    - description: 

Response

Example Response

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

Example Response

### `duplicateStory`

Arguments

- `story`
    - type: `id`
    - description:

Response

Example Response
