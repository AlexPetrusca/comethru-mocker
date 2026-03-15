# P1

- StorageProvider is broken
    - load AsyncStorage into it on init
    - block the app from rendering until its ready
- Clicking notification should open the conversation up
- On Android, keyboard covers textbox

# P2

- Restarting mocker in Kubernetes causes it to lose all its data
- When app reopens, we need to poll for any new messages since we were offline
- When api url changes, need to update our data
- When phone changes, is data updated properly?

# P3

- If message self, notification sent to self
- Send new message, navigate back brings you to compose page

# Integration

- ComeThru needs to route messages to mocker, then we’re done
- Make iOS build without notification support, so I can put it on my iPhone
