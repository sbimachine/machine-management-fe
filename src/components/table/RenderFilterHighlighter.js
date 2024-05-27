import * as React from 'react';
import { parseDate, parseCurrency, parseNumber } from '@/utils/parse';

import SearchHighlighter from '@/components/table/SearchHighlighter';

export function RenderFilterExist(props) {
	const { filter, fieldDetails, fieldType, dataIndex, value } = props;

	switch (fieldType) {
		case 'date':
			return (
				<SearchHighlighter
					text={parseDate(value, true)?.format('DD-MM-YYYY') || `${value || '-'}`}
					searchWords={parseDate(filter[dataIndex], true)?.format('DD-MM-YYYY') || `${filter[dataIndex] || '-'}`}
				/>
			);
		case 'currency':
			return (
				<SearchHighlighter
					text={parseCurrency(value) || `${value || '-'}`}
					searchWords={parseNumber(filter[dataIndex]) || `${filter[dataIndex] || '-'}`}
				/>
			);
		case 'numeric':
			return (
				<SearchHighlighter
					text={parseNumber(value) || `${value || '-'}`}
					searchWords={parseNumber(filter[dataIndex]) || `${filter[dataIndex] || '-'}`}
				/>
			);
		case 'flag':
			return React.cloneElement(fieldDetails.flagFields[dataIndex].component, { value });
		default:
			return <SearchHighlighter text={`${value || '-'}`} searchWords={filter[dataIndex] || '-'} />;
	}
}

export function RenderFilterNotExist(props) {
	const { fieldDetails, fieldType, dataIndex, value } = props;

	switch (fieldType) {
		case 'date':
			return parseDate(value, true)?.format('DD-MM-YYYY') || `${value || '-'}`;
		case 'currency':
			return parseCurrency(value) || `${value || '-'}`;
		case 'numeric':
			return parseNumber(value) || `${value || '-'}`;
		case 'flag':
			return React.cloneElement(fieldDetails.flagFields[dataIndex].component, { value });
		default:
			return `${value || '-'}`;
	}
}
