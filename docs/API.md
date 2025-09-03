# ClaimSnap API Documentation

This document provides an overview of the ClaimSnap API services and their usage.

## Table of Contents

1. [Authentication](#authentication)
2. [Supabase Service](#supabase-service)
3. [AI Service](#ai-service)
4. [Storage Service](#storage-service)
5. [Stripe Service](#stripe-service)
6. [Photo Processing Service](#photo-processing-service)
7. [Report Service](#report-service)
8. [User Service](#user-service)

## Authentication

The authentication service handles user authentication and authorization.

### Methods

#### `checkAuth()`

Checks if the user is authenticated.

**Returns:**
- `isAuthenticated` (boolean): Whether the user is authenticated
- `user` (object): User data
- `profile` (object): User profile data

#### `login(email, password)`

Logs in a user with email and password.

**Parameters:**
- `email` (string): User's email
- `password` (string): User's password

**Returns:**
- `isAuthenticated` (boolean): Whether the login was successful
- `user` (object): User data
- `profile` (object): User profile data

#### `register(email, password, userData)`

Registers a new user.

**Parameters:**
- `email` (string): User's email
- `password` (string): User's password
- `userData` (object): Additional user data

**Returns:**
- `isAuthenticated` (boolean): Whether the registration was successful
- `user` (object): User data
- `profile` (object): User profile data

#### `logout()`

Logs out the current user.

**Returns:**
- `isAuthenticated` (boolean): Always false
- `user` (null): Null user data
- `profile` (null): Null profile data

#### `forgotPassword(email)`

Sends a password reset email.

**Parameters:**
- `email` (string): User's email

**Returns:**
- `success` (boolean): Whether the email was sent successfully

#### `checkSubscription(userId)`

Checks the user's subscription status.

**Parameters:**
- `userId` (string): User ID

**Returns:**
- `isActive` (boolean): Whether the subscription is active
- `tier` (string): Subscription tier
- `isWithinLimits` (boolean): Whether the user is within usage limits
- `expiresAt` (string): Subscription expiration date

## Supabase Service

The Supabase service handles database operations.

### User Methods

#### `getUser()`

Gets the current user.

**Returns:**
- User object

#### `signIn(email, password)`

Signs in a user.

**Parameters:**
- `email` (string): User's email
- `password` (string): User's password

**Returns:**
- Authentication data

#### `signUp(email, password, userData)`

Signs up a new user.

**Parameters:**
- `email` (string): User's email
- `password` (string): User's password
- `userData` (object): Additional user data

**Returns:**
- Authentication data

#### `signOut()`

Signs out the current user.

#### `resetPassword(email)`

Sends a password reset email.

**Parameters:**
- `email` (string): User's email

### User Profile Methods

#### `createUserProfile(userId, userData)`

Creates a user profile.

**Parameters:**
- `userId` (string): User ID
- `userData` (object): User profile data

**Returns:**
- Created user profile

#### `getUserProfile(userId)`

Gets a user profile.

**Parameters:**
- `userId` (string): User ID

**Returns:**
- User profile

#### `updateUserProfile(userId, updates)`

Updates a user profile.

**Parameters:**
- `userId` (string): User ID
- `updates` (object): Profile updates

**Returns:**
- Updated user profile

### Claim Methods

#### `getClaims(userId)`

Gets all claims for a user.

**Parameters:**
- `userId` (string): User ID

**Returns:**
- Array of claims

#### `getClaim(claimId)`

Gets a specific claim.

**Parameters:**
- `claimId` (string): Claim ID

**Returns:**
- Claim object

#### `createClaim(claimData)`

Creates a new claim.

**Parameters:**
- `claimData` (object): Claim data

**Returns:**
- Created claim

#### `updateClaim(claimId, updates)`

Updates a claim.

**Parameters:**
- `claimId` (string): Claim ID
- `updates` (object): Claim updates

**Returns:**
- Updated claim

#### `deleteClaim(claimId)`

Deletes a claim and all associated photos and reports.

**Parameters:**
- `claimId` (string): Claim ID

### Photo Methods

#### `getPhotos(claimId)`

Gets all photos for a claim.

**Parameters:**
- `claimId` (string): Claim ID

**Returns:**
- Array of photos

#### `getPhoto(photoId)`

Gets a specific photo.

**Parameters:**
- `photoId` (string): Photo ID

**Returns:**
- Photo object

#### `createPhoto(photoData)`

Creates a new photo.

**Parameters:**
- `photoData` (object): Photo data

**Returns:**
- Created photo

#### `updatePhoto(photoId, updates)`

Updates a photo.

**Parameters:**
- `photoId` (string): Photo ID
- `updates` (object): Photo updates

**Returns:**
- Updated photo

#### `deletePhoto(photoId)`

Deletes a photo.

**Parameters:**
- `photoId` (string): Photo ID

#### `deleteClaimPhotos(claimId)`

Deletes all photos for a claim.

**Parameters:**
- `claimId` (string): Claim ID

### Report Methods

#### `getReports(userId)`

Gets all reports for a user.

**Parameters:**
- `userId` (string): User ID

**Returns:**
- Array of reports

#### `getClaimReports(claimId)`

Gets all reports for a claim.

**Parameters:**
- `claimId` (string): Claim ID

**Returns:**
- Array of reports

#### `getReport(reportId)`

Gets a specific report.

**Parameters:**
- `reportId` (string): Report ID

**Returns:**
- Report object

#### `createReport(reportData)`

Creates a new report.

**Parameters:**
- `reportData` (object): Report data

**Returns:**
- Created report

#### `updateReport(reportId, updates)`

Updates a report.

**Parameters:**
- `reportId` (string): Report ID
- `updates` (object): Report updates

**Returns:**
- Updated report

#### `deleteReport(reportId)`

Deletes a report.

**Parameters:**
- `reportId` (string): Report ID

#### `deleteClaimReports(claimId)`

Deletes all reports for a claim.

**Parameters:**
- `claimId` (string): Claim ID

### File Storage Methods

#### `uploadFile(bucket, path, file)`

Uploads a file to storage.

**Parameters:**
- `bucket` (string): Storage bucket
- `path` (string): File path
- `file` (File): File to upload

**Returns:**
- Public URL of the uploaded file

#### `deleteFile(bucket, path)`

Deletes a file from storage.

**Parameters:**
- `bucket` (string): Storage bucket
- `path` (string): File path

## AI Service

The AI service handles image analysis and processing.

### Methods

#### `analyzePhotoContent(imageFile)`

Analyzes a photo for damage type, severity, and tags.

**Parameters:**
- `imageFile` (File): Image file to analyze

**Returns:**
- Analysis result with damage type, severity, tags, description, and confidence

#### `checkDuplicate(imageFile, existingImages)`

Checks if an image is a duplicate of existing images.

**Parameters:**
- `imageFile` (File): Image file to check
- `existingImages` (array): Array of existing images to compare against

**Returns:**
- Duplicate check result with isDuplicate, confidence, and similarTo

#### `checkImageQuality(imageFile)`

Checks the quality of an image.

**Parameters:**
- `imageFile` (File): Image file to check

**Returns:**
- Quality check result with isLowQuality, issues, and qualityScore

#### `processPhotos(photos)`

Processes multiple photos with AI.

**Parameters:**
- `photos` (array): Array of photos to process

**Returns:**
- Array of processed photos with AI analysis results

## Storage Service

The storage service handles file storage and IPFS integration.

### Methods

#### `uploadToPinata(file, metadata)`

Uploads a file to Pinata (IPFS).

**Parameters:**
- `file` (File): File to upload
- `metadata` (object): File metadata

**Returns:**
- IPFS hash and gateway URL

#### `uploadJsonToPinata(jsonData, name)`

Uploads JSON data to Pinata (IPFS).

**Parameters:**
- `jsonData` (object): JSON data to upload
- `name` (string): File name

**Returns:**
- IPFS hash and gateway URL

#### `unpinFromPinata(ipfsHash)`

Unpins a file from Pinata.

**Parameters:**
- `ipfsHash` (string): IPFS hash to unpin

**Returns:**
- Success status

#### `uploadToStorage(file, bucket, path, metadata, usePinata)`

Uploads a file to storage (Supabase and optionally Pinata).

**Parameters:**
- `file` (File): File to upload
- `bucket` (string): Storage bucket
- `path` (string): File path
- `metadata` (object): File metadata
- `usePinata` (boolean): Whether to use Pinata

**Returns:**
- Upload result with URL, IPFS hash, and IPFS URL

#### `uploadJsonToStorage(jsonData, bucket, path, name, usePinata)`

Uploads JSON data to storage (Supabase and optionally Pinata).

**Parameters:**
- `jsonData` (object): JSON data to upload
- `bucket` (string): Storage bucket
- `path` (string): File path
- `name` (string): File name
- `usePinata` (boolean): Whether to use Pinata

**Returns:**
- Upload result with URL, IPFS hash, and IPFS URL

#### `deleteFromStorage(bucket, path, ipfsHash)`

Deletes a file from storage (Supabase and optionally Pinata).

**Parameters:**
- `bucket` (string): Storage bucket
- `path` (string): File path
- `ipfsHash` (string): IPFS hash to unpin

**Returns:**
- Success status

## Stripe Service

The Stripe service handles subscription management.

### Methods

#### `createCheckoutSession(userId, priceId, successUrl, cancelUrl)`

Creates a Stripe checkout session.

**Parameters:**
- `userId` (string): User ID
- `priceId` (string): Stripe price ID
- `successUrl` (string): URL to redirect to on success
- `cancelUrl` (string): URL to redirect to on cancel

**Returns:**
- Checkout session ID

#### `createCustomerPortalSession(userId, returnUrl)`

Creates a Stripe customer portal session.

**Parameters:**
- `userId` (string): User ID
- `returnUrl` (string): URL to return to after portal session

**Returns:**
- Portal session URL

#### `getSubscriptionPlans()`

Gets available subscription plans.

**Returns:**
- Array of subscription plans

#### `getUserSubscription(userId)`

Gets a user's subscription.

**Parameters:**
- `userId` (string): User ID

**Returns:**
- Subscription data

#### `getUserInvoices(userId)`

Gets a user's invoices.

**Parameters:**
- `userId` (string): User ID

**Returns:**
- Array of invoices

#### `updateSubscription(userId, newPriceId)`

Updates a user's subscription.

**Parameters:**
- `userId` (string): User ID
- `newPriceId` (string): New Stripe price ID

**Returns:**
- Success status

#### `cancelSubscription(userId, cancelImmediately)`

Cancels a user's subscription.

**Parameters:**
- `userId` (string): User ID
- `cancelImmediately` (boolean): Whether to cancel immediately or at period end

**Returns:**
- Success status

## Photo Processing Service

The photo processing service handles photo processing and management.

### Methods

#### `processBatchPhotos(files, claimId, userId, onProgress)`

Processes a batch of photos.

**Parameters:**
- `files` (array): Array of files to process
- `claimId` (string): Claim ID
- `userId` (string): User ID
- `onProgress` (function): Progress callback

**Returns:**
- Processing result with photos, failedPhotos, and statistics

#### `updatePhotoTags(photoId, tags)`

Updates a photo's tags.

**Parameters:**
- `photoId` (string): Photo ID
- `tags` (array): New tags

**Returns:**
- Updated photo

#### `updatePhotoDamageType(photoId, damageType)`

Updates a photo's damage type.

**Parameters:**
- `photoId` (string): Photo ID
- `damageType` (string): New damage type

**Returns:**
- Updated photo

#### `updatePhotoSeverity(photoId, severity)`

Updates a photo's severity.

**Parameters:**
- `photoId` (string): Photo ID
- `severity` (string): New severity

**Returns:**
- Updated photo

#### `updatePhotoDescription(photoId, description)`

Updates a photo's description.

**Parameters:**
- `photoId` (string): Photo ID
- `description` (string): New description

**Returns:**
- Updated photo

#### `updatePhotoDuplicate(photoId, isDuplicate, similarToId)`

Updates a photo's duplicate status.

**Parameters:**
- `photoId` (string): Photo ID
- `isDuplicate` (boolean): Whether the photo is a duplicate
- `similarToId` (string): ID of the similar photo

**Returns:**
- Updated photo

#### `updatePhotoQuality(photoId, isLowQuality, issues)`

Updates a photo's quality status.

**Parameters:**
- `photoId` (string): Photo ID
- `isLowQuality` (boolean): Whether the photo is low quality
- `issues` (array): Quality issues

**Returns:**
- Updated photo

## Report Service

The report service handles report generation and management.

### Methods

#### `generateReport(claimId, userId, photos, options)`

Generates a report for a claim.

**Parameters:**
- `claimId` (string): Claim ID
- `userId` (string): User ID
- `photos` (array): Array of photos to include in the report
- `options` (object): Report options

**Returns:**
- Generated report

#### `generatePdfReport(reportData)`

Generates a PDF report.

**Parameters:**
- `reportData` (object): Report data

**Returns:**
- PDF generation result

#### `generateCsvReport(reportData)`

Generates a CSV report.

**Parameters:**
- `reportData` (object): Report data

**Returns:**
- CSV generation result

## User Service

The user service handles user profile management.

### Methods

#### `getProfile(userId)`

Gets a user's profile.

**Parameters:**
- `userId` (string): User ID

**Returns:**
- User profile

#### `updateProfile(userId, updates)`

Updates a user's profile.

**Parameters:**
- `userId` (string): User ID
- `updates` (object): Profile updates

**Returns:**
- Updated profile

#### `updateNotificationPreferences(userId, preferences)`

Updates a user's notification preferences.

**Parameters:**
- `userId` (string): User ID
- `preferences` (object): Notification preferences

**Returns:**
- Updated profile

#### `updateSecuritySettings(userId, settings)`

Updates a user's security settings.

**Parameters:**
- `userId` (string): User ID
- `settings` (object): Security settings

**Returns:**
- Updated profile

#### `updateUiPreferences(userId, preferences)`

Updates a user's UI preferences.

**Parameters:**
- `userId` (string): User ID
- `preferences` (object): UI preferences

**Returns:**
- Updated profile

#### `getUserActivity(userId)`

Gets a user's activity.

**Parameters:**
- `userId` (string): User ID

**Returns:**
- User activity data

#### `getUserUsageStats(userId)`

Gets a user's usage statistics.

**Parameters:**
- `userId` (string): User ID

**Returns:**
- User usage statistics

