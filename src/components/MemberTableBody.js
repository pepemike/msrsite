import React from "react";
import { DataTable, TablePagination, TableHeader, TableRow, TableBody, TableColumn, CircularProgress } from 'react-md';
import MemberTableRow from "./MemberTableRow";
import { PrettyKey } from './displays/DisplayUtils';
import { HEADERS } from "../index";

export default function MemberTableBody(props) {
    return (
        <div>
            {!props.loaded ?
                <div><CircularProgress id="memberTable"/><br/></div> :
                <div>
                    <DataTable baseId="member" selectableRows={false}>
                        <TableHeader>
                            <TableRow>
                                {Object.keys(HEADERS['Member']).slice(1).map(head => <TableColumn key={head}>{PrettyKey(head)}</TableColumn>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {props.display.map(mem => <MemberTableRow key={mem.ID} data={mem}/>)}
                        </TableBody>
                        <TablePagination rows={props.rows} rowsPerPageLabel="Rows per page"
                                         onPagination={props.handlePagination} page={props.page}/>
                    </DataTable>
                    {props.display.length === 0 ? [<br/>,<h4 style={{'marginLeft':'25px'}}>No results</h4>] : false}
                </div>
            }
        </div>
    );
}