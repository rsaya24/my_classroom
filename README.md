# My Classroom

A React dashboard for importing PNG syllabuses, tracking topics, and generating and saving unit notes. The Express API stores subjects, completion status, and notes in MongoDB Atlas. Gemini handles syllabus extraction and note generation.

## Run locally

1. Install Node.js 22.13 or later and run `npm ci` from this folder.
2. Copy `.env.example` to `.env`. In Atlas, create a database user with `readWrite` on `my_classroom`, allow the app's outbound network in the Atlas IP access list, and copy the application's driver connection string into `MONGODB_URI`. Replace the password placeholder with the URL-encoded database-user password. Atlas database users are separate from Atlas dashboard sign-ins.
3. Set `GEMINI_API_KEY` to your current Gemini key. Set `GEMINI_MODEL` if your key uses another model. Keep both credential values out of Git.
4. Run `npm run api` and `npm run dev` in two terminals. Open the Vite URL.

Atlas creates the database on the first successful write. To reuse an existing database, set `MONGODB_DB` to its exact name. A PNG can be up to 3 MB.

## Deploy on Vercel

Import the repository with the repository root selected. Use the Vite preset, `npm ci` to install, `npm run build` to build, and `dist` as the output directory. Set the variables from `.env.example` for Production and redeploy. Ensure the deployment's outbound network is authorized in Atlas. Each user creates an account with an email and a password of at least 12 characters. Subjects, progress, and notes belong to that account. Earlier shared records have no owner and stay out of personal dashboards. If Vercel deployment protection is enabled, visitors must also be allowed to reach the site.

Verify by creating an account, uploading a small syllabus PNG, checking a topic, and generating unit notes. Sign out and create a second account to check that its dashboard is empty. Sign back into the first account and confirm its progress and notes persist.

[Atlas connection guide](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/)
