export function downloadFile(response_server) {
    const re = RegExp('filename[^;=\\n]*=(([\'"]).*?\\2|[^;\\n]*)');

    let filename = response_server.headers['content-disposition'].match(re)
    filename = filename[1].replace(/"/g, '');

    const url = window.URL.createObjectURL(new Blob([response_server.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}