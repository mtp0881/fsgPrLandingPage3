FSG Landing Page - Azure Migration Guide
==========================================

This guide will help you migrate from Vercel + Cloudinary to Azure

## Prerequisites:
1. Azure CLI installed and logged in
2. Azure account with sufficient permissions
3. GitHub repository access

## Steps to migrate:

### 1. Restart PowerShell and run Azure setup:
```powershell
# Open new PowerShell as Administrator
cd C:\Users\PhuMT1\Desktop\fsg3
.\azure-setup.ps1
```

### 2. Copy environment variables:
After azure-setup.ps1 completes, copy the displayed environment variables to .env.local

### 3. Test local setup:
```bash
npm run dev
```

### 4. Update GitHub repository secrets:
Add these secrets to your GitHub repository:
- AZURE_STATIC_WEB_APPS_API_TOKEN
- AZURE_STORAGE_CONNECTION_STRING  
- AZURE_COSMOS_ENDPOINT
- AZURE_COSMOS_KEY

### 5. Deploy to Azure:
Push changes to main branch to trigger Azure deployment

## Cost Comparison:
- Before: ~$120/month (Vercel Pro + Cloudinary)
- After: ~$10/month (Azure services)

## Benefits:
- 90% cost reduction
- Better performance in Asia region
- Integrated Microsoft ecosystem
- Enterprise-grade security
