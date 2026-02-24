import type { INodeProperties } from 'n8n-workflow';

import * as create from './create';
import * as get from './get';
import * as getAll from './getAll';
import * as getLastUpdate from './getLastUpdate';
import * as editInfo from './editInfo';
import * as editItems from './editItems';
import * as editDeductions from './editDeductions';
import * as cancel from './cancel';
import * as markInvoiced from './markInvoiced';

export { create, get, getAll, getLastUpdate, editInfo, editItems, editDeductions, cancel, markInvoiced };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['income'],
			},
		},
		options: [
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel an income',
				action: 'Cancel an income',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new income',
				action: 'Create an income',
			},
			{
				name: 'Edit Deductions',
				value: 'editDeductions',
				description: 'Edit income deduction lines',
				action: 'Edit income deductions',
			},
			{
				name: 'Edit Info',
				value: 'editInfo',
				description: 'Edit income information',
				action: 'Edit income info',
			},
			{
				name: 'Edit Items',
				value: 'editItems',
				description: 'Edit income item lines',
				action: 'Edit income items',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an income',
				action: 'Get an income',
			},
			{
				name: 'Get Last Update',
				value: 'getLastUpdate',
				description: 'Get incomes by last update timestamp',
				action: 'Get incomes by last update',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many incomes',
				action: 'Get many incomes',
			},
			{
				name: 'Mark Invoiced',
				value: 'markInvoiced',
				description: 'Mark income as invoiced',
				action: 'Mark income as invoiced',
			},
		],
		default: 'create',
	},
	...create.description,
	...get.description,
	...getAll.description,
	...getLastUpdate.description,
	...editInfo.description,
	...editItems.description,
	...editDeductions.description,
	...cancel.description,
	...markInvoiced.description,
];
