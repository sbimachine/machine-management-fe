import Highlighter from 'react-highlight-words';

export default function SearchHighlighter(props) {
	const { text, searchWords } = props;

	return (
		<Highlighter
			highlightStyle={{ backgroundColor: '#389e0d', color: '#fff', padding: 0 }}
			searchWords={[searchWords]}
			activeStyle={{ textAlign: 'center' }}
			textToHighlight={text?.toString()}
			autoEscape
		/>
	);
}
