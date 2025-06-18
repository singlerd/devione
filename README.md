# 🧾 Multi-CMS Development Setup with DDEV + Shared PHP API Client

This repository contains multiple CMS projects (Drupal, Magento, WooCommerce, PrestaShop), all configured for local development.  
Each project uses the shared [**Payment Processor** PHP library](https://github.com/singlerd/payment-processor) via Composer from a custom GitHub branch.

---

## 📦 Shared PHP API Client Setup

The `payment-processor` library is installed in every CMS using Composer.

### ➕ Step 1: Add to `composer.json`

```json
"repositories": [
  {
    "type": "vcs",
    "url": "https://github.com/singlerd/payment-processor"
  }
]
```

## Drupal
```bash
ddev start
ddev composer install
```
🔐 Admin Login
https://drupal.ddev.site/user/login

## Magento

```bash
ddev start
ddev composer install
ddev ssh
bin/magento info:adminuri
```

🔐 Admin Login
Run the command above to find your admin path.
Example: https://magento.ddev.site/admin_abc123

## PrestaShop (Docker Only)
```bash
docker compose up -d

# Then inside the PHP container:
docker exec -it <php-container-name> bash
composer install
```

🔐 Admin Login
http://localhost:8001/admin-dev/

## WooCommerce (WordPress)
``` bash
ddev start
ddev composer install

```
🔐 Admin Login
https://wordpress.ddev.site/wp-admin

## Vue App
The recommended approach is to use a local npm installation with SSL support; however, running the application through DDEV is also possible.
``` bash
npm ci
npm run dev
```

The Vue app is using an API from Drupal, so the Drupal project needs to be running.
