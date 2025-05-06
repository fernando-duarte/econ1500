# AWS EC2 Deployment Guide for Next.js Application

This guide provides step-by-step instructions for deploying the ECON1500 Next.js application on an Amazon Linux 2023 EC2 instance.

## Prerequisites

- An Amazon EC2 instance with Amazon Linux 2023 AMI
- Your SSH key pair (`.pem` file) econ1500key.pem
- Your EC2 instance's public IP address or DNS name
  - Elastic IP addresses: 3.136.47.163 [Public IP]
  - Public IPv4 DNS: ec2-3-136-47-163.us-east-2.compute.amazonaws.com
- Domain name https://econ1500.org/student.html

## 1. Initial Connection to Your EC2 Instance

```bash
# Change permissions for your key file if needed
chmod 400 path/to/your-key.pem

# Connect to your instance
ssh -i "econ1500key.pem" ec2-user@ec2-3-136-47-163.us-east-2.compute.amazonaws.com
```

## 2. Update System Packages

```bash
# Update all installed packages
sudo dnf update -y
```

## 3. Install Required Software

### Install Node.js 22 (Required by our project)

```bash
# Add the NodeSource repository for Node.js 22
sudo dnf install -y nodejs22

# Verify installation
node -v  # Should show v22.x.x
npm -v   # Should show v10.x.x
```

### Install Git

```bash
sudo dnf install -y git
```

### Install additional build tools if needed

```bash
sudo dnf install -y gcc-c++ make
```

## 4. Clone the Application Repository

```bash
# Clone the repository (substitute with your actual repository URL)
git clone https://github.com/fernando-duarte/econ1500
cd econ1500
```

## 5. Install Application Dependencies

### Install production dependencies first, then minimal build dependencies

```bash
# First install production dependencies
npm install --omit=dev

# Then add essential build dependencies
npm install --no-save typescript @types/node @types/react @types/react-dom tailwindcss autoprefixer postcss @tailwindcss/forms @tailwindcss/typography
```

## 6. Set Up Environment Variables

```bash
# Create a production environment file
cp .env.example .env.production.local

# Edit the file with your production settings
nano .env.production.local
```

## 7. Build the Application

```bash
# Run the build process
npm run build
```

```bash
# Run the build process without linting
npm run build -- --no-lint
```

## 8. Start the Application (Testing)

```bash
# Start the Next.js server to test if everything works
npm run start
```

The application should now be running on port 3000. Open another terminal and test with:

```bash
curl http://localhost:3000
```

## 9. Set Up PM2 Process Manager (For Production)

PM2 ensures your application stays running and restarts automatically if it crashes.

```bash
# Install PM2 globally
npm install -g pm2

# Start the application with PM2
pm2 start npm --name "econ1500" -- start

# Configure PM2 to start on system boot
pm2 startup
# Follow the instructions from the output of the above command
pm2 save
```

## 10. Set Up Nginx as a Reverse Proxy

### Install and configure Nginx

```bash
# Install Nginx
sudo dnf install -y nginx

# Start Nginx and enable it on system boot
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Create Nginx configuration for the application

```bash
# Create a new configuration file
sudo nano /etc/nginx/conf.d/econ1500.conf
```

Add the following content (replace `your-domain-or-ip` with your actual domain or IP):

```nginx
server {
    listen 80;
    server_name econ1500.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Test and apply the Nginx configuration

```bash
# Test the configuration for syntax errors
sudo nginx -t

# If the test is successful, reload Nginx
sudo systemctl reload nginx
```

## 11. Set Up SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot and the Nginx plugin
sudo dnf install -y certbot python3-certbot-nginx

# Obtain and install SSL certificate
sudo certbot --nginx -d econ1500.org

# Follow the interactive prompts
# Certbot will automatically modify your Nginx configuration to use HTTPS
```

## 12. Configure EC2 Security Groups

Ensure your EC2 security group has the following inbound rules:

- SSH (port 22) - For administration
- HTTP (port 80) - For web traffic
- HTTPS (port 443) - For secure web traffic

You can configure this in the AWS Console:

1. Go to EC2 > Security Groups
2. Select the security group associated with your instance
3. Edit inbound rules to allow these ports

## 13. Monitor Application

```bash
# View logs
pm2 logs

# Monitor application status
pm2 monit

# View application status
pm2 status
```

## Troubleshooting

### If the application fails to start:

1. Check the logs:

```bash
pm2 logs econ1500
```

2. Verify environment variables:

```bash
cat .env.production.local
```

3. Check for build errors:

```bash
npm run build
```

4. Ensure proper file permissions:

```bash
chmod -R 755 .next
```

### If Nginx isn't serving the application:

1. Check Nginx status:

```bash
sudo systemctl status nginx
```

2. Check Nginx error logs:

```bash
sudo cat /var/log/nginx/error.log
```

## Updating the Application

When you need to update the application:

````bash
# Navigate to your application directory
cd econ1500

# Pull the latest changes
git pull

# Install dependencies (if they've changed)
```bash
# First install production dependencies
npm install --omit=dev

# Then add essential build dependencies
npm install --no-save typescript @types/node @types/react @types/react-dom tailwindcss autoprefixer postcss @tailwindcss/forms @tailwindcss/typography
````

# Rebuild the application

```bash
# Run the build process
npm run build
```

```bash
# Run the build process without linting
npm run build -- --no-lint
```

# Restart the application

pm2 restart econ1500

````

## Backup and Restore

### Creating a backup:

```bash
# Create a backup of your application files
tar -czf econ1500-backup.tar.gz econ1500
````

### Restoring from backup:

```bash
# Extract the backup
tar -xzf econ1500-backup.tar.gz
```
