# Migrations

Migration reducers can and should be written whenever the underlying data model is being changed.

This way, old stories get updated to the newest version once they're loaded.

See [`edit-story/migration/migrate.js`](../assets/src/edit-story/migration/migrate.js) for details.

**Note**: migration functions should be self-contained and not import anything from outside components as they might change and thus affect the migration. 
