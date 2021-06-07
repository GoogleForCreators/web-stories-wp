# Roles and Permissions 

> WordPress has six pre-defined roles: Super Admin, Administrator, Editor, Author, Contributor and Subscriber. Each role is allowed to perform a set of tasks called Capabilities.

These roles and their permissions can be explored in detail here: [https://wordpress.org/support/article/roles-and-capabilities/](https://wordpress.org/support/article/roles-and-capabilities/)

Inside of the web stories app we are harnessing these role definitions to manage what users have permission to do. This document is meant to be a reference of what these roles mean for web stories specifically. 

| Has permission? | Role |
| --- | --- |
| Can create new story | Admin, Editor, Author |
| Can duplicate story XYZ | Admin |
| Can publish story | Admin |
| Can edit story | Admin, Editor |
| Can delete any story | Admin |
| Can delete their own story | Admin, Editor, Author |
| Can upload media | Admin |
| Can upload or delete publisher logos | Admin |
| Can edit settings | Admin|
| Can update video optimization settings | Admin |


In cases where a permission is not granted, we need to make sure the UI reflects this.  


## Web Stories specific capabilities 


`hasUploadMediaAction` : admin 
`hasPublishAction`: admin, editor if story is their own 
`hasAssignAuthorAction`: admin
