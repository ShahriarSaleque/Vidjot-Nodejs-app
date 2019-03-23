if(process.env.NODE_ENV === 'production') {
 module.exports = {mongoURI : 'mongodb://Shahriar:shahriar1234@ds121636.mlab.com:21636/vidjot-prod'}
} else{
 module.exports = {mongoURI : 'mongodb://localhost/Vidjot-dev-2'}
}