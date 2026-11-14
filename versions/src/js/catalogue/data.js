const rawicons = {};
const downloadbuttons = {};
let loading = null;

/*//////////////////////////////////////////////////////////////////////*/

async function readjson(filename) {
    const url = new URL(`/assets/static/data/versions/${filename}`, location.origin);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url.pathname}: HTTP ${response.status}`);
    return response.json();
}

function loadcataloguedata() {
    if (!loading) {
        loading = Promise.all([readjson("icons.json"), readjson("downloads.json")]).then(([icons, buttons]) => {
            Object.assign(rawicons, icons);
            Object.assign(downloadbuttons, buttons);
        }).catch(error => {
            loading = null;
            throw error;
        });
    }
    return loading;
}

/*//////////////////////////////////////////////////////////////////////*/

export {rawicons, downloadbuttons, loadcataloguedata};
