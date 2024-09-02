ln -sf /app/node_modules node_modules
MODEL_ID=${MODEL_ID} CUSTOMER_ID=${CUSTOMER_ID} pnpm -F ${MODEL} rs:dev
