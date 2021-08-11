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

Depending on the user's `role`, the user may or may not be able to fix specific checklist items. A checklist card will be hidden if the user is unable to fix the issue.

This is outlined in the table below:

|Story issue/card|Role(s) necessary to resolve the issue|
|--|--|
|Story has no poster image attached|`hasUploadMediaAction`|
|Increase poster image's size|`hasUploadMediaAction`|
|Increase poster images's aspect ratio|`hasUploadMediaAction`|
|Increase publisher logo size|`hasUploadMediaAction`|
|Video missing poster image|`hasUploadMediaAction`|
|Video not optimized|`hasUploadMediaAction`|
|Video element resolution too low|`hasUploadMediaAction`|
|Media element resolution too low|`hasUploadMediaAction`|
|Video element missing captions|`hasUploadMediaAction`|

## Future  Improvements

- Now that the checklist has self contained checks there's room to improve perf on one off situations. 
- Add role based checks 
