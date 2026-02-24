import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { incomeApiRequest } from '../../shared/transport';
import { cleanBody, processResponse } from '../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Income Type Token',
		name: 'incomeTypeToken',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['income'], operation: ['markInvoiced'] } },
		default: '',
		description: 'Token for the income type (used in webhook URL)',
	},
	{
		displayName: 'Creator Username',
		name: 'creator_username',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['income'], operation: ['markInvoiced'] } },
		default: '',
		description: 'Username of the person marking as invoiced',
	},
	{
		displayName: 'UUID',
		name: 'uuid',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['income'], operation: ['markInvoiced'] } },
		default: '',
		description: 'Unique identifier of the income',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['income'], operation: ['markInvoiced'] } },
		options: [
			{
				displayName: 'Income Since',
				name: 'income_since',
				type: 'string',
				default: '',
				description: 'Income start date',
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
		displayOptions: { show: { resource: ['income'], operation: ['markInvoiced'] } },
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
						placeholder: 'e.g., custom_file_hoa_don, custom_tinh_trang_xuat_hoa_don',
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
	
	const endpoint = `/webhook/income/mark.invoiced/${incomeTypeToken}`;
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
