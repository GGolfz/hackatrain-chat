const convert1DigitTo2Digit = (n: string) => {
    const text = '0' + n
    return text.substring(text.length - 2, text.length)
}
const formatTime = (time: string) => {
    const date = new Date(time);
    return convert1DigitTo2Digit(date.getHours().toString()) + ":" + convert1DigitTo2Digit(date.getMinutes().toString());
};

export { formatTime }