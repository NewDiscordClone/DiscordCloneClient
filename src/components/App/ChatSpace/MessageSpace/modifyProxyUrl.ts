
const corsProxyURL = 'https://cors-anywhere.herokuapp.com/';
function modifyProxyUrl(url:string): string {
    return corsProxyURL + url;
}
export default modifyProxyUrl;