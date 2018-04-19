exports.sysToken = '';
exports.userLevelServerSide = '';
exports.recentUsers = [];
exports.recentAdmins = [];

exports.getLevel = function(user_id){
    let request = require("request-promise");
    let options = {
        method: 'GET',
        url: 'https://rwwittenberg.auth0.com/api/v2/users/' + user_id,
        qs: {fields: 'app_metadata', include_fields: 'true'},
        headers:
            {
                'content-type': 'application/json',
                authorization: `Bearer ${exports.sysToken}`
            }
    };
    return (request(options)
        .then(response => {
            try {
                exports.userLevelServerSide = JSON.parse(response)['app_metadata']['level'];

            }catch(e){
                exports.userLevelServerSide = "newUser";
            }
        }));
};

exports.getSysToken = function(){
    let request = require("request-promise");

    let options = { method: 'POST',
        url: 'https://rwwittenberg.auth0.com/oauth/token',
        headers: { 'content-type': 'application/json' },
        body:
            { grant_type: 'client_credentials',
                client_id: 'fROUBRhDoOuMPdLBX2rtHxrZFPFVo171',
                client_secret: '-yWrqF9i6V4t9rlV-_l8bkl4fExqvml6L1b_y5_gLvD2aIdgIe1_q-FkWDzovL5O',
                //audience: 'https://msrapitest/'},
                audience: 'https://rwwittenberg.auth0.com/api/v2/'},
        json: true };

    console.log("requesting...");
    return request(options)
        .then(response => {
            exports.sysToken = response['access_token'];
        });
};