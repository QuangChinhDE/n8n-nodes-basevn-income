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
		displayName: 'Inflow ID',
		name: 'id',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['inflow'],
				operation: ['get'],
			},
		},
		default: 1,
		description: 'The ID of the inflow to retrieve',
	},
	{
		displayName: 'Response Selector',
		name: 'responseSelector',
		type: 'options',
		options: [
			{ name: 'Full Response', value: '' },
			{ name: 'Inflow Data', value: 'inflow' },
		],
		default: 'inflow',
		displayOptions: {
			show: {
				resource: ['inflow'],
				operation: ['get'],
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
	
	const id = this.getNodeParameter('id', index) as number;
	const selector = this.getNodeParameter('responseSelector', index, 'inflow') as string;

	const body: IDataObject = cleanBody({ id });
	const response = await incomeApiRequest.call(this, 'POST', '/inflow/get', body);
	
	if (response.code === 1) {
		const result = processResponse(response, selector);
		returnData.push({
			json: result,
			pairedItem: index,
		});
	} else {
		throw new Error(`API Error: ${response.message || 'Unknown error'}`);
	}

	return returnData;
}
