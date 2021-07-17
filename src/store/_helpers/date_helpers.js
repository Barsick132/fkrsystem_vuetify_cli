export function filterMoney(money_string) {
    if (money_string || money_string === 0) {
        let money = parseFloat(money_string);
        return money.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'});
    }
    return null;
}


// Выдает локальную дату dd.MM.yyyy
export function filterDtLocalFromISO(dt_string) {
    if (!dt_string)
        return dt_string;

    const dt = new Date(dt_string);
    return dt.toLocaleDateString('ru-RU', {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}

// Выдает полную локальную дату dd.MM.yyyy, mm:HH:ss
export function filterBeautifulDtLocalFromISO(dt_string) {
    if (!dt_string)
        return dt_string;

    const dt = new Date(dt_string);
    return dt.toLocaleDateString('ru-RU', {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })
}