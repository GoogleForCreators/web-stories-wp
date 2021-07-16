# Checklist 

The Prepublish Checklist to help users make the best Stories possible.

## Logic 

- On an empty story none of the checklist categories are visible
- When a story has more than one page the design and accessibility  sections are visible
- When a story has more than 4 pages the high  priority section is also available. 
- If a user attempts to publish a story that's less than 5 pages they'll get a prompt to review the checklist first. That exposes all of the checklist sections. 

## Structure

- All checks are nested in checklist/checks, the logic and requirements for each check are stored here. They render their own component based on the  check and that component is given  to the checklist category to render making the list self contained.

## Adding a new check

- Follow patterning in `checklist/checks`. The logic for the check should be kept internal to the check itself. 
- Give it a unique name when hooking into `useRegisterCheck`, this is what tracks issue counts.
- Tests for checks are stored in `checklist/checks/test`. 

## Context

Comes in three sections. You need varying degrees of access depending on where you are in the app. 

- CheckpointProvider: Wraps around Layout so that the publish  button also has access to the current checkpoint. If requirements are met then a dialog appears prompting the  user to review the checklist before publishing.
- ChecklistProvider: Wraps around the carousel so that the toggle buttons in the secondary menu know when the checklist is open and the other popup menus there (help center) can respect it. 
- ChecklistCountProvider, ChecklistCategoryProvider: Wrap around various parts of the checklist itself to provide counts of issues.

## Roles

There are six possible roles that a user may be:

- Super Admin
- Administrator
- Editor
- Author
- Contributor
- Subscriber

Depending on the role, the user may or may not be able to fix specific checklist items. Due to this constraint, some of the checklist items will be hidden based on the user's role.

**NOTE**: `Contributor`s are only able to edit _non-published_ stories. Once a story is published, many cards will be hidden from `contributor`s as well.

This is outlined in the table below:

|Story issue|Users that will be shown the checklist card|Users that will be shown the checklist card when the story has been published|
|--|--|--|
|Story missing title|Super Admin, Administrator, Editor, Author, Contributor|Super Admin, Administrator, Editor, Author|
|Story title too long|Super Admin, Administrator, Editor, Author, Contributor|Super Admin, Administrator, Editor, Author|
|Story missing excerpt|Super Admin, Administrator, Editor, Author, Contributor|Super Admin, Administrator, Editor, Author|
|Story has no poster image attached|Super Admin, Administrator, Editor, Author|Super Admin, Administrator, Editor, Author|
|Increase poster image's size|Super Admin, Administrator, Editor, Author|Super Admin, Administrator, Editor, Author|
|Increase poster images's aspect ratio|Super Admin, Administrator, Editor, Author|Super Admin, Administrator, Editor, Author|
|Increase publisher logo size|Super Admin, Administrator, Editor, Author|Super Admin, Administrator, Editor, Author|
|Video missing poster image|Super Admin, Administrator, Editor, Author|Super Admin, Administrator, Editor, Author|
|Video not optimized|Super Admin, Administrator, Editor, Author|Super Admin, Administrator, Editor, Author|
|Story has too many pages|Super Admin, Administrator, Editor, Author, Contributor|Super Admin, Administrator, Editor, Author|
|Story has too few pages|Super Admin, Administrator, Editor, Author, Contributor|Super Admin, Administrator, Editor, Author|
|Page has too much text|Super Admin, Administrator, Editor, Author, Contributor|Super Admin, Administrator, Editor, Author|
|Page has too little text|Super Admin, Administrator, Editor, Author, Contributor|Super Admin, Administrator, Editor, Author|
|Page has too many links|Super Admin, Administrator, Editor, Author, Contributor|Super Admin, Administrator, Editor, Author|
|Video element resolution too low|Super Admin, Administrator, Editor, Author|Super Admin, Administrator, Editor, Author|
|Media element resolution too low|Super Admin, Administrator, Editor, Author|Super Admin, Administrator, Editor, Author|
|Contrast too low between text and background color|Super Admin, Administrator, Editor, Author, Contributor|Super Admin, Administrator, Editor, Author|
|Text font size too small|Super Admin, Administrator, Editor, Author, Contributor|Super Admin, Administrator, Editor, Author|
|Video element missing description|Super Admin, Administrator, Editor, Author, Contributor|Super Admin, Administrator, Editor, Author|
|Video element missing captions|Super Admin, Administrator, Editor, Author, Contributor|Super Admin, Administrator, Editor, Author|
|Element link tappable region too small|Super Admin, Administrator, Editor, Author, Contributor|Super Admin, Administrator, Editor, Author|
|Image element missing alt|Super Admin, Administrator, Editor, Author, Contributor|Super Admin, Administrator, Editor, Author|

## Future  Improvements

- Now that the checklist has self contained checks there's room to improve perf on one off situations. 
- Add role based checks 
