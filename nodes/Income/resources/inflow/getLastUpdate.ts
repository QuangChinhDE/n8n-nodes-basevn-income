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
		displayName: 'Start Time',
		name: 'start',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['inflow'],
				operation: ['getLastUpdate'],
			},
		},
		default: 0,
		description: 'Unix timestamp - start of time range',
	},
	{
		displayName: 'End Time',
		name: 'end',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['inflow'],
				operation: ['getLastUpdate'],
			},
		},
		default: 0,
		description: 'Unix timestamp - end of time range',
	},
	{
		displayName: 'Additional Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['inflow'],
				operation: ['getLastUpdate'],
			},
		},
		options: [
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
				operation: ['getLastUpdate'],
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
	
	const start = this.getNodeParameter('start', index) as number;
	const end = this.getNodeParameter('end', index) as number;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;
	const selector = this.getNodeParameter('responseSelector', index, 'inflows') as string;

	const body: IDataObject = cleanBody({
		start,
		end,
		...options,
	});

	const response = await incomeApiRequest.call(this, 'POST', '/inflows/last.update', body);
	
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
