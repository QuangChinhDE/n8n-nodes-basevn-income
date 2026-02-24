import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { incomeApiRequest } from '../../shared/transport';
import { cleanBody, processResponse } from '../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['income'], operation: ['editItems'] } },
		default: '',
		description: 'Username of the person editing items',
	},
	{
		displayName: 'Income ID',
		name: 'id',
		type: 'number',
		required: true,
		displayOptions: { show: { resource: ['income'], operation: ['editItems'] } },
		default: 0,
		description: 'ID of the income to edit',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['income'], operation: ['editItems'] } },
		options: [
			{
				displayName: 'Custom Item Lines',
				name: 'custom_item_lines',
				type: 'string',
				default: '',
				placeholder: 'san_pham:name.0-code.1-amount_excl.2-tax_policy.3',
				description: 'Custom item lines mapping (format: table_name:field.0-field.1-...)',
			},
		],
	},
	{
		displayName: 'Encoded Table Fields',
		name: 'encodedTables',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Encoded Table',
		default: {},
		displayOptions: { show: { resource: ['income'], operation: ['editItems'] } },
		description: 'Encoded table data (base64)',
		options: [
			{
				name: 'tables',
				displayName: 'Table',
				values: [
					{
						displayName: 'Table Name',
						name: 'name',
						type: 'string',
						default: '',
						placeholder: 'e.g., san_pham',
						description: 'Name of the encoded table field',
					},
					{
						displayName: 'Encoded Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Base64 encoded table data',
					},
				],
			},
		],
	},
	{
		displayName: 'Custom Fields',

		name: 'customFields',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Custom Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['income'],
				operation: ['editItems'],
			},
		},
		description: 'Custom fields (with custom_ prefix)',
		options: [
			{
				name: 'fields',
				displayName: 'Field',
				values: [
					{
						displayName: 'Field Name',
						name: 'name',
						type: 'string',
						default: '',
						placeholder: 'e.g., custom_field_name',
						description: 'Custom field name (must start with custom_)',
					},
					{
						displayName: 'Field Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the custom field',
					},
				],
			},
		],
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	const username = this.getNodeParameter('username', index) as string;
	const id = this.getNodeParameter('id', index) as number;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;
	const encodedTables = this.getNodeParameter('encodedTables', index, {}) as IDataObject;
	const customFields = this.getNodeParameter('customFields', index, {}) as IDataObject;

	// Process encoded table fields
	const encodedTablesData: IDataObject = {};
	if (encodedTables.tables && Array.isArray(encodedTables.tables)) {
		for (const table of encodedTables.tables as Array<{name: string; value: string}>) {
			if (table.name && table.value) {
				encodedTablesData[table.name] = table.value;
			}
		}
	}

	// Process custom fields
	const customFieldsData: IDataObject = {};
	if (customFields.fields && Array.isArray(customFields.fields)) {
		for (const field of customFields.fields as Array<{name: string; value: string}>) {
			if (field.name && field.value) {
				customFieldsData[field.name] = field.value;
			}
		}
	}

	const body = cleanBody({
		username,
		id,
		...updateFields,
		...encodedTablesData,
		...customFieldsData,
	});

	const endpoint = '/income/adjust.items';
	const response = await incomeApiRequest.call(this, 'POST', endpoint, body);
	
	if (response.code === 1) {
		const result = processResponse(response);
		returnData.push({
			json: result,
			pairedItem: index,
		});
	} else {
		throw new Error(`API Error: ${response.message || 'Unknown error'}`);
	}

	return returnData;
}
