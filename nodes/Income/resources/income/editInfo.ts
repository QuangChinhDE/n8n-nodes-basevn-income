import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { incomeApiRequest } from '../../shared/transport';
import { cleanBody, processResponse } from '../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Income Type Token',
		name: 'incomeTypeToken',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['income'], operation: ['editInfo'] } },
		default: '',
		description: 'Token for the income type (used in webhook URL)',
	},
	{
		displayName: 'Creator Username',
		name: 'creator_username',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['income'], operation: ['editInfo'] } },
		default: '',
		description: 'Username of the person editing the income',
	},
	{
		displayName: 'UUID',
		name: 'uuid',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['income'], operation: ['editInfo'] } },
		default: '',
		description: 'Unique identifier of the income',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		default: {},
		displayOptions: { show: { resource: ['income'], operation: ['editInfo'] } },
		options: [
			{ displayName: 'Income Content', name: 'income_content', type: 'string', default: '', description: 'Income description or content' },
			{ displayName: 'Income Followers', name: 'income_followers', type: 'string', default: '', description: 'Comma-separated list of follower usernames' },
			{ displayName: 'Income Name', name: 'income_name', type: 'string', default: '', description: 'Name of the income' },
			{ displayName: 'Income Since', name: 'income_since', type: 'string', default: '', description: 'Income start date' },
			{ displayName: 'Transform Categories Keys', name: 'transform_categories_keys', type: 'string', default: '', description: 'Category transformation keys' },
			{ displayName: 'Transform Files Keys', name: 'transform_files_keys', type: 'string', default: '', description: 'File transformation keys' },
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
				operation: ['editInfo'],
			},
		},
		description: 'Additional custom fields for the income',
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
						placeholder: 'e.g., custom_field_1',
						description: 'Custom field name',
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
	
	const incomeTypeToken = this.getNodeParameter('incomeTypeToken', index) as string;
	const creatorUsername = this.getNodeParameter('creator_username', index) as string;
	const uuid = this.getNodeParameter('uuid', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;
	const customFields = this.getNodeParameter('customFields', index, {}) as IDataObject;

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
		creator_username: creatorUsername,
		uuid,
		...updateFields,
		...customFieldsData,
	});

	const endpoint = `/webhook/income/soft.update/${incomeTypeToken}`;
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
