# Azure Setup Script for FSG Landing Page
# Run this script after restarting PowerShell

Write-Host "🚀 Setting up Azure resources for FSG Landing Page..." -ForegroundColor Green

# Variables
$resourceGroupName = "fsg-webapp-rg"
$location = "East Asia"
$storageAccountName = "fsgstorage2025"
$cosmosAccountName = "fsg-content-db"
$staticWebAppName = "fsg-landing-page"

# Login to Azure
Write-Host "📝 Logging into Azure..." -ForegroundColor Yellow
az login

# Create Resource Group
Write-Host "📁 Creating Resource Group..." -ForegroundColor Yellow
az group create --name $resourceGroupName --location $location

# Create Storage Account for images
Write-Host "💾 Creating Storage Account..." -ForegroundColor Yellow
az storage account create `
  --name $storageAccountName `
  --resource-group $resourceGroupName `
  --location $location `
  --sku Standard_LRS `
  --allow-blob-public-access true

# Get storage connection string
Write-Host "🔑 Getting Storage Connection String..." -ForegroundColor Yellow
$storageConnectionString = az storage account show-connection-string `
  --name $storageAccountName `
  --resource-group $resourceGroupName `
  --output tsv

# Create blob container for images
Write-Host "📦 Creating blob container..." -ForegroundColor Yellow
az storage container create `
  --name images `
  --connection-string $storageConnectionString `
  --public-access blob

# Create Cosmos DB for content storage
Write-Host "🌌 Creating Cosmos DB..." -ForegroundColor Yellow
az cosmosdb create `
  --name $cosmosAccountName `
  --resource-group $resourceGroupName `
  --default-consistency-level Session `
  --locations regionName=$location

# Create Cosmos DB database
Write-Host "🗄️ Creating Cosmos database..." -ForegroundColor Yellow
az cosmosdb sql database create `
  --account-name $cosmosAccountName `
  --resource-group $resourceGroupName `
  --name ContentDB

# Create Cosmos DB container
Write-Host "📋 Creating Cosmos container..." -ForegroundColor Yellow
az cosmosdb sql container create `
  --account-name $cosmosAccountName `
  --resource-group $resourceGroupName `
  --database-name ContentDB `
  --name content `
  --partition-key-path "/language" `
  --throughput 400

# Get Cosmos DB connection details
Write-Host "🔗 Getting Cosmos DB details..." -ForegroundColor Yellow
$cosmosEndpoint = az cosmosdb show `
  --name $cosmosAccountName `
  --resource-group $resourceGroupName `
  --query documentEndpoint `
  --output tsv

$cosmosKey = az cosmosdb keys list `
  --name $cosmosAccountName `
  --resource-group $resourceGroupName `
  --query primaryMasterKey `
  --output tsv

# Create Static Web App
Write-Host "🌐 Creating Static Web App..." -ForegroundColor Yellow
az staticwebapp create `
  --name $staticWebAppName `
  --resource-group $resourceGroupName `
  --source https://github.com/mtp0881/fsgPrLandingPage2 `
  --location $location `
  --branch main `
  --app-location "/" `
  --output-location ".next"

Write-Host "✅ Azure resources created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Environment Variables for your .env.local:" -ForegroundColor Cyan
Write-Host "AZURE_STORAGE_CONNECTION_STRING=$storageConnectionString" -ForegroundColor White
Write-Host "AZURE_COSMOS_ENDPOINT=$cosmosEndpoint" -ForegroundColor White
Write-Host "AZURE_COSMOS_KEY=$cosmosKey" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy the environment variables above to your .env.local file"
Write-Host "2. Install Azure packages: npm install @azure/storage-blob @azure/cosmos"
Write-Host "3. Update your code to use Azure services"
Write-Host "4. Deploy your app to the Static Web App"
