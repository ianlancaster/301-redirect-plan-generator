const json2csv = require('json2csv')
const jsonfile = require('jsonfile')
const fs = require('fs')
const csv2json = require('csvtojson')
const getClosest = require('get-closest')
const Levenshtein = require('levenshtein')

let oldUrls = []
let newUrls = []
let data = []

const convertOldUrlsToArr = () => {
  console.log('converting old urls to array')
  csv2json()
  .fromFile('./OLD_URL.csv')
  .on('json',(jsonObj)=>{
    oldUrls.push(jsonObj.OLD_URL)
  })
  .on('done',(error)=>{
    convertNewUrlsToArr()
  })
}


const convertNewUrlsToArr = () => {
  console.log('converting new urls to array')
  csv2json()
    .fromFile('./NEW_URL.csv')
    .on('json',(jsonObj)=>{
      newUrls.push(jsonObj.NEW_URL)
    })
    .on('done',(error)=>{
      matchUrls()
    })
}

const matchUrls = () => {
  console.log('matching old urls to new urls')
  const compareLevenshteinDistance = (compareTo, baseItem) => {
    return new Levenshtein(compareTo, baseItem).distance
  }

  let counter = 0

  oldUrls.forEach((oldUrl) => {
    counter++
    const newUrl = getClosest.custom(oldUrl, newUrls, compareLevenshteinDistance)
    console.log(`[${counter}/${oldUrls.length}] ${oldUrl} --> ${newUrls[newUrl]}`)
    data.push({ OLD_URL: oldUrl, NEW_URL: newUrls[newUrl] })
  })

  saveDataToCsv()
}

const saveDataToCsv = () => {
  const fields = [ 'OLD_URL', 'NEW_URL' ]
  const redirectCsv = json2csv({ data, fields })

  fs.writeFile('301-redirect-plan.csv', redirectCsv, (err) => {
    if (err) throw err
    console.log('file saved')
  })
}

convertOldUrlsToArr()
