const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

console.log(__dirname)
console.log(path.join(__dirname, '../public'))

// Set up app as a webserver.
const app = express()
const port = process.env.PORT || 3000

// Define paths for Express configuration.
// Point to the public directory containing all of the static pages.
const publicDirectoryPath = path.join(__dirname, '../public')
// Point to the public directory containing all of the dynamic pages.
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set up handlebars engine and views location.
app.set('view engine', 'hbs')
app.set('views', viewsPath) // Customize views location.
hbs.registerPartials(partialsPath)

// Set up static directory to serve.
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    // Render retrieves the view and renders it as html.
    res.render('index', {
        title: 'HBS app',
        name: 'JiaoWei'
    })
})

app.get('/about', (req, res) => {
    // Render retrieves the view and renders it as html.
    res.render('about', {
        title: 'About',
        name: 'JiaoZaiWei'
    })
})

app.get('/help', (req, res) => {
    // Render retrieves the view and renders it as html.
    res.render('help', {
        title: 'Help',
        helpText: 'This is some helpful text.',
        name: 'Brian Chen'
    })
})

// Specify what the server should do if someone tries to get the resource at a specific URL.
// Set up a second route.
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        res.send({
            error: 'You must provide a valid address.'
        })
    } else {
        geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
            if (error) {
                return res.send({ error: error })
            }

            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({ error })
                }

                res.send({
                    forecast: forecastData,
                    location: location,
                    address: req.query.address
                })
            })
        })
    }
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        // Use return here to stop the function, b/c response cannot send twice. Can use else block too.
        return res.send({
            error: 'You must provide a search term.'
        })
    }

    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 help',
        name: 'Brian Chen',
        errorMessage: 'Help article not found.'
    })
})

// * = match anything that has not been matched so far. This app.get needs to be last because routes are matched in chronological order.
app.get('*', (req, res) => {
    res.render('404', {
        title:'404',
        name: 'Brian Chen',
        errorMessage: 'Page not found.'
    })
})

// Start the server up.
app.listen(port, () => {
    console.log('Server is up on port', port) // Will not appear on the browser end, will only appear in the dev console.
})