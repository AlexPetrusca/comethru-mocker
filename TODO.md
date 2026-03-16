# P2

- Restarting mocker in Kubernetes causes it to lose all its data
- When app reopens, we need to poll for any new messages since we were offline
- When api url changes, need to update our data
- When phone changes, is data updated properly?

# P3

- If message self, notification sent to self
- Send new message, navigate back brings you to compose page
- Don't receive message notifications for the current conversation thread you're on
  - Expo-notifications lets you intercept incoming notifications before the user sees them
  - You need to track some global state to know what page you're on in the notification listener
- Clear multiple notifications from the same conversation on tap
  - If we receive 3 messages while phone is locked, those notifications will sit in notification tray
  - When the user taps one or navigates to that specific chat, delete those old notifications so they don't clog up

# Integration

- ComeThru needs to route messages to mocker, then we’re done
- Make iOS build without notification support, so I can put it on my iPhone
- Update react-native-keyboard-controller to "1.21.0" from "1.21.0-beta.3" when it comes out
  - Specifically, integrate with KeyboardChatScrollView's "extraContentPadding" prop to handle multiline textinput
