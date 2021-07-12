// Выдает полную локальную дату dd.MM.yyyy, mm:HH:ss
export function filterFullDtLocalFromISO(dt_string) {
    const dt = new Date(dt_string);
    return dt.toLocaleString();
}

// Выдает полную локальную дату dd.MM.yyyy, mm:HH:ss
export function filterBeautifulDtLocalFromISO(dt_string) {
    const dt = new Date(dt_string);
    return dt.toLocaleDateString('ru-RU', {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })
}