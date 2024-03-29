# EnglishExercices

This project is a personal project which I made in order to learn how create a website, deploy it and connect different users.

This project consists in a set of multiple English Exercices/Games to help learn some vocabulary online.

You can use it in [**THIS**](https://englishexercices.onrender.com) link

As an extra, it includes some files which process an excel file to obtain the variables as jsons and update them into the MongoDB database.

## Development

It consists on a both server and client-side programming web service, which is (partially) responsive.

For some exercice, as it's needed, it allows you to play with some other player using **RESTFUL** services.

**It's is recommendable to play it in a PC browser** service since, as commented previously, the responsiveness is not working optimally.

## Languages and more

- [NODE.JS]
- [HTML]
- [CSS]
- [EXPRESS]
- [MONGODB]

Other packages/modules/libraries used:

- [P5]
- [SOCKET.IO]
- [PATH]
- [SERVE-FAVICON]
- [DOTENV]
- [UNDERSCORE]
- [FS]
- [PYTHON] (only for the extra files)

## Features

It includes:

- A login system
- 6 Units + an All Units option
- 10 exercices:
  - **Words Search Puzzle** - Search the words in the soup
  - **Crossword** - Solve the interlaced words
  - **What did you hear** - Oral understanding
  - **Image Description** -Write what you see in the image
  - **Multiple Choice** -Choose between different options in order to complete the sentence correctly
  - **Grouping** - Group the words into their adequated theme
  - **Select the image** - Pair the image with its word
  - **Hanged** - Guess the word before the man in hanged
  - **Pictionary** - By turns try to guess what the other player is drawing or try to draw the word he/she have to guess
  - ~~There's still one space for another game which I'm still working on~~

## Usage

If you want to modify it on your own your are free to do it, I only ask for a mention if it's the case.

Remember to create your env file with the key to your MongoDB database in the CONNECTION_URL variable.

And modify the code necesary to make it work.

Good Luck!

## Extras

In this project there is also:

- **updateExcel2JSON.py**: reads an Excel file and transforms it's variables into JSON files.
- **updateCrosswordGrid**: read an excel file in a form of a grid (for the crosswords exercice) and transform it a json file containing an array of arrays, mantaining the structure of the grid.
- **updateMongDB**: read the json files obtained from the previous codes, and sent them into the database collection.

  [node.js]: https://nodejs.org
  [html]: https://www.w3schools.com/html/
  [css]: https://www.w3schools.com/css/
  [express]: http://expressjs.com
  [mongodb]: https://www.mongodb.com
  [p5]: https://p5js.org/
  [socket.io]: https://socket.io/
  [path]: https://nodejs.org/api/path.html
  [serve-favicon]: https://www.npmjs.com/package/serve-favicon
  [dotenv]: https://www.npmjs.com/package/dotenv
  [underscore]: https://underscorejs.org/
  [fs]: https://nodejs.org/api/fs.html
  [python]: https://www.python.org/
