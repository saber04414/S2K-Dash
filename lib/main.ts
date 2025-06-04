import toast from 'react-hot-toast'
import { convertAddressToName } from './convertAddress'

const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success('Copied to clipboard')
}
const showKey = (key: string) => {
    const name = convertAddressToName(key)
    if (name != key)
        return name
    else
        return key.slice(0, 2) + '***' + key.slice(-4)
}
const showDashKey = (key: string) => {
    return key.slice(0, 2) + '***' + key.slice(-4)
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
    const date = new Date(timestamp);
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};
export { copyKey, showKey, showTaoNumber, showNumber, showTimestampToDateTime, showDashKey }
