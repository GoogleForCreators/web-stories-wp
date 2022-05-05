# Performance

Performance for the editor follows the [RAIL model](https://web.dev/rail/). Most of our in app interactions will be categorized by the [Animation](https://web.dev/rail/#animation:-produce-a-frame-in-10-ms) & [Response](https://web.dev/rail/#response:-process-events-in-under-50ms) section of this model. 

It's important to measure the performance of the app with the react production build (`npm run build`) in an incognito window. This imitates what a user will experience and will prevent any chrome extensions from effecting performance times. It's also important to be aware of what machine you're auditing the app on relative to the user base of the application. An M1 macbook pro can perform about twice as fast as an intel macbook pro. This is something you should account for when trying to compare or justify results.

## Existing Performance Work

To view any prior performance PRs, just search github pulls and issues for anything with the `performance` tag.

The two main milestone audits exist here:
- [Performance Report: January 2022 ](https://github.com/GoogleForCreators/web-stories-wp/issues/10158)
- [Performance Report: April 2022](https://github.com/GoogleForCreators/web-stories-wp/issues/11263)

## Chrome DevTools Performance Tab vs React Profiler

To identify a performance bottleneck in the application, you should use the chrome devtools performance tab in an incognito window, record a sample interaction, and see if it violates the RAIL Model. If there is a violation of the RAIL Model, you should use React Profiler on the development build to guide your architectural decisions.

**Note:** Performance optimizations can often come at the cost of Legibility & Maintainability. They can often also be footguns for performance if used incorrectly. It's important to have documentable proof of a performance bottleneck before altering code for the sake of performance improvements.

### React Profiler

The React Profiler is beneficial for identifying where and how you can make the application more performant. Once you've recorded an interaction within the application, you can audit the commits and component renders of the application for that interaction.

There are essentially two things to look for when auditing a flame graph in the React Profiler, extraneous renders & expensive renders.

#### Extraneous Renders

Extraneous renders are categorized as renders that occur, that don't need to, for a particular update. You can think about these the difference between what React diffs for a particular update, and the minimum that needs to be diffed for our UI to visually update for a user. This difference is an extraneous render.

There's no need to eliminate all extraneous renders, but it is important to be able to identify, and remove, areas that have large amounts of extraneous renders. The classic example within the context of this app is updating an element. If we have 50 elements on a story page, and update the position of 1 element, only 1 element needs a visual update for the user. However, if all 50 elements re-render, and 49 of them are empty re-renders (re-render where nothing actually updated), those 49 re-renders are extraneous re-renders that should be eliminated.

