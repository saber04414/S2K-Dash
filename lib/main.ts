import toast from 'react-hot-toast'

const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success('Copied to clipboard')
}
const showKey = (key: string) => {
    return key.slice(0, 4) + '***' + key.slice(-4)
}
const showTaoNumber = (number: number) => {
    const taoNumber = number / 1e9
    return parseFloat(taoNumber.toString()).toFixed(2)
}
const showNumber = (number: number, unit: number) => {
    if (number)
        return parseFloat(number.toString()).toFixed(unit)
    else
        return '0'
}

const showTimestampToDateTime = (timestamp: number): string => {
    console.log({ timestamp })
    const date = new Date(timestamp);
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());

    return `${year}-${month}-${day} ${hour}:${minute}`;
};
export { copyKey, showKey, showTaoNumber, showNumber, showTimestampToDateTime }
