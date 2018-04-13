import React from "react";
import Tooltip from '../Tooltip';
import { CONSTANTS, HEADERS } from "../../index";
import { dictFromList, or } from "../../Utils";

const formats = {
    'FIRSTNAME': ['First Name'],
    'SURNAME': ['Surname'],
    'MEMBERSHIP': ['MSR Member #'],
    'MOBILE': ['Mobile Phone',prettyPhone],
    'ADDRESS': ['Address'],
    'MARITAL': ['Marital Status'],
    'LENGTH': ['Worked Here For',prettyYears],
    'EMPLOYER': ['Employer Name'],
    'NAME': ['Skill Name'],
    'LANGUAGE': ['Language'],
    'DESC': ['Description'],
    'NATID': ['National ID'],
    'SITE': ['Recruitment Site',prettySite],
    'ABBR': ['Site Code'],
    'TYPE': ['Certificate Type'],
    'YEAR': ['Completion Year'],
    'INSTITUTION': ['Completed at']
};

export function PrettyKey(key) {
    let f = formats[key];
    return f && f[0] ? f[0] : key;
}

export function PrettyValue(key, val) {
    let f = formats[key];
    return f && f[1] ? f[1](val) : val;
}

export function PrettyPair(key, val) {
    return <div><b>{PrettyKey(key)}:</b> {PrettyValue(key, val)}</div>;
}

export function PrettyWork(work) {
    return work.reduce((acc, cur) => {
        if(acc!==undefined && acc.hasOwnProperty(cur.WORKID)) {
            acc[cur.WORKID].SKILLS.push(cur.NAME);
            return acc;
        }
        else {
            let sks = cur.NAME ? [cur.NAME] : [];
            return {
                [cur.WORKID]: {
                    EMPLOYER: cur.EMPLOYER,
                    WORKID: cur.WORKID,
                    LENGTH: cur.LENGTH,
                    SKILLS: sks
                },
                ...acc
            }
        }
    }, {});
}

export function textValidation(table, field) {
    let info = HEADERS[table][field];
    let result = {};
    switch(info.DATA_TYPE) {
        case 'int':
        case 'float': result.type = 'number'; break;
        case 'bit':
        case 'varchar':
        default: result.type = 'text'; break;
    }
    result.maxLength = info.CHARACTER_MAXIMUM_LENGTH || 100;
    return result;
}

export function invalidFields(fields) {
    return fields.filter(field => field.props.value.length > field.props.maxLength).length > 0;
}

export function invalidData(data, table) {
    return data && or(Object.values(data).map(d =>
        d && or(Object.keys(d).map(k =>
            (typeof(d[k]) === 'string' && d[k].length > HEADERS[table][k].CHARACTER_MAXIMUM_LENGTH)))));
}

function prettyPhone(old) {
    let phone = old.padStart(10, '0');
    let area = phone.slice(0,3);
    let next = phone.slice(3,6);
    let last = phone.slice(6);
    return `(${area}) ${next}-${last}`;
}

function prettySite (old) {
    return (
      <Tooltip tooltipLabel={`Site Code '${old}'`} tooltipPosition="top">
          {dictFromList(CONSTANTS['Site'],'ABBR')[old].DESC}
      </Tooltip>
    );
}

function prettyYears(years) {
    return (years > 1) ?
        `${years} years` :
        (years === 1) ?
            `${years} year` :
            `${years*12} months`;
}