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
displayName: 'Filters',
name: 'filters',
type: 'collection',
placeholder: 'Add Filter',
default: {},
displayOptions: {
show: {
resource: ['income'],
operation: ['getAll'],
},
},
options: [
{ displayName: 'View Type', name: 'view_type', type: 'string', default: 'my_incomes' },
{ displayName: 'User ID', name: 'user_id', type: 'number', default: 0 },
{ displayName: 'View By ID', name: 'view_by_id', type: 'number', default: 0 },
{ displayName: 'Filter Date By', name: 'filter_date_by', type: 'string', default: 'this_year' },
{ displayName: 'Date From', name: 'date_from', type: 'string', default: '', placeholder: '01/01/2024' },
{ displayName: 'Date To', name: 'date_to', type: 'string', default: '', placeholder: '31/01/2024' },
{ displayName: 'Tab', name: 'tab', type: 'string', default: 'all' },
{ displayName: 'Search Query', name: 'q', type: 'string', default: '' },
{ displayName: 'Status', name: 'status', type: 'string', default: '' },
{ displayName: 'Income Type ID', name: 'income_type_id', type: 'number', default: 0 },
{ displayName: 'Customer ID', name: 'customer_id', type: 'number', default: 0 },
{ displayName: 'Revenue Unit ID', name: 'revenue_unit_id', type: 'number', default: 0 },
{ displayName: 'Salesperson', name: 'salesperson', type: 'string', default: '' },
{ displayName: 'Remaining Amount From', name: 'remaining_amount_from', type: 'number', default: 0 },
{ displayName: 'Remaining Amount To', name: 'remaining_amount_to', type: 'number', default: 0 },
{ displayName: 'Received From', name: 'received_from', type: 'number', default: 0 },
{ displayName: 'Received To', name: 'received_to', type: 'number', default: 0 },
{ displayName: 'Remaining From', name: 'remaining_from', type: 'number', default: 0 },
{ displayName: 'Remaining To', name: 'remaining_to', type: 'number', default: 0 },
{ displayName: 'Due Date From', name: 'due_date_from', type: 'string', default: '' },
{ displayName: 'Due Date To', name: 'due_date_to', type: 'string', default: '' },
{ displayName: 'Updated From', name: 'updated_from', type: 'number', default: 0 },
{ displayName: 'Updated To', name: 'updated_to', type: 'number', default: 0 },
{ displayName: 'Sort Column', name: 'sort_column', type: 'string', default: 'receive_date' },
{ displayName: 'Sort Order', name: 'sort_order', type: 'string', default: 'desc' },
{ displayName: 'Page', name: 'page', type: 'number', default: 1 },
{ displayName: 'Limit', name: 'limit', type: 'number',
																																							typeOptions: {
																																								minValue: 1,
																																							},
																																							description: 'Max number of results to return', default: 50 },
],
},
{
displayName: 'Response Selector',
name: 'responseSelector',
type: 'options',
options: [
{ name: 'Full Response', value: '' },
{ name: 'Incomes Array', value: 'incomes' },
],
default: 'incomes',
displayOptions: {
show: {
resource: ['income'],
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

const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
const selector = this.getNodeParameter('responseSelector', index, 'incomes') as string;

const body: IDataObject = cleanBody(filters);
const response = await incomeApiRequest.call(this, 'POST', '/incomes/get', body);

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
