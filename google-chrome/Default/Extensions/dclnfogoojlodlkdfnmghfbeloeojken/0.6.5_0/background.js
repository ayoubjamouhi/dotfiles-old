const URL = 'https://appstorespy.com/';
//const URL = 'http://localhost:8000/';
const buildQueryString = params => Object.keys(params)
    .map(key => [key, params[key]].map(encodeURIComponent).join('='))
    .join('&').replace(/%20/g, '+');
const log = (t) => {
//    console.log(t)
};
let plan=null;

const authorize = (callback) => new Promise((resolve, reject) => {
    const params = {
        redirect_uri:chrome.identity.getRedirectURL('oauth2'),
        clear:1,
        auth:JSON.stringify({
            uuid:getUuid()
        })
    };
    const url = URL+'authorize?' + buildQueryString(params);

    chrome.identity.launchWebAuthFlow({
        url,
        interactive: true,
    }, redirectURL => {
        if (redirectURL) {
            // log(redirectURL)
            const response = new URLSearchParams(redirectURL.split('#')[1]);

            const accessToken = response.get('access_token');

            chrome.storage.sync.set({
                accessToken
            }, () => {
                resolve(accessToken)
            });
            callback('ok')
            appdata = {}

            // TODO: prevent infinite loops, catch rate limiting
        } else {
            console.error(chrome.runtime.lastError.message);
            callback('notauth')
        }
    })
});

const getToken = () => new Promise((resolve, reject) => {
    chrome.storage.sync.get('accessToken', result => {
        resolve(result.accessToken) // authorize()
    })
});

const getUuid = () => new Promise((resolve, reject) => {
    chrome.storage.sync.get('uuid', result => {
        if (result.uuid) {
            resolve(result.uuid)
        }
        else {
            const generateUuid=() => {
              return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
              });
            }
            uuid = generateUuid();
            chrome.storage.sync.set({uuid: uuid}, function() {
            });
            resolve(uuid)
        }
    })
});
const getAuthorization = async () => {
    const accessToken = await getToken();
    if (accessToken)
        return 'Bearer ' + accessToken
    else
        return 'UUID ' + await getUuid()
}
const api = async (url, options = {}) => {
    options.headers = {
        ...options.headers,
        Authorization: await getAuthorization(),
    };
    const response = await fetch(URL+'v1' + url, options)
        .catch(error => console.error('Error:', error.message));

    if (response === undefined) {
        return {status: 'ERR', message: 'Service is not available'}
    }

    const result = await response.json();
    if (response.status === 200 && result.status === 'OK') {
        if (plan === null || (result.hasOwnProperty('user' ) && result['user'].hasOwnProperty('plan' ) && result['user']['plan'] !== plan)) {
            plan = result['user']['plan'];
            appdata = {};
        }
        return result
    }

    switch (result.status) {
        case 429:
            return {status:'ERR',message:result.message};
        // case 400:
        //     return new Promise((resolve, reject) => {
        //         window.setTimeout(() => {
        //             resolve(api(url, options))
        //         }, 10000) // retry in 10000 seconds (TODO: use rate-limiting headers)
        //     })

        case 401: {
            log("Removing access token");
            return new Promise((resolve, reject) => {
                chrome.storage.sync.remove('accessToken', () => {
                    resolve(api(url, options)) // retry
                })
            })
        }
    }
};
async function register() {
    const response = await fetch(URL+'v1' + '/register', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        method: 'post',
        body: JSON.stringify({
            uuid:await getUuid()
        })
    }).catch(
        error => console.error('Error:', error.message)
    );
}
async function getMe(callback) {
    const response = await api('/me?v=' + chrome.runtime.getManifest().version, {
        headers: {
            'Accept': 'application/json',
        }
    });
    callback(response);
}
async function logout(callback) {
    chrome.storage.sync.remove('accessToken', () => {
        callback()
    })
}

let appdata = {};
async function getData(docids) {
//    log('getData', docids)
//    log('appdata', appdata)
    let appload=[]
    for(let i in docids) {
        if (!appdata.hasOwnProperty(docids[i])) {
            appload.push(docids[i]);
        }
    }
    let appresults = {};
    if (appload.length) {
        // log('Requested', appload.length)
        const response = await api('/bar?v='+chrome.runtime.getManifest().version, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method: 'post',
            body: JSON.stringify({id:appload})}
            )
        // log('Loaded', data.length)
        if (response.status !== 'OK') {
            return response
        }
        if (Object.keys(appdata).length > 1000)
            appdata = {};
        for (let i in response.data)
        {
            response.data[response.data[i]['docid']] = response.data[i];
            appdata[response.data[i]['docid']] = response.data[i];
        }
        // log('appdata', Object.keys(appdata).length)
        if (response.message)
            appresults.message=response.message;
    }
    for(let i in docids) {
        if (appdata.hasOwnProperty(docids[i])) {
            appresults[docids[i]] = appdata[docids[i]];
        }
    }
    // log('Returns', Object.keys(appresults).length)
    return appresults;
}

let functionCallbacks = [];
let getDataLock = false;

const getDataSync = async ({docids}, callback) => {
    log('getDataSync', docids)
    if (getDataLock) {
        functionCallbacks.push(docids);
    }
    else {
        getDataLock = true;
        functionCallbacks.push(docids);
        while (functionCallbacks.length) {
            var thisCallback = functionCallbacks.pop();
            callback(await getData(thisCallback))
        }
        getDataLock = false;
    }
};
const isSigned = async (callback) => {
    const accessToken = await getToken();
    callback(!!accessToken)
};
const saveToken = async (message, callback) => {
    chrome.storage.sync.set({
        accessToken: message.accessToken
    }, () => {
    });
    callback()
};
chrome.runtime.onMessage.addListener((message, sender, callback) => {
    switch (message.command || message) {
        case 'auth':
            authorize(callback);
            break;
        case 'me':
            getMe(callback);
            break;
        case 'logout':
            logout(callback);
            break;
        case 'isSigned':
            isSigned(callback);
            break;
        case 'openPopup':
            chrome.tabs.create({url: "index.html"}, function (tab) {});
            break;
        case 'saveToken':
            saveToken(message, callback);
            break;
        case 'pageview':
            ga('send', 'pageview', '/');
            break;
        default:
            getDataSync(message, callback)
    }
    return true // needed for asynchronous responses
});
chrome.runtime.onInstalled.addListener(async function(details){
    switch (details.reason) {
        case "install":
            register();
            chrome.tabs.create({url: URL+"signup?utm_source=chrome&install=true&utm_medium=store&utm_campaign=install"}, function (tab) {});
            break
        case "update":
            if (!await getToken()) {
                chrome.tabs.create({url: URL+"signup?utm_source=chrome&update=true&utm_campaign=update"}, function (tab) {});
            }
            break
    }
});
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': chrome.extension.getURL('index.html')}, function(tab) {
    });
});
// Standard Google Universal Analytics code
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'); // Note: https protocol here
ga('create', 'UA-133568163-2', 'auto');
ga('set', 'checkProtocolTask', function(){});
ga('require', 'displayfeatures');
