#!/bin/bash

# Create the S3 bucket in LocalStack
echo "Creating S3 bucket: hr-tool-uploads..."
docker exec -t localstack awslocal s3 mb s3://hr-tool-uploads

# Verify the bucket was created
echo "Verifying bucket creation..."
docker exec -t localstack awslocal s3 ls

echo "S3 Setup Complete!"
