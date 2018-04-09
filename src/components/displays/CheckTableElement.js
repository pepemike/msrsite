import React from 'react';
import { DataTable, TableHeader, TableBody, TableRow, TableColumn, FontIcon, Checkbox, Autocomplete, Button } from 'react-md';

const HEADERS = edit => {
    let l = ['Language', 'Read', 'Write', 'Speak'];
    if (edit) l.push('');
    return l;
}

export default class CheckTableElement extends React.Component {
    render () {
        return (
            <div>
                <DataTable baseId="lang" fullWidth={false} selectableRows={false}>
                    <TableHeader>
                        <TableRow>
                            {HEADERS(this.props.edit).map(head => <TableColumn className="small" key={head}>{head}</TableColumn>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.keys(this.props.data).map(key => (
                            <CheckTableRow key={key} data={this.props.data[key]}
                                           edit={this.props.edit} onChange={this.props.onChange}
                                           remove={this.props.remove}/>))}
                    </TableBody>
                </DataTable>
                {this.props.edit ? <Autocomplete id="langs-autocomplete" label={`Add new language`}
                              data={this.props.acData.filter(l => !Object.keys(this.props.data).includes(l))}
                              onAutocomplete={this.props.add} clearOnAutocomplete size={30} fullWidth={false}/> : false}
        </div>
        );
    }
}

function CheckTableRow(props) {
    let l = props.data.LANGUAGE;

    let children = Object.keys(props.data).slice(1).map(k => (
        <TableColumn className="small" key={k}>
            {k === 'LANGUAGE' ?
                l :
                props.edit ?
                    <Checkbox id={l+''+k} name={l+''+k} label={''} checked={props.data[k]}
                              onChange={v => props.onChange(l, k, v)}/> :
                    props.data[k] ?
                        <FontIcon>check</FontIcon> :
                        <FontIcon>close</FontIcon>}
        </TableColumn>
    ));

    if(props.edit) children.push(
        <TableColumn className="small">
            <Button icon primary onClick={() => props.remove(l)}>
                close
            </Button>
        </TableColumn>
    );

    return <TableRow children={children}/>;
}