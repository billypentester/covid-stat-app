const express = require('express')
const request = require('request')
const path = require('path')
const hbs = require('hbs')
var app = express()
const port = process.env.PORT || 3000

const statweb = path.join(__dirname, "/web")
const tempweb = path.join(__dirname, "/web/views")
const partial = path.join(__dirname, "/web/partials")

app.use(express.static(statweb))
app.set('views', tempweb);
app.set("view engine", "hbs")
hbs.registerPartials(partial)

var cn = "";

// default page

app.get('/', (req, res) => {
  res.render("index")
})

// rendering data into main page  

app.get("/index.js", (req, res) => {

  const cn = req.query.search

  if(!cn)
  {
    res.render("404", {
      found : req.url,
      text : "parameters issue"
    })
  }

  // try{
  //   function capitalizeFirstLetter(str) {
  //     const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
  //     return capitalized;
  //   }
  
  //   const c = () => {
  //     const coun = req.query.search
  //     cn =  capitalizeFirstLetter(coun)
  //   } 
  
  //   c()
  // }
  // catch(e)
  // {
  //   console.log("error")
  // }
  

  var url = 'https://disease.sh/v3/covid-19/countries/' + cn;

  if(cn)
  {
    request(url, function (error, response, body) {
      if (error) console.error('error:', error); 
      if(response) console.log('statusCode:', response && response.statusCode);
       
      try {
        var obj = JSON.parse(body)

        res.render("main", {
          name : `${obj.country}`,
          popu : `${obj.population}`,
          cont : `${obj.continent}`,
          flag : `${obj.countryInfo.flag}`,
          abbr : `${obj.countryInfo.iso2}`,
          conf : `${obj.cases}`,
          reco : `${obj.recovered}`,
          dead : `${obj.deaths}`,
          acti : `${obj.active}`,
          ncas : `${obj.todayCases}`,
          nded : `${obj.todayDeaths}`,
          nrec : `${obj.todayRecovered}`
        })

      } catch (e) {
        res.render("404", {
           found : cn,
           text : " is not a valid country name. Use proper name."
        })
      }
  
    })
  }
  else
  {
    res.render("index")
  }
  
})

// external link redirect

app.get("/billypentester.me",(req,res) => {
  res.redirect('https://github.com/billypentester')
})

// invalid pages

app.get('/*', (req, res) => {
  res.status(404)
  res.set('Content-Type', 'text/html'); 
  res.render("404", {
    found : req.url,
    text : " is not the page of this site."
  })
})

app.get('/index.js/*', (req, res) => {
  res.status(404)
  res.set('Content-Type', 'text/html');  
  res.render("404", {
    found : req.url,
    text : " is not the page of this site."
  })
})

// listening on port

app.listen(port, ()=> {
    console.log(`Server is runing on port no : ${port}`)
})



