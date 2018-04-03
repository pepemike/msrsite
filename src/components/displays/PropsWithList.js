import React from 'react';
import { Cell, Card, Chip, CardTitle, CardText, CardActions } from 'react-md';
import { PrettyPair } from "./DisplayUtils";

export default function PropsWithList(props) {
    return (
        <Cell size={4}>
            <Card className="member-card">
                <CardTitle className="card-action-title" title={props.name} subtitle={props.subtitle}>
                    <CardActions>
                        {props.actions}
                    </CardActions>
                </CardTitle>
                <CardText>
                    {Object.keys(props.data).map((f, i, a) => {
                        return (f !== "ID") && (
                            <label key={i}>{PrettyPair(f, props.data[f])}</label>
                        );
                    })}
                    <b>{props.listHeader}</b><br/>
                    {props.list.map(x => <Chip className="list_chip" key={x} label={x}/>)}
                </CardText>
            </Card>
        </Cell>
    );
}