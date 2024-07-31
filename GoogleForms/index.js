const path = require('path');
const {google} = require('googleapis');
const {authenticate} = require('@google-cloud/local-auth');
const {readFileSync, writeFileSync} = require('fs');

const SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/forms.body'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');


const loadSavedCredentials = async() => {
    try {
        const content = await readFileSync(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (error) {
        return null;
    }
}

const saveCredentials = async(client) => {
    const content = await readFileSync(CREDENTIALS_PATH);
    const contentString = content.toString();
    const keys = JSON.parse(contentString);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await writeFileSync(TOKEN_PATH, payload);
}

const authorize = async() => {
    let client = await loadSavedCredentials();
    if (client) {
        return client;
    }
    client = await authenticate({
        keyfilePath: CREDENTIALS_PATH,
        scopes: SCOPES,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

const createForm = async() => {
    const auth = await authorize();
    const forms = google.forms({
        version: 'v1',
        auth,
    });
    const res = await forms.forms.create({
        "resource": {
            "info": {
                "title": "Famous Black Women"
            }
        }
    });
    console.log(res.data);
    return res.data;
}


createForm().catch(console.error);

/*
async function runSample(query) {
  const authClient = await authenticate({
    keyfilePath: path.join(__dirname, 'credentials.json'),
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  const forms = google.forms({
    version: 'v1',
    auth: authClient,
  });
  const newForm = {
    info: {
      title: 'Creating a new form in Node',
    },
  };
  const res = await forms.forms.create({
    requestBody: newForm,
  });
  console.log(res.data);
  return res.data;
}

runSample().catch(console.error)
*/