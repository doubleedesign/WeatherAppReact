/**
 * Utility function to convert a temperature between C and F
 * @param temp
 * @param unitsFrom
 * @param unitsTo
 * @returns {number}
 */
export function convertTemperature(temp: number, unitsFrom: string, unitsTo: string) {
    let newTemp = temp;

    if (unitsFrom === 'C' && unitsTo === 'F') {
        newTemp = Math.round((temp * 1.8) + 32);
    } else if (unitsFrom === 'F' && unitsTo === 'C') {
        newTemp = Math.round((temp - 32) * 0.5556);
    }

    return newTemp;
}

/**
 * Utility function to convert the day number to its 3-letter abbreviation
 * @param number
 * @returns {string}
 */
export function getDayAbbrev(number: number) {
    let day = '';
    switch (number) {
        case 0:
            day = 'Sun';
            break;
        case 1:
            day = 'Mon';
            break;
        case 2:
            day = 'Tue';
            break;
        case 3:
            day = 'Wed';
            break;
        case 4:
            day = 'Thu';
            break;
        case 5:
            day = 'Fri';
            break;
        case 6:
            day = 'Sat';
            break;
        default:
            break;
    }

    return day;
}

/**
 * Utility function to get a random integer in a range
 * @param min
 * @param max
 * @returns {number}
 */
export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Function to prompt for geolocation to load initial data
 * Ref: https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API/Using_the_Permissions_API
 * Ref: https://stackoverflow.com/a/45422800
 * Ref: https://stackoverflow.com/a/57829970
 */
export async function getInitialLocation() {
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    return new Promise((resolve, reject) => {
        navigator.permissions
            .query({
                name: "geolocation"
            })
            .then(function (result) {
                if (result.state === "granted" || result.state === "prompt") {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            resolve(position);
                        },
                        (error) => {
                            reject(error);
                        },
                        options
                    );
                } else if (result.state === "denied") {
                    return false;
                }
            });
    });
}