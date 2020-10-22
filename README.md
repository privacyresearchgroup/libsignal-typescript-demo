```
yarn build
aws s3 sync build/ s3://signal-demo.privacyresearch.io --profile pr
aws --profile pr cloudfront create-invalidation --distribution-id E3VUKRDND96RQT --paths "/*"

```
