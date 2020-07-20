const request = require('request')

const geocode = (address, callback) => {
    // Use encodeURIComponent to handle addresses with special characters.
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1IjoiYnJpYW5qb2hubnljaGVuIiwiYSI6ImNrYXJhenh1ZTAweGcyeXBla3p2M2ZpZ2EifQ.ZBc7LIS_8Qe0XzsSU0a6iA&limit=1'
    request({ url: url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to location services.', undefined)
        } else if (body.features.length === 0) {
            callback('Unable to find location, try another search.', undefined)
        } else {
            // If there is no error, set error to undefined.
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = geocode