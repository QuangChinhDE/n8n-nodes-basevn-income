# BaseVN - App Income (v0.1.0)

## Project Summary

Complete n8n community node implementation for BaseVN Income API with full TypeScript support following the Service app pattern.

## Structure

```
n8n-nodes-basevn-income/
├── package.json (v0.1.0)
├── tsconfig.json
├── eslint.config.mjs
├── credentials/
│   └── IncomeApi.credentials.ts
├── icons/
│   └── income.svg
└── nodes/Income/
    ├── Income.node.ts (main node)
    ├── Income.node.json
    ├── IncomeTrigger.node.ts
    ├── IncomeTrigger.node.json
    ├── shared/
    │   ├── transport.ts (incomeApiRequest functions)
    │   ├── utils.ts (cleanBody, processResponse, etc.)
    │   └── descriptions.ts
    └── resources/
        ├── inflow/ (4 operations)
        │   ├── create.ts
        │   ├── get.ts
        │   ├── getAll.ts
        │   ├── getLastUpdate.ts
        │   └── index.ts
        └── income/ (9 operations)
            ├── create.ts
            ├── get.ts
            ├── getAll.ts
            ├── getLastUpdate.ts
            ├── editInfo.ts
            ├── editItems.ts
            ├── editDeductions.ts
            ├── cancel.ts
            ├── markInvoiced.ts
            └── index.ts
```

## Implemented Operations

### Inflow Resource (4 operations)
- **create**: Create new inflow with customFields support
- **get**: Get single inflow by ID
- **getAll**: Get all inflows with 18 filter options
- **getLastUpdate**: Get inflows by timestamp range

### Income Resource (9 operations)
- **create**: Create income (webhook endpoint with encodedTables support)
- **get**: Get single income by ID
- **getAll**: Get all incomes with 27 filter options
- **getLastUpdate**: Get incomes by timestamp range
- **editInfo**: Edit income information (webhook)
- **editItems**: Edit item lines (extapi)
- **editDeductions**: Edit deduction lines (extapi)
- **cancel**: Cancel an income (webhook)
- **markInvoiced**: Mark income as invoiced (webhook)

## API Endpoints

### Inflow Endpoints (extapi/v1)
- POST /inflow/create
- POST /inflow/get
- POST /inflows/get
- POST /inflows/last.update

### Income Endpoints (mixed)
- POST /webhook/income/create.waiting.receive/{token}
- POST /income/get
- POST /incomes/get
- POST /incomes/last.update
- POST /webhook/income/soft.update/{token}
- POST /income/adjust.items
- POST /income/adjust.deductions
- POST /webhook/income/cancel/{token}
- POST /webhook/income/mark.invoiced/{token}

## Features

- ✅ TypeScript build successful
- ✅ All 13 operations implemented
- ✅ Custom fields support (fixedCollection)
- ✅ Encoded tables support (base64 data)
- ✅ Webhook + extapi endpoint patterns
- ✅ Comprehensive filtering options
- ✅ Pagination support
- ✅ Error handling with continueOnFail
- ⚠️ 5 minor lint warnings (collection field ordering - non-functional)

## Build Status

```
TypeScript build: ✅ Successful
Static files: ✅ Copied
Package: ✅ Ready for publishing
```

## Next Steps

1. Initialize git repository
2. Commit initial implementation
3. Test in n8n instance (if available)
4. Publish to npm registry

## Notes

- Authentication: Uses `access_token_v2` in POST body
- Response pattern: `{ code: 1, ...data }` for success
- Follows exact patterns from Service app
- All endpoints match provided cURL collection
