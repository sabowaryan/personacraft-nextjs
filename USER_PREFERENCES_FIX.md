# User Preferences Foreign Key Fix

## Problem
The application was experiencing a Prisma database error related to a foreign key constraint violation for `UserPreferences_userId_fkey`. This occurred when trying to create or update user preferences for a user that didn't exist in the database.

## Root Cause
The issue happened due to a timing problem between Stack Auth user authentication and database synchronization:

1. Users authenticate via Stack Auth
2. Stack Auth webhooks are supposed to create users in our Prisma database
3. However, if a user tries to access preferences before the webhook processes, the user doesn't exist in our database yet
4. This causes foreign key constraint violations when trying to create `UserPreferences` records

## Solution
Created a comprehensive fix with the following components:

### 1. Shared Utility Functions (`src/lib/user-utils.ts`)
- `ensureUserExists()`: Checks if a Stack Auth user exists in our database and creates them if not
- `handleForeignKeyError()`: Provides consistent error handling for foreign key constraint violations

### 2. Updated API Routes
Fixed the following routes to ensure users exist before creating related records:

- `src/app/api/user/preferences/route.ts` (GET and POST)
- `src/app/api/personas/migrate/route.ts`
- `src/app/api/briefs/migrate/route.ts`

### 3. User Creation Process
When a user doesn't exist, the fix:
1. Retrieves the default "Gratuit" plan
2. Retrieves the default "free_user" role
3. Creates the user with proper defaults
4. Assigns the default role to the user
5. All within a database transaction for consistency

## Key Features
- **Idempotent**: Safe to call multiple times
- **Transactional**: User creation is atomic
- **Graceful Error Handling**: Provides user-friendly error messages
- **Logging**: Comprehensive logging for debugging
- **Fallback**: Uses sensible defaults for missing user data

## Testing
Created `test-user-preferences-fix.js` to verify the fix works correctly. The test:
- Verifies default plan and role exist
- Creates a test user and preferences
- Cleans up test data
- Confirms no foreign key constraint violations

## Benefits
1. **Eliminates Foreign Key Errors**: Users can access preferences immediately after authentication
2. **Improved User Experience**: No more "user not found" errors
3. **Robust Error Handling**: Clear error messages for debugging
4. **Consistent User Creation**: All routes now handle missing users the same way
5. **Better Reliability**: Reduces dependency on webhook timing

## Files Modified
- `src/lib/user-utils.ts` (new)
- `src/app/api/user/preferences/route.ts`
- `src/app/api/personas/migrate/route.ts`
- `src/app/api/briefs/migrate/route.ts`
- `test-user-preferences-fix.js` (new)
- `USER_PREFERENCES_FIX.md` (new)

## Usage
The fix is automatically applied when users access any of the updated API routes. No additional configuration is required.

## Future Considerations
- Monitor webhook processing to ensure it's working correctly
- Consider implementing a user sync check on app startup
- Add metrics to track how often the fallback user creation is triggered