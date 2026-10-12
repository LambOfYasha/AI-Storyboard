# Deployment Guide

## GitHub setup

### Create a repository

Create a new GitHub repository named:

```text
ai-production-storyboard
```

Do not initialize it with files if you already created the repository locally.

### Upload through the GitHub website

1. Open the repository.
2. Select **Add file**.
3. Select **Upload files**.
4. Upload the project files and folders.
5. Add a commit message.
6. Commit the files to the main branch.

### Upload with Git

From the project directory:

```bash
git init
git add .
git commit -m "Initial AI storyboard application"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the repository address.

## Vercel deployment

1. Sign in to Vercel.
2. Select **Add New Project**.
3. Import the GitHub repository.
4. Select `Other` for the framework preset if required.
5. Leave the build command empty.
6. Leave the installation command empty.
7. Use `.` as the output directory if an output directory is required.
8. Select **Deploy**.

## Updating the application

After changing files:

```bash
git add .
git commit -m "Update storyboard application"
git push
```

The connected Vercel project will create a new deployment from the updated repository.

## Custom domain

A custom domain can be assigned from the Vercel project settings.

Suggested subdomains:

```text
storyboard.example.com
production.example.com
boards.example.com
```

## Static application limitations

The deployed site does not automatically synchronize project data between users.

Data is stored locally in each user's browser.

For collaboration, add:

- Authentication
- Cloud database
- Object storage
- Project ownership
- User permissions
- Server-side autosave
- Version history
- Comment and approval tools

## Recommended backup process

At the end of every work session:

1. Select **Save**.
2. Select **Export JSON**.
3. Save a PDF.
4. Copy approved frames into `assets/storyboard-frames/`.
5. Commit approved repository assets.
6. Keep large production media in dedicated cloud storage.
