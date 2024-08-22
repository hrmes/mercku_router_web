ln -sf /app/node_modules node_modules
MODEL_ID=${MODEL_ID} CUSTOMER_ID=${CUSTOMER_ID} pnpm -F ${MODEL} rs:build || exit 1
mkdir -p output
tar cf output/webui-${VERSION}-${CUSTOMER_ID}.tar -C ${MODEL} dist
aws s3 cp output/webui-${VERSION}-${CUSTOMER_ID}.tar s3://mercku-public/webui/new/webui-v${VERSION}-${CUSTOMER_ID}.tar
echo "upload successfully, you can download from https://mercku-public.s3.cn-north-1.amazonaws.com.cn/webui/new/webui-v${VERSION}-${CUSTOMER_ID}.tar"
