# ClaimSnap Components Documentation

This document provides an overview of the ClaimSnap UI components and their usage.

## Table of Contents

1. [Core Components](#core-components)
2. [Layout Components](#layout-components)
3. [Form Components](#form-components)
4. [Utility Components](#utility-components)
5. [Page Components](#page-components)

## Core Components

### ImageCard

Displays a photo with its metadata and provides actions for managing the photo.

**Props:**
- `photo` (object): Photo data
- `variant` (string): Card variant ('default', 'processing', 'error', 'success')

**Example:**
```jsx
<ImageCard
  photo={photo}
  variant={photo.isLowQuality ? 'error' : 'success'}
/>
```

### UploadDropzone

Provides a drag-and-drop area for uploading photos.

**Props:**
- `onUpload` (function): Callback function called when upload is complete

**Example:**
```jsx
<UploadDropzone onUpload={handleUploadComplete} />
```

### ReportViewer

Displays a generated report and provides options for exporting.

**Props:**
- `claim` (object): Claim data
- `photos` (array): Photos to include in the report

**Example:**
```jsx
<ReportViewer claim={claim} photos={photos} />
```

### ProgressBar

Displays a progress bar for tracking operations.

**Props:**
- `progress` (number): Progress percentage (0-100)
- `variant` (string): Bar variant ('default', 'upload', 'processing')
- `label` (string): Optional label to display

**Example:**
```jsx
<ProgressBar progress={75} variant="upload" label="Uploading..." />
```

### LoadingIndicator

Displays a loading spinner with optional message and progress.

**Props:**
- `size` (string): Size of the spinner ('small', 'medium', 'large', 'xl')
- `message` (string): Optional message to display
- `fullScreen` (boolean): Whether to display full screen
- `progress` (number): Optional progress percentage
- `className` (string): Additional CSS classes

**Example:**
```jsx
<LoadingIndicator 
  size="large" 
  message="Processing photos..." 
  progress={50} 
/>
```

### ErrorBoundary

Catches JavaScript errors in child components and displays a fallback UI.

**Props:**
- `children` (node): Child components
- `fallbackMessage` (string): Message to display when an error occurs
- `showStack` (boolean): Whether to show the stack trace
- `resetAction` (function): Function to call when reset button is clicked
- `resetActionText` (string): Text for the reset button

**Example:**
```jsx
<ErrorBoundary fallbackMessage="Something went wrong with the photo processing">
  <PhotoProcessor photos={photos} />
</ErrorBoundary>
```

### ButtonLoader

Button with loading state.

**Props:**
- `loading` (boolean): Whether the button is in loading state
- `children` (node): Button content
- `...props`: Additional button props

**Example:**
```jsx
<ButtonLoader loading={isSubmitting} onClick={handleSubmit}>
  Save Changes
</ButtonLoader>
```

## Layout Components

### Sidebar

Main navigation sidebar.

**Example:**
```jsx
<Sidebar />
```

### KeyboardShortcuts

Provides keyboard shortcuts functionality and help dialog.

**Props:**
- `children` (node): Child components
- `shortcuts` (array): Array of shortcut objects

**Example:**
```jsx
<KeyboardShortcuts shortcuts={[
  { key: 'u', description: 'Upload Photos', action: handleUpload }
]}>
  <App />
</KeyboardShortcuts>
```

## Form Components

### ProfileManager

Form for managing user profile information.

**Example:**
```jsx
<ProfileManager />
```

### SubscriptionManager

Component for managing subscription plans and billing.

**Example:**
```jsx
<SubscriptionManager />
```

### LazyImage

Image component with lazy loading and placeholder.

**Props:**
- `src` (string): Image source URL
- `alt` (string): Image alt text
- `className` (string): Additional CSS classes
- `placeholderSrc` (string): Placeholder image URL
- `placeholderClassName` (string): Additional CSS classes for placeholder
- `errorClassName` (string): Additional CSS classes for error state
- `threshold` (number): Intersection observer threshold
- `rootMargin` (string): Intersection observer root margin
- `root` (element): Intersection observer root element
- `...props`: Additional image props

**Example:**
```jsx
<LazyImage
  src={photo.processedUrl}
  alt={photo.originalFilename}
  placeholderSrc={photo.thumbnailUrl}
  className="w-full h-full object-cover rounded-lg"
/>
```

## Utility Components

### FullScreenLoader

Full screen loading indicator.

**Props:**
- Same as LoadingIndicator, with fullScreen set to true

**Example:**
```jsx
<FullScreenLoader message="Processing your request..." />
```

### PageLoader

Loading indicator for page content.

**Props:**
- Same as LoadingIndicator, with size set to "large" and appropriate classes

**Example:**
```jsx
<PageLoader message="Loading claims..." />
```

### InlineLoader

Small inline loading indicator.

**Props:**
- Same as LoadingIndicator, with size set to "small" and appropriate classes

**Example:**
```jsx
<InlineLoader />
```

## Page Components

### Dashboard

Main dashboard page.

**Example:**
```jsx
<Dashboard />
```

### Claims

Claims management page.

**Example:**
```jsx
<Claims />
```

### ClaimDetail

Detailed view of a claim.

**Props:**
- Uses route params for claimId

**Example:**
```jsx
<ClaimDetail />
```

### Reports

Reports management page.

**Example:**
```jsx
<Reports />
```

### Settings

User settings page.

**Example:**
```jsx
<Settings />
```

### Billing

Subscription and billing management page.

**Example:**
```jsx
<Billing />
```

## Context Providers

### AuthProvider

Provides authentication context.

**Example:**
```jsx
<AuthProvider>
  <App />
</AuthProvider>
```

### PhotoProvider

Provides photo management context.

**Example:**
```jsx
<PhotoProvider>
  <App />
</PhotoProvider>
```

### UserProvider

Provides user context.

**Example:**
```jsx
<UserProvider>
  <App />
</UserProvider>
```

## Custom Hooks

### useAuth

Hook for accessing authentication context.

**Example:**
```jsx
const { user, isAuthenticated, login, logout } = useAuth()
```

### usePhotos

Hook for accessing photo context.

**Example:**
```jsx
const { photos, addPhotos, updatePhoto, removePhoto } = usePhotos()
```

### useSupabase

Hook for Supabase data fetching with authentication.

**Example:**
```jsx
const { data, isLoading, error, fetchData } = useSupabase(fetchFn, [dependency])
```

### useClaims

Hook for fetching claims data.

**Example:**
```jsx
const { claims, isLoading, error, fetchClaims } = useClaims(userId)
```

### usePhotos

Hook for fetching photos data.

**Example:**
```jsx
const { photos, isLoading, error, fetchPhotos } = usePhotos(claimId)
```

### useReports

Hook for fetching reports data.

**Example:**
```jsx
const { reports, isLoading, error, fetchReports } = useReports(userId, claimId)
```

### useStorage

Hook for file uploads with progress tracking.

**Example:**
```jsx
const { uploadPhoto, uploadReport, deleteFile, isUploading, progress, error } = useStorage()
```

### useAsync

Hook for handling async operations with loading and error states.

**Example:**
```jsx
const { execute, status, data, error, isLoading, isSuccess, isError } = useAsync(asyncFunction)
```

### useAsyncWithRetry

Hook for handling async operations with automatic retries.

**Example:**
```jsx
const { execute, status, data, error, retries, isRetrying } = useAsyncWithRetry(asyncFunction, {
  maxRetries: 3,
  retryDelay: 1000
})
```

### useImageLazyLoad

Hook for lazy loading images.

**Example:**
```jsx
const { imgRef, isVisible, isLoaded, error, onLoad, onError } = useImageLazyLoad({
  threshold: 0.1,
  rootMargin: '0px'
})
```

