import './TableHeader.css';
import '../Global/Global.css';

import { BsCheckBox, BsSquare, BsTrash } from "react-icons/bs";

import React from 'react';

export interface IProps {
	callbackForSelectAll: ( param: boolean ) => void;
	callbackForDeleteSelectedRecords: ( param: boolean ) => void;
}

const TableHeader: React.FunctionComponent<IProps> = ( props ) => {
	const [ isSelectAllClicked, setIsSelectAllClicked ] = React.useState<boolean>( false )
	const [ selectedRecordClick, setSelectedRecordClick ] = React.useState<boolean>( false )

	React.useEffect( () => {
		props.callbackForDeleteSelectedRecords( selectedRecordClick );
	}, [ selectedRecordClick ] )

	const selectAll = () => () => {
		setIsSelectAllClicked( !isSelectAllClicked )
		props.callbackForSelectAll( !isSelectAllClicked );
	}

	const deleteSelectedRecord = () => () => {
		setSelectedRecordClick( !selectedRecordClick );
	}

	return (
		<div className="table-header">
			<div className="column-one">
				<div className="action-panel">
					{ isSelectAllClicked ?
						<div className="checkBox">
							<BsCheckBox onClick={ selectAll() } />
						</div> :
						<div className="emptySquare">
							<BsSquare onClick={ selectAll() } />
						</div>
					}
					<div className="deleteIcon">
						<BsTrash onClick={ deleteSelectedRecord() } />
					</div>
				</div>
			</div>
			<div className="column-two">Name</div>
			<div className="column-three">Email</div>
			<div className="column-four">Role</div>
			<div className="column-five">Actions</div>
		</div>
	)
}

export default TableHeader;