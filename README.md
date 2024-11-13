# Property Data Collector

Property Data Collector (PDC) is CloudPano's integration platform with GSEs (Fannie Mae and Freddie Mac) for property data collection in the Uniform Property Dataset (UPD) format.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

1. Use Node 20
2. Locally installed Supabase (see [official instruction](https://supabase.com/docs/guides/cli/local-development))

### Environment variables

Get them from Mikhail or Clayton. Store them in file called .env.local in root dir.
The environment variables for Supabase you will get after installing Supabase locally.

### Installing

Run `npm i`

### Development

For development we use [Supabase multiple environments](https://supabase.com/docs/guides/cli/managing-environments?queryGroups=environment&environment=staging) flow. Changes to the database model are made using Supabase migrations. Migrations are applied when merging with branches `develop` and `main` for `staging` and `prod` the environment, respectively.

During the development process, we use a strategy with three branches `main` (for `PROD` environment), `develop` and `feature/<shor-name>_<click_up_task_id>` (for example `feature/login_cu-8694e4hn8`), that is `gitflow` variant (this is due to the absence of autotests and the use of only manual testing). Perhaps in the future we will consider a different strategy, subject to the implementation of full autotesting at CI/CD stage.

#### Description of the process of working on tasks:

1. We take the task to work (move it in ClickUp to `IN PROGRESS` column)
2. Create branch for the task `feature/<shor-name>_<click_up_task_id>` from branch the `develop` branch
3. After finishing work on the task, we creates the PR into the `develop` branch and add a reviewer
4. Move the task in ClickUp to the `CODE REVIEW` column
5. Achieve successful completion of the PR review
6. Next, the reviewer will merge the task branch into `develop` (using splash strategy) and move the task to column `READY FOR QA`
   6.1. If there are errors in the task (the QA engineer returned the task), create new branch from branch `develop` and move the task to column `IN PROGRESS` (then follow steps 3 - 5)
7. After successful completion, the task is moved to column `IN REVIEW` (to prepare for release)

#### Regarding working with migrations, follow the following flow:

1. When developing locally
    1. Create a migration file using the appropriate Supabase command
    2. In the created migration file, write the migration code (sql code)
    3. If test/initialization data is needed for the migration, update the file with seeds (this is necessary because during local development, when deploying a migration, the database is completely cleared and all data must be filled in again)
    4. In order to apply and test the migration on the local environment, run command `supabase db reset`

2. Deployment on staging server
    1. After finished working on the task, create a PR into `develop` branch (see description of the general process of working above). In this case, the GitHub action will run tests for the migration, but will not apply it. If there are errors, they should be corrected and the PR updated before sending to review.
    2. After the PR is approved, reviewer merge the changes into develop branch. This will automatically launch the GitHub action, which will perform migration testing and deploy migrations to the staging server. That is, after this the feature branch will be ready for QA stage.

### Deployment

Commit to `develop` (or `main` for `prod` environment) and push to trigger Supabase and Vercel `staging` (or `prod`) deployment

## Built With

- [Next.js](https://nextjs.org/) - The web framework used
- [shadcn](https://ui.shadcn.com/) - Used to create the component library
- [Supabase](https://supabase.com/docs/reference/javascript/introduction) - PostgreSQL database and authentication

## APIs

- Fannie Mae
- Freddie Mac
