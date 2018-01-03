const fs = require('fs'),
      async = require('async'),
      request = require('request'),
      cheerio = require('cheerio'),
      Client = require('ssh2').Client,
      config = require('./json/config'),
      login = require('./json/ftp')

var upload = process.argv.length === 3

console.log('\n* Start Process *\n')

var nthPage = 0

function requestJson (nextPage) {

  nthPage ++

	var urlJson = 'http://www.liberation.fr/mapi/sections/' + config.dossier + '/contents/?format=json'
	if (nextPage) urlJson = 'http://www.liberation.fr/mapi/sections/' + config.dossier + '/contents/?page=' + nthPage + '&format=json';

	request.get({
		url: urlJson,
		json: true
	}, (err, res, json) => {
		if (err) throw err
		var titles = json.results.map(v => v.title),
        nth = titles.length

		console.log('=> Get json from folder ' + config.dossier + ' via API page ' + nthPage +'\n')
		console.log('=> Result from ' + nth + ' articles :\n')
		console.log('   * ' + titles.join('\n   * '))

		if (nth >= 20) parseJson(json.results, true)
    else parseJson(json.results, false)
	})

}
requestJson(false)

var datas = []

function parseJson (results, isNext) {

	console.log('\n=> Parse json\n')

	async.each(results, (v, callback) => {

		if (v.type == 'ARTICLE') {

			var id = v.id,
					publication_date = v.publication_date,
					photo = v.call_photo ? v.call_photo.url.split('?')[0] + '?width=975&ratio_y=2&ratio_x=3' : false,
					legende = v.call_photo ? v.call_photo.caption : false,
					credit = v.call_photo ? v.call_photo.credits : false,
					titre = v.title,
					chapo = v.subtitle,
					auteur,
					date,
					texte

			request(v.url, (err, res, html) => {
				if (err) throw err

				console.log('   * Scrap data from article ' + titre)

				var $ = cheerio.load(html)

				auteur = $('.author').find('a').html()
				date = $('.date').html()
				$('.essential').remove()
				$('.others').remove()
				$('.note').remove()
				$('.authors').remove()
				texte = $('.article-body').html()

        var articleData = {id, publication_date, photo, legende, credit, titre, chapo, auteur, date, texte}

				if (photo) {
          datas.push(articleData)

          console.log('   * Ok Push data to json')
        } else console.log('   * Nop This article don\'t have photo')

				callback()
			})

		} else callback()

	}, err => {

    if (err) throw err

    console.log('\n=> Datas of page ' + nthPage + ' have been scraped successfuly\n')

    if (isNext && (datas.length < 40)) requestJson(true)
    else writeJson()
	})

}

function writeJson () {

  console.log('\n=> All ' + datas.length + ' datas have been scraped successfuly\n')

  datas.sort((a, b) => b.publication_date - a.publication_date)

  var json = {
    slug: config.slug,
    titre: config.titre,
    chapo: config.chapo,
    auteur: config.auteur,
    articles: datas
  }

  fs.writeFile('./json/datas.json', JSON.stringify(json), err => {
    if (err) throw err
    fs.createReadStream('./json/datas.json').pipe(fs.createWriteStream('./dist/assets/datas.json'))

    console.log('=> Write file in ./json/datas.json')
    console.log('=> Copy file in  ./dist/assets/datas.json\n')
    console.log('* End Process *\n')

    if (upload) uploadJson()
  })

}

function uploadJson () {

  console.log('=> Upload json to server\n')

  var conn = new Client()

  conn.on('ready', () => {

    console.log('   * Start Client')

    conn.sftp((err, sftp) => {
        
      if (err) {
          throw err
          sftp.end()
          conn.end()
      }

      var readStreamAll = fs.createReadStream('./json/datas.json')
      var writeStreamAll = sftp.createWriteStream('./' + config.date + '/' + config.slug + '/assets/datas.json')

      writeStreamAll.on(
        'close',
        () => {
          console.log('   * File ' + config.slug + '.json transfered successfully!')

          sftp.end()
          conn.end()

          console.log('   * Stop Client')
          console.log('\n* End Process *\n')
          process.exit( 0 )
        }
      )

      readStreamAll.pipe( writeStreamAll )
    })
  }).connect(login)

}