function getCardinalDirection(direction) {
    switch (direction) {
        case "0 1":
            return "North"
        case "0 -1":
            return "South"
        case "1 0":
            return "East"
        case "-1 0":
            return "West"
        case "-1 1":
            return "North-West"
        case "1 1":
            return "North-East"
        case "-1 -1":
            return "South-West"
        case "1 -1":
            return "South-East"
        case "0 0":
            return "(no cardinal direction)"
        default:
            return "(unknown cardinal direction)"
    }
}

module.exports = {
    getCardinalDirection
}