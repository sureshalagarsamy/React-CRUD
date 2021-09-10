import './TableData.css';
import '../Global/Global.css';

import { BsCheckBox, BsFileEarmarkCheck, BsPencil, BsSquare, BsTrash } from "react-icons/bs";

import { ITableData } from '../Global/ITableData';
import Pagination from '../Global/Pagination';
import React from 'react';
import ReactPaginate from "react-paginate";
import axios from 'axios';
import className from 'classnames';

export interface IProps {
	isSelectAllClicked: boolean;
	isDeleteSelectedRecordsClicked: boolean;
	searchKey: string;
}

const tableDataEditable = className( 'table-data', 'table-data-editable' );

const TableData: React.FunctionComponent<IProps> = ( props ) => {
	const [ response, setResponse ] = React.useState<ITableData[]>( [] );
	const [ cloneTableData, setCloneTableData ] = React.useState<ITableData[]>( [] );
	const [ searchKey, setSearchKey ] = React.useState<string>( props.searchKey );

	React.useEffect( () => {
		fetchData();
	}, [] );

	React.useEffect( () => {
		setSearchKey( props.searchKey );
	}, [ props.searchKey ] );

	React.useEffect( () => {
		filterBySearchKey();
	}, [ searchKey ] );

	React.useEffect( () => {
		const modifiedClonedData = [ ...cloneTableData ];
		modifiedClonedData.map( ( key: ITableData ) => {
			key.toggleDeleteMember = props.isSelectAllClicked;
		} )
		setCloneTableData( modifiedClonedData );
	}, [ props.isSelectAllClicked ] );

	React.useEffect( () => {
		const modifiedData = cloneTableData.filter( ( item ) => item.toggleDeleteMember === false );
		setCloneTableData( modifiedData );
	}, [ props.isDeleteSelectedRecordsClicked ] );

	React.useEffect( () => {
		response.map( ( key: ITableData ) => {
			key.isDeleted = false;
			key.toggleEdit = false;
			key.toggleDeleteMember = false;
		} )
		setCloneTableData( response );
	}, [ response ] )

	async function fetchData() {
		try {
			// tableData.json available incase the below URL doesn't work
			const response = await axios.get( 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json' );
			setResponse( response.data );
		} catch ( e ) {
			console.log( e );
		}
	}

	const filterBySearchKey = () => {
		const modifiedClonedData = [ ...response ];
		const afterFiltered = modifiedClonedData.filter( function ( element ) {
			return (
				( element.name ).toUpperCase().indexOf( searchKey.toUpperCase() ) > -1 ||
				( element.email ).toUpperCase().indexOf( searchKey.toUpperCase() ) > -1 ||
				( element.role ).toUpperCase().indexOf( searchKey.toUpperCase() ) > -1 )
		} );
		setCloneTableData( afterFiltered )
	}

	const editMember = ( param: ITableData ) => () => {
		const modifiedClonedData = [ ...cloneTableData ];
		modifiedClonedData.map( ( key: ITableData ) => {
			if ( key.id === param.id ) {
				key.toggleEdit = true;
			}
		} )
		setCloneTableData( modifiedClonedData );
	}

	const deleteMember = ( param: ITableData ) => () => {
		const afterRemoved = cloneTableData.filter( function ( element ) { return element.id !== param.id } );
		setCloneTableData( afterRemoved );
	}

	const selectMemberToDelete = ( param: ITableData ) => () => {
		const modifiedClonedData = [ ...cloneTableData ];
		modifiedClonedData.map( ( key: ITableData ) => {
			if ( key.id === param.id ) {
				key.toggleDeleteMember = !param.toggleDeleteMember;
			}
		} )
		setCloneTableData( modifiedClonedData );
	}

	const editMemberInfo = ( param: ITableData ) => () => {
		const modifiedClonedData = [ ...cloneTableData ];
		modifiedClonedData.map( ( key: ITableData ) => {
			if ( key.id === param.id ) {
				key.toggleEdit = false
			}
		} )
		setCloneTableData( modifiedClonedData );
	}

	const editMemberDetail = ( currentRow: ITableData, editedValue: string, flag: string ) => {
		console.log( currentRow, editedValue );
		const modifiedClonedData = [ ...cloneTableData ];
		modifiedClonedData.map( ( key: ITableData ) => {
			if ( key.id === currentRow.id ) {
				if ( flag === 'NAME' ) {
					key.name = editedValue;
				} else if ( flag === 'EMAIL' ) {
					key.email = editedValue;
				} else if ( flag === 'ROLE' ) {
					key.role = editedValue;
				}
			}
		} );
		setCloneTableData( modifiedClonedData );
	}

	return (
		<div className="table-data-panel">
			{ cloneTableData.map( ( key: ITableData, index: number ) => {
				return (

					<div className={ key.toggleEdit ? tableDataEditable : "table-data" } key={ index }>
						<div className="column-one">
							{ key.toggleDeleteMember ?
								<div className="checkBox">
									<BsCheckBox onClick={ selectMemberToDelete( key ) } />
								</div>
								:
								<div className="emptySquare">
									<BsSquare onClick={ selectMemberToDelete( key ) } />
								</div>
							}
						</div>
						<div className="column-two">
							{
								key.toggleEdit ?
									<input value={ key.name }
										onChange={ ( e ) => editMemberDetail( key, e.target.value, 'NAME' ) } />
									:
									key.name
							}
						</div>
						<div className="column-three">
							{
								key.toggleEdit ? <input value={ key.email }
									onChange={ ( e ) => editMemberDetail( key, e.target.value, 'EMAIL' ) } />
									:
									key.email
							}
						</div>
						<div className="column-four">
							{
								key.toggleEdit ? <input value={ key.role }
									onChange={ ( e ) => editMemberDetail( key, e.target.value, 'ROLE' ) } />
									:
									key.role
							}
						</div>
						<div className="column-five">
							<div className="editIcon">
								{ key.toggleEdit ?
									<BsFileEarmarkCheck onClick={ editMemberInfo( key ) } />
									:
									<BsPencil onClick={ editMember( key ) } /> }
							</div>
							<div className="deleteIcon">
								{ !key.isDeleted ? <BsTrash onClick={ deleteMember( key ) } /> : null }
							</div>
						</div>
					</div>
				)
			} ) }
		</div>
	)
}

export default TableData;
