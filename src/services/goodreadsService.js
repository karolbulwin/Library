const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('app:goodreadsService');
const chalk = require('chalk');

const parser = xml2js.Parser({ explicitArray: false });

function goodreadsService() {
  function getBookById(author, title) {
    return new Promise((resolve, reject) => {
      const yourKey = ''; // get it form Goodreads
      const authorToArray = author.split(' ');
      const authorLast = authorToArray[authorToArray.length - 1];
      const newTitle = title.replace(/ /g, '+');

      debug(chalk.red('GoodreadsService'));
      axios.get(`https://www.goodreads.com/book/title.xml?author=${authorLast}&key=${yourKey}&title=${newTitle}`)
        .then((response) => {
          parser.parseString(response.data, (err, result) => {
            if (err) {
              debug(err);
            } else {
              debug(result);
              resolve(result.GoodreadsResponse.book);
            }
          });
        })
        .catch((error) => {
          reject(error);
          debug(error);
        });
    });
  }

  return { getBookById };
}

module.exports = goodreadsService();
