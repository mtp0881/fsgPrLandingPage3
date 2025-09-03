@echo off
echo Creating .env.local file...
echo.
echo IMPORTANT: You need to replace the placeholder values with your actual Azure keys!
echo.

(
echo # Azure Storage Configuration
echo AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=fsgstorage2025;AccountKey=YOUR_STORAGE_KEY_HERE;EndpointSuffix=core.windows.net"
echo AZURE_STORAGE_CONTAINER_NAME="images"
echo.
echo # Azure Cosmos DB Configuration  
echo AZURE_COSMOS_CONNECTION_STRING="AccountEndpoint=https://fsg-content-db.documents.azure.com:443/;AccountKey=YOUR_COSMOS_KEY_HERE;"
echo AZURE_COSMOS_DATABASE_NAME="content-db"
echo AZURE_COSMOS_CONTAINER_NAME="content"
echo.
echo # Environment
echo NODE_ENV="production"
) > .env.local

echo .env.local template created successfully!
echo.
echo NEXT STEPS:
echo 1. Edit .env.local file and replace:
echo    - YOUR_STORAGE_KEY_HERE with your actual Azure Storage key
echo    - YOUR_COSMOS_KEY_HERE with your actual Cosmos DB key
echo.
echo 2. Get your keys from Azure Portal:
echo    Storage: Storage Account ^> Access Keys ^> Connection String
echo    Cosmos: Cosmos DB ^> Keys ^> Primary Connection String
