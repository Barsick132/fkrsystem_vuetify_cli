export async function downloadFile(response_server) {
    if (response_server.headers['content-type'] !== 'application/json') {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([response_server.data]));
        link.download = getFileNameFromHeader(response_server);
        link.click();
        URL.revokeObjectURL(link.href);
    } else {
        response_server = JSON.parse(await response_server.data.text());
        throw response_server;
    }
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

export function exportHtmlTable(table, file_name = 'exportTable') {
    let tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";

    for (let j = 0; j < table.rows.length; j++) {
        tab_text = tab_text + table.rows[j].innerHTML + "</tr>";
    }

    tab_text = tab_text + "</table>";
    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params
    tab_text = tab_text.replace(/&nbsp;₽/g, "");

    const link = document.createElement('a');
    link.href = 'data:application/vnd.ms-excel,' + encodeURIComponent(tab_text);
    link.download = file_name + '.xls';
    link.click();
    URL.revokeObjectURL(link.href);
}