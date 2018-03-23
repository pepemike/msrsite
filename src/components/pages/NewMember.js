import React from 'react';
import { Link } from 'react-router-dom';
import { insert } from '../../data/databaseManager';

export default class IndexPage extends React.Component {
    submit = (e) => {
        insert("Has_Skill", {
            "ID": "6",
            "NAME": "Driving"
        }).then(res => console.log(res));
    }

    render() {
        return (
            <div className="newMember">
                <label>New Member</label><br/>
                <label>
                    First Name
                    <input type="text" name="name"/>
                </label><br/>
                <label>
                    Surname
                    <input type="text" name="surname"/>
                </label><br/>
                <label>
                    Phone
                    <input type="text" name="phone"/>
                </label><br/>
                <label>
                    Skills
                    <textarea name="skills" rows="5" cols="10"/>
                </label><br/>
                <button type="submit" name="submit" onClick={this.submit}>
                    Add Member
                </button><br/>
                <Link to="/">Home</Link>
            </div>
        );
    }
}