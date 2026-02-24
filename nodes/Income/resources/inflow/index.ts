import type { INodeProperties } from 'n8n-workflow';
import * as create from './create';
import * as get from './get';
import * as getAll from './getAll';
import * as getLastUpdate from './getLastUpdate';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['inflow'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create an inflow',
				description: 'Create a new inflow',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an inflow',
				description: 'Get an inflow by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many inflows',
				description: 'Get many inflows with filters',
			},
			{
				name: 'Get Last Update',
				value: 'getLastUpdate',
				action: 'Get inflows by last update time',
				description: 'Get inflows modified within a time range',
			},
		],
		default: 'getAll',
	},
	...create.description,
	...get.description,
	...getAll.description,
	...getLastUpdate.description,
];

export { create, get, getAll, getLastUpdate };
