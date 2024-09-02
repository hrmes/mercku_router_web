set -x
mkdir -p output
cd ${MODEL} && tar cf ../output/webui-${VERSION}-${CUSTOMER_ID}-${MODEL_ID}.tar dist; cd -
aws s3 cp output/webui-${VERSION}-${CUSTOMER_ID}-${MODEL_ID}.tar s3://mercku-public/webui/new/webui-v${VERSION}-${CUSTOMER_ID}-${MODEL_ID}.tar
echo "upload successfully, you can download from https://mercku-public.s3.cn-north-1.amazonaws.com.cn/webui/new/webui-v${VERSION}-${CUSTOMER_ID}-${MODEL_ID}.tar"
