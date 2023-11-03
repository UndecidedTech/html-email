const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const folderPath = '/home/bran/Projects/dmg/html-email/10-24-JetMail'; // Specify the path to your folder
const outputFolder = path.join(folderPath, new Date().toISOString().split('T')[0]); // Create a folder with today's date

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(`Error reading directory: ${err}`);
    return;
  }

  files.forEach((file) => {
    if (file.endsWith('.html')) {
      const filePath = path.join(folderPath, file);
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading file: ${err}`);
        } else {
          const $ = cheerio.load(data);

          // Find the last occurrence of the specific div element
          const divToRemove = $('div:contains("This e-mail has been sent to [[EMAIL_TO]],")').last()
          .parent().parent().parent().parent().parent().parent()
          .parent().parent().parent().parent().parent().parent()
          .parent().parent().remove();


          const modifiedHTML = $.html();

          // Remove newline characters and add escape characters to double quotes
          const jsonSafeText = modifiedHTML
            .replace(/\r?\n/g, ' ')
            .replace(/"/g, '\\"');

          // Save the JSON-safe text to a new .txt file
          const outputFileName = file.replace('.html', '.txt');
          const outputPath = path.join(outputFolder, outputFileName);


          fs.writeFile(outputPath, jsonSafeText, (err) => {
            if (err) {
              console.error(`Error writing .txt file: ${err}`);
            } else {
              console.log(`Converted and saved .txt file for ${file}`);
            }
          });
        }
      });
    }
  });
});
