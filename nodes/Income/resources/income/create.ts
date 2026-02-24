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
		displayName: 'Income Type Token',
		name: 'incomeTypeToken',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		displayOptions: {
			show: {
				resource: ['income'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Income type token from Base Income > Settings > Income Types > Webhooks',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['income'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Income name',
	},
	{
		displayName: 'Creator Username',
		name: 'creator_username',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['income'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Username of the creator',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['income'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Since',
				name: 'since',
				type: 'number',
				default: 0,
				description: 'Unix timestamp',
			},
			{
				displayName: 'Record Date',
				name: 'record_date',
				type: 'string',
				default: '',
				placeholder: '01/01/2024',
				description: 'Record date (DD/MM/YYYY)',
			},
			{
				displayName: 'Customer Name',
				name: 'customer_name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Customer Tax Code',
				name: 'customer_tax_code',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Customer Address',
				name: 'customer_address',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Buyer Full Name',
				name: 'buyer_full_name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Buyer Email',
				name: 'buyer_email',
				type: 'string',
				default: '',
				description: 'Buyer email address',
			},
			{
				displayName: 'Buyer Phone Number',
				name: 'buyer_phone_number',
				type: 'string',
				default: '',
			},
			{
				displayName: 'IR Full Name',
				name: 'ir_full_name',
				type: 'string',
				default: '',
				description: 'Invoice recipient full name',
			},
			{
				displayName: 'IR Email',
				name: 'ir_email',
				type: 'string',
				default: '',
				description: 'Invoice recipient email',
			},
			{
				displayName: 'IR Phone Number',
				name: 'ir_phone_number',
				type: 'string',
				default: '',
				description: 'Invoice recipient phone',
			},
			{
				displayName: 'Revenue Unit',
				name: 'revenue_unit',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Revenue Center',
				name: 'revenue_center',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Salesperson',
				name: 'salesperson',
				type: 'string',
				default: '',
				description: 'Salesperson username',
			},
			{
				displayName: 'Custom Item Lines',
				name: 'custom_item_lines',
				type: 'string',
				default: '',
				description: 'Custom item lines mapping (e.g., san_pham:name.0-code.1-amount_excl.2-tax_policy.3)',
			},
			{
				displayName: 'Single Code',
				name: 'single_code',
				type: 'string',
				default: '',
				description: 'Single item code',
			},
			{
				displayName: 'Single Amount',
				name: 'single_amount',
				type: 'number',
				default: 0,
				description: 'Single item amount',
			},
			{
				displayName: 'Tax Policy',
				name: 'tax_policy',
				type: 'string',
				default: '',
				description: 'Tax policy (e.g., VAT 10%)',
			},
			{
				displayName: 'Custom Deduction Lines',
				name: 'custom_deduction_lines',
				type: 'string',
				default: '',
				description: 'Custom deduction lines mapping',
			},
			{
				displayName: 'Fee Record Date',
				name: 'fee_record_date',
				type: 'string',
				default: '',
				description: 'Fee record date (DD/MM/YYYY)',
			},
			{
				displayName: 'Custom Due Date Lines',
				name: 'custom_due_date_lines',
				type: 'string',
				default: '',
				description: 'Custom due date lines mapping',
			},
			{
				displayName: 'Due Date',
				name: 'due_date',
				type: 'string',
				default: '',
				description: 'Due date (DD/MM/YYYY)',
			},
			{
				displayName: 'Link',
				name: 'link',
				type: 'string',
				default: '',
				description: 'Reference link',
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
				description: 'Comma-separated follower usernames',
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
				displayName: 'Transform Categories Keys',
				name: 'transform_categories_keys',
				type: 'string',
				default: '',
				description: 'Category transformation keys',
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
	{
		displayName: 'Encoded Table Fields',
		name: 'encodedTables',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Encoded Table',
		default: {},
		displayOptions: {
			show: {
				resource: ['income'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'table',
				displayName: 'Table',
				values: [
					{
						displayName: 'Table Name',
						name: 'name',
						type: 'string',
						default: '',
						placeholder: 'san_pham',
						description: 'Encoded table name (e.g., san_pham, phi_giam_tru, cac_dot_du_thu, inflows)',
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
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	const incomeTypeToken = this.getNodeParameter('incomeTypeToken', index) as string;
	const name = this.getNodeParameter('name', index) as string;
	const creatorUsername = this.getNodeParameter('creator_username', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	const customFields = this.getNodeParameter('customFields', index, {}) as IDataObject;
	const encodedTables = this.getNodeParameter('encodedTables', index, {}) as IDataObject;

	const body: IDataObject = cleanBody({
		name,
		creator_username: creatorUsername,
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

	// Add encoded table fields
	if (encodedTables.table && Array.isArray(encodedTables.table)) {
		encodedTables.table.forEach((table: IDataObject) => {
			if (table.name && table.value) {
				body[table.name as string] = table.value;
			}
		});
	}

	const endpoint = `/webhook/income/create.waiting.receive/${incomeTypeToken}`;
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
