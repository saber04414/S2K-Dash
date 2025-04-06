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
export { copyKey, showKey, showTaoNumber, showNumber }
