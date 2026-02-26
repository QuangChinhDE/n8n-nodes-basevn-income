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
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Username (required)',
	},
	{
		displayName: 'Additional Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['inflow'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Filter Date By',
				name: 'filter_date_by',
				type: 'options',
				options: [
					{ name: 'This Year', value: 'this_year' },
					{ name: 'This Month', value: 'this_month' },
					{ name: 'This Week', value: 'this_week' },
					{ name: 'Custom Range', value: 'custom' },
				],
				default: 'this_year',
				description: 'Date range filter',
			},
			{
				displayName: 'Receive Date From',
				name: 'receive_date_from',
				type: 'string',
				default: '',
				placeholder: '01/01/2024',
				description: 'Start date (DD/MM/YYYY)',
			},
			{
				displayName: 'Receive Date To',
				name: 'receive_date_to',
				type: 'string',
				default: '',
				placeholder: '31/01/2024',
				description: 'End date (DD/MM/YYYY)',
			},
			{
				displayName: 'Tab',
				name: 'tab',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'My Inflows', value: 'my' },
				],
				default: 'all',
				description: 'Filter by tab',
			},
			{
				displayName: 'Search Query',
				name: 'q',
				type: 'string',
				default: '',
				description: 'Search text',
			},
			{
				displayName: 'Amount Received From',
				name: 'amount_received_from',
				type: 'number',
				default: 0,
				description: 'Minimum received amount',
			},
			{
				displayName: 'Amount Received To',
				name: 'amount_received_to',
				type: 'number',
				default: 0,
				description: 'Maximum received amount',
			},
			{
				displayName: 'Metatype',
				name: 'metatype',
				type: 'string',
				default: '',
				description: 'Metatype filter (e.g., revenue)',
			},
			{
				displayName: 'Income ID',
				name: 'income_id',
				type: 'number',
				default: 0,
				description: 'Filter by income ID',
			},
			{
				displayName: 'Inflow Code',
				name: 'inflow_code',
				type: 'string',
				default: '',
				description: 'Inflow code filter',
			},
			{
				displayName: 'Cash Account ID',
				name: 'cash_account_id',
				type: 'number',
				default: 0,
				description: 'Cash account ID filter',
			},
			{
				displayName: 'User ID',
				name: 'user_id',
				type: 'number',
				default: 0,
				description: 'User ID filter',
			},
			{
				displayName: 'Since From',
				name: 'since_from',
				type: 'number',
				default: 0,
				description: 'Unix timestamp - created from',
			},
			{
				displayName: 'Since To',
				name: 'since_to',
				type: 'number',
				default: 0,
				description: 'Unix timestamp - created to',
			},
			{
				displayName: 'Updated From',
				name: 'updated_from',
				type: 'number',
				default: 0,
				description: 'Unix timestamp - updated from',
			},
			{
				displayName: 'Updated To',
				name: 'updated_to',
				type: 'number',
				default: 0,
				description: 'Unix timestamp - updated to',
			},
			{
				displayName: 'Sort Column',
				name: 'sort_column',
				type: 'options',
				options: [
					{ name: 'Receive Date', value: 'receive_date' },
					{ name: 'Amount', value: 'amount' },
					{ name: 'Created', value: 'created' },
				],
				default: 'receive_date',
				description: 'Column to sort by',
			},
			{
				displayName: 'Sort Order',
				name: 'sort_order',
				type: 'options',
				options: [
					{ name: 'Descending', value: 'desc' },
					{ name: 'Ascending', value: 'asc' },
				],
				default: 'desc',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				description: 'Page number',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
		],
	},
	{
		displayName: 'Response Selector',
		name: 'responseSelector',
		type: 'options',
		options: [
			{ name: 'Full Response', value: '' },
			{ name: 'Inflows Array', value: 'inflows' },
		],
		default: 'inflows',
		displayOptions: {
			show: {
				resource: ['inflow'],
				operation: ['getAll'],
			},
		},
		description: 'Select which field to return from response',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	const username = this.getNodeParameter('username', index) as string;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	const selector = this.getNodeParameter('responseSelector', index, 'inflows') as string;

	const body: IDataObject = cleanBody({ username, ...filters });
	const response = await incomeApiRequest.call(this, 'POST', '/inflows/get', body);
	
	if (response.code === 1) {
		const result = processResponse(response, selector);
		
		if (Array.isArray(result)) {
			result.forEach((item) => {
				returnData.push({
					json: item as IDataObject,
					pairedItem: index,
				});
			});
		} else {
			returnData.push({
				json: result,
				pairedItem: index,
			});
		}
	} else {
		throw new Error(`API Error: ${response.message || 'Unknown error'}`);
	}

	return returnData;
}
