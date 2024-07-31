const {google} = require('googleapis');
const { authorize } = require('./google-authth');

const createForm = async() => {
    const auth = await authorize();
    const forms = google.forms({
        version: 'v1',
        auth,
    });
    const res = await forms.forms.create({
        "resource": {
            "info": {
                "title": "Famous Black Women 3"
            }
        }
    });
    console.log(res.data);
    return res.data;
}

module.exports = {
    createForm,
};