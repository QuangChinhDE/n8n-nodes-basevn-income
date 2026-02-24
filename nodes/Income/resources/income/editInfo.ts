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
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['income'], operation: ['editInfo'] } },
		options: [
			{ displayName: 'Due Date', name: 'due_date', type: 'string', default: '', placeholder: '31/01/2024', description: 'Due date (DD/MM/YYYY)' },
			{ displayName: 'Followers', name: 'followers', type: 'string', default: '', description: 'Comma-separated list of follower usernames' },
			{ displayName: 'Income Content', name: 'income_content', type: 'string', typeOptions: { rows: 4 }, default: '', description: 'Income description or content' },
			{ displayName: 'Income Name', name: 'income_name', type: 'string', default: '', description: 'Name of the income' },
			{ displayName: 'Income Since', name: 'income_since', type: 'string', default: '', placeholder: '01/01/2024', description: 'Income start date (DD/MM/YYYY or timestamp)' },
			{ displayName: 'Record Date', name: 'record_date', type: 'string', default: '', placeholder: '20/07/2024', description: 'Record date (DD/MM/YYYY)' },
			{ displayName: 'Revenue Center', name: 'revenue_center', type: 'string', default: '', description: 'Revenue center name' },
			{ displayName: 'Revenue Unit', name: 'revenue_unit', type: 'string', default: '', placeholder: 'Phòng KD 2 - Hà Nội', description: 'Revenue unit name' },
			{ displayName: 'Salesperson', name: 'salesperson', type: 'string', default: '', description: 'Salesperson username' },
			{ displayName: 'Transform Categories Keys', name: 'transform_categories_keys', type: 'string', default: '', placeholder: 'khu_vuc-khuvuc', description: 'Category transformation keys (e.g., khu_vuc-khuvuc)' },
			{ displayName: 'Transform Files Keys', name: 'transform_files_keys', type: 'string', default: '', description: 'File transformation keys' },
		],
	},
	{
		displayName: 'Category Values',
		name: 'categoryValues',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Category Value',
		default: {},
		displayOptions: {
			show: {
				resource: ['income'],
				operation: ['editInfo'],
			},
		},
		description: 'Category field values (used with transform_categories_keys)',
		options: [
			{
				name: 'values',
				displayName: 'Category',
				values: [
					{
						displayName: 'Category Name',
						name: 'name',
						type: 'string',
						default: '',
						placeholder: 'e.g., khu_vuc, loai_hinh',
						description: 'Category field name',
					},
					{
						displayName: 'Category Value',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'e.g., Miền Bắc',
						description: 'Value of the category',
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
				operation: ['editInfo'],
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
					placeholder: 'e.g., custom_tinh_trang_nhan_hang',
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
	const categoryValues = this.getNodeParameter('categoryValues', index, {}) as IDataObject;
	const customFields = this.getNodeParameter('customFields', index, {}) as IDataObject;

	// Process category values
	const categoryValuesData: IDataObject = {};
	if (categoryValues.values && Array.isArray(categoryValues.values)) {
		for (const category of categoryValues.values as Array<{name: string; value: string}>) {
			if (category.name && category.value) {
				categoryValuesData[category.name] = category.value;
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
		creator_username: creatorUsername,
		uuid,
		...updateFields,
		...categoryValuesData,
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
