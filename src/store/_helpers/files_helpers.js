export function downloadFile(response_server) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([response_server.data]));
    link.download = getFileNameFromHeader(response_server);
    link.click();
    URL.revokeObjectURL(link.href);
}

function getFileNameFromHeader(response_server) {
    const re = RegExp('filename[^;=\\n]*=(([\'"])(.*?)\\2|[^;\\n]*)(; filename\\*=utf-8\'\'(.*))?$');

    let filename = response_server.headers['content-disposition'].match(re)
    if (filename)
        filename = decodeURI(filename[5] ? filename[5] : filename[1]);
    else
        filename = 'unknown_file_name'

    return filename;
}