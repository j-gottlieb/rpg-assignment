### Development Process

1. Ask claude to recommend an ORM for mysql - recommends TypeORM 
   1. Claude adds dependency and implements with test model 
2. Install docker and build mysql instance 
   1. Dependency mismatch causes FE to fail to load 
   2. Requires downgrading to Apollo client v3 
3. Ask claude to implement user registration and auth 
   1. CORS blocks integration with backend, fix is to enable cors for the localhost port 
4. Ask claude to implement Post creation 
   1. Auth causes error looking for user on session context instead of apollo context 
   2. Overriding `getRequest` to use the GQL context fixes it 
5. Post creation now works, but UI is messy 
   1. Claude cleans up UI by centering things
6. I notice an issue where times are shown in UTC instead of local time 
   1. Adding a `Z` timezone configuration to TypeORM module fixes it 
7. Ask claude to implement push notifications 
   1. It chooses GQL subscriptions using websockets 
   2. Initially pushes work, but aren’t correctly stored in Vue state causing posts to disappear when user navigates to another page and then back to blog feed. 
   3. Fix is to use `subscribeToMore` instead of `useSubscription`, which keeps the gql query’s cache up to date 
8. All posts are highlighted green each time a new post comes, instead of just the new post 
   1. Claude says it is because the `watch` callback isn’t being run on each post update - using `immediate: true` fixes it by ensuring new posts are added to the `seenIds` set.
   2. Another issue is that the `seenIds` ref is cleared each time the user navigates away from the BlogFeedVue. Moving seenIds to a pinia store resolves the issue.
