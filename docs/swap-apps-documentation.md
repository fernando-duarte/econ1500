# Swapping Your EC2 App

_A reference guide to deploy and switch Node.js/PM2 apps on EC2 with Elastic IP & Route 53_

## Prerequisites

- An EC2 instance (Ubuntu) accessible via SSH
- Elastic IP attached & Route 53 DNS record pointing to it
- PM2 installed globally (`npm install -g pm2`)
- Git installed (`sudo apt-get install git`)

## Directory Structure

Choose or create a base directory for your applications:

```bash
mkdir -p ~/apps
cd ~/apps
```

## 1. Clone the New Repository

```bash
git clone <repo-url> new-app
cd new-app
```

## 2. Install Dependencies & Build

```bash
npm install
npm run build # if applicable
```

> Copy or configure any needed `.env` or config files (e.g. `cp ../old-app/.env .`)

## 3. Switch the Running Process

1. **Stop & remove** the old PM2 process:
   ```bash
   pm2 stop game-server
   pm2 delete game-server
   ```
2. **Start** the new app under the same name:
   ```bash
   export PORT=80           # or your desired port
   pm2 start npm --name game-server -- start
   ```
   Or, if you run a built file directly:
   ```bash
   pm2 start dist/index.js --name game-server
   ```

## 4. Verify Deployment

```bash
pm2 ls
pm2 logs game-server   # Look for “listening on port …”
```

Visit your domain or Elastic IP to confirm the new app is live.

## Optional: Zero-Downtime Rollout

1. Use release folders:
   ```bash
   cd ~/apps
   git clone <repo-url> release-v2
   ```
2. Maintain a symlink:
   ```bash
   ln -sfn ~/apps/release-v2 ~/apps/current
   ```
3. Point PM2 to `~/apps/current` in your ecosystem file, then:
   ```bash
   pm2 reload game-server
   ```
4. To roll back:
   ```bash
   ln -sfn ~/apps/release-v1 ~/apps/current
   pm2 reload game-server
   ```

## Tips & Best Practices

- Keep your `.env` files secure (e.g. using `pm2 secrets` or AWS Parameter Store).
- Version your PM2 ecosystem file for reproducibility.
- Automate builds with CI/CD (e.g. GitHub Actions → deploy script).
- Monitor health with PM2 built-in or external tools (New Relic, Datadog).
