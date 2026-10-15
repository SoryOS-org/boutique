# Security Specification for Real-Time Messenger

## 1. Data Invariants
- A message must belong to a chat where the sender is a participant.
- A user can only update their own user profile (presence, status).
- Chat participants cannot be modified by non-participants or via client-side updates after creation.
- All IDs must be valid strings (alphanumeric + hyphen/underscore).

## 2. The "Dirty Dozen" Payloads

### Identity & Integrity Failures
1. **Empty Message Create**: `{ "senderId": "user1", "text": "", "timestamp": "2026-10-13T06:00:00Z" }` (Missing chatId)
2. **Unauthorized Message Create**: Create a message in a chat where `senderId` is not in `participants` list.
3. **Message Spoofing**: Update `senderId` of an existing message.
4. **Profile Hijacking**: Attempt to update `users/user2/status` using `request.auth.uid = "user1"`.
5. **Presence Poisoning**: Set `status` to "superadmin" (not in enum).
6. **ID Injection**: Create a chat with ID `../../../../secret-doc`.

### State Failures
7. **Orphaned Message**: Create a message in a chat that does not exist.
8. **Chat Manipulation**: Update `participants` list in an existing chat.

### Security Failures
9. **PII Leak**: Read `users/user2` document when `request.auth.uid = "user1"`.
10. **Query Scraping**: `list` all chats without checking `participants` contains `request.auth.uid`.
11. **Timestamp Poisoning**: Update `message.timestamp` with a future date provided by the client.
12. **Ghost Field Injection**: Create a user with `isAdmin: true` field.

## 3. The Test Runner
(To be implemented in `firestore.rules.test.ts`)
