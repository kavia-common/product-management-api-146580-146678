#!/bin/bash
cd /home/kavia/workspace/code-generation/product-management-api-146580-146678/products_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

