#/bin/bash
#upload files to S3
aws s3 cp ./dist s3://BUCKET_NAME --recursive --acl public-read
