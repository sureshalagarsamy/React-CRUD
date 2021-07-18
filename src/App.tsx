import './App.css';

import React from 'react';
import TableData from './TableData/TableData';
import TableHeader from './TableHeader/TableHeader';

const App: React.FunctionComponent<{}> = () => {
	const [ toggleSelectAll, setToggleSelectAll ] = React.useState<boolean>( false );
	const [ deleteSelectedRecord, setDeleteSelectedRecord ] = React.useState<boolean>( false );
	const [ searchKey, setSearchKey ] = React.useState<string>( '' );

	React.useEffect( () => {
		setSearchKey( searchKey )
	}, [ searchKey ] );

	const selectAll = () => () => {
		setToggleSelectAll( !toggleSelectAll );
	}

	const deleteSelectedRecords = () => ( param: boolean ) => {
		setDeleteSelectedRecord( param );
	}

	return (
		<div className="App">
			<div className="page-content">
				<div className="filter-panel">
					<input value={ searchKey } onChange={ ( e ) => setSearchKey( e.target.value ) } />
				</div>
				<div className="table-panel">
					<TableHeader
						callbackForSelectAll={ selectAll() }
						callbackForDeleteSelectedRecords={ deleteSelectedRecords() }
					/>
					<TableData
						searchKey={ searchKey }
						isSelectAllClicked={ toggleSelectAll }
						isDeleteSelectedRecordsClicked={ deleteSelectedRecord }
					/>
				</div>
			</div>
		</div>
	);
}

export default App;
