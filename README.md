# Shopping Cart Application

A modern shopping cart application built with Laravel 12 and React (Inertia.js).

## Requirements

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm$$
- SQLite (included) or MySQL/PostgreSQL

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/areejrazzaq/shopping-cart.git
cd shopping-cart
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Environment Configuration

Copy the `.env.example` file to `.env` (if it exists) or create a new `.env` file:

```bash
cp .env.example .env
```

Or manually create `.env` with the following minimum configuration:

```env
APP_NAME="Shopping Cart"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=

QUEUE_CONNECTION=database

MAIL_MAILER=log
MAIL_FROM_ADDRESS=hello@example.com
MAIL_FROM_NAME="${APP_NAME}"
ADMIN_EMAIL=admin@example.com
```

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Database Setup

The application uses MySQL by default. update your `.env` file with database credentials and create the database

Run migrations:

```bash
php artisan migrate
```

Seed the database with sample products:

```bash
php artisan db:seed
```

### 6. Install Frontend Dependencies

```bash
npm install
```

### 7. Build Frontend Assets

For development:

```bash
npm run dev
```

For production:

```bash
npm run build
```

### 8. Start the Development Server

You can use the convenient dev script that starts the server, queue worker, and Vite dev server:

```bash
composer run dev
```

Or start them individually:

```bash
# Terminal 1: Start Laravel server
php artisan serve

# Terminal 2: Start queue worker
php artisan queue:work

# Terminal 3: Start Vite dev server
npm run dev
```

### Quick Setup Script

Alternatively, you can use the provided setup script:

```bash
composer run setup
```

This will:
- Install Composer dependencies
- Copy `.env.example` to `.env` (if it doesn't exist)
- Generate application key
- Run migrations
- Install npm dependencies
- Build frontend assets

## Queue & Scheduler Setup

### Queue Configuration

The application uses the **database** queue driver by default. This requires the `jobs` table, which is created automatically when you run migrations.

### Running Queue Workers

#### Development

For development, run the queue worker manually:

```bash
php artisan queue:work
```

Or use the dev script which includes the queue worker:

```bash
composer run dev
```

#### Production

For production, use a process manager like Supervisor to keep the queue worker running. Example Supervisor configuration:

```ini
[program:shopping-cart-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/your/project/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/path/to/your/project/storage/logs/worker.log
stopwaitsecs=3600
```

### Scheduler Setup

The application includes a scheduled job that sends daily order reports at 8:00 PM. To enable the scheduler, you need to add a cron entry to your server.

#### Add Cron Entry

Add this entry to your crontab:

```bash
* * * * * cd /path/to/your/project && php artisan schedule:run >> /dev/null 2>&1
```

**Windows (Task Scheduler):**

For Windows development, you can use Task Scheduler or run the scheduler manually:

```bash
php artisan schedule:work
```

This will keep the scheduler running continuously (useful for development).

#### Scheduled Tasks

- **Daily Order Report**: Runs every day at 8:00 PM (`routes/console.php`)
  - Sends an email report with order statistics from the last 24 hours
  - Can be manually triggered with: `php artisan report:daily`

### Queue Tables

The following tables are required for the queue system:
- `jobs` - Stores queued jobs
- `job_batches` - Stores job batch information
- `failed_jobs` - Stores failed job information

These tables are created automatically when you run `php artisan migrate`.

## Dummy Admin Email

The application sends administrative emails (like daily order reports and low stock alerts) to an admin email address configured in your environment.

### Configuration

Set the `ADMIN_EMAIL` environment variable in your `.env` file:

```env
ADMIN_EMAIL=admin@example.com
```

If `ADMIN_EMAIL` is not set, it will fall back to `MAIL_FROM_ADDRESS`, or default to `admin@example.com`.

### Mail Driver

By default, the application uses the `log` mail driver, which writes emails to `storage/logs/laravel.log` instead of actually sending them. This is useful for development and testing.

To view emails in development:
1. Check `storage/logs/laravel.log` for email content
2. Or configure a real mail driver (SMTP, Mailgun, etc.) in your `.env` file

### Testing Email Functionality

To test the daily order report email manually:

```bash
php artisan report:daily
```

This will dispatch the daily order report job. If using the `log` driver, check `storage/logs/laravel.log` for the email content.

### Production Email Setup

For production, configure a real mail driver in your `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
ADMIN_EMAIL=admin@yourdomain.com
```


## Development

- Frontend: React with TypeScript, Tailwind CSS, Inertia.js
- Backend: Laravel 12
- Database: MySQL
- Authentication: Laravel Fortify
