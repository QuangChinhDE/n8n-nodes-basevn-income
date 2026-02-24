import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { incomeApiRequest } from '../../shared/transport';
import { cleanBody, processResponse } from '../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['inflow'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Username of the creator',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['inflow'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Name of the inflow',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['inflow'],
				operation: ['create'],
			},
		},
		default: 0,
		description: 'Inflow amount',
	},
	{
		displayName: 'Receive Date',
		name: 'receive_date',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['inflow'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: '05/01/2024',
		description: 'Date of receipt in format DD/MM/YYYY',
	},
	{
		displayName: 'Cash Account ID',
		name: 'cash_account_id',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['inflow'],
				operation: ['create'],
			},
		},
		default: 1,
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['inflow'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Reference',
				name: 'reference',
				type: 'string',
				default: '',
				description: 'Reference URL or link',
			},
			{
				displayName: 'UUID',
				name: 'uuid',
				type: 'string',
				default: '',
				description: 'Unique identifier',
			},
			{
				displayName: 'Followers',
				name: 'followers',
				type: 'string',
				default: '',
				description: 'Comma-separated list of follower usernames',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				description: 'Description or notes',
			},
			{
				displayName: 'Categories',
				name: 'categories',
				type: 'string',
				default: '',
				description: 'Category mapping (e.g., khu_vuc-khuvuc)',
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
				resource: ['inflow'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'field',
				displayName: 'Field',
				values: [
					{
						displayName: 'Field Name',
						name: 'name',
						type: 'string',
						default: '',
						placeholder: 'khu_vuc',
						description: 'Custom field name',
					},
					{
						displayName: 'Field Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Custom field value',
					},
				],
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	const username = this.getNodeParameter('username', index) as string;
	const name = this.getNodeParameter('name', index) as string;
	const amount = this.getNodeParameter('amount', index) as number;
	const receiveDate = this.getNodeParameter('receive_date', index) as string;
	const cashAccountId = this.getNodeParameter('cash_account_id', index) as number;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	const customFields = this.getNodeParameter('customFields', index, {}) as IDataObject;

	const body: IDataObject = cleanBody({
		username,
		name,
		amount,
		receive_date: receiveDate,
		cash_account_id: cashAccountId,
		...additionalFields,
	});

	// Add custom fields
	if (customFields.field && Array.isArray(customFields.field)) {
		customFields.field.forEach((field: IDataObject) => {
			if (field.name && field.value) {
				body[field.name as string] = field.value;
			}
		});
	}

	const response = await incomeApiRequest.call(this, 'POST', '/inflow/create', body);
	
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
