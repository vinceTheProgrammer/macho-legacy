function getSignOfNumber(num) {
    if (num > 0)
        return 1
    else if (num < 0)
        return -1
    else
        return 0
}

module.exports = {
    getSignOfNumber
}