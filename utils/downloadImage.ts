import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Download an image from an URL and save it to a local folder.
 * Create a new folder called public (if it doesn't exist)
 * Create a new folder based on username (if it doesn't exist) under public/
 * @param url from OpenAI
 * @param username from front-end/database
 * @returns new server URL
 */
const downloadImage = async (url: string, username: string) => {
    // http://localhost:8000/ || https://medpal-catkos.northeurope.cloudapp.azure.com/
    const baseURL = 'https://medpal-catkos.northeurope.cloudapp.azure.com/';
  
    return new Promise<string>((resolve, reject) => {
      let imageURL = baseURL;
  
      // Go up two levels
      const rootFolder = path.join(__dirname, '..', '..', 'public');
      const nameFolder = '/' + username // username as the folder name
      const folderPath = rootFolder + nameFolder;
  
      // Ensure the folder exists, if not, create a new folder
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
  
      // If filename already exists, add a number to it
      const fileType = '.png';
      let counter = 1;
      while (fs.existsSync(folderPath + '/' + counter + fileType)) {counter++;}
  
      const newFileName = counter + fileType;
      const imagePath = path.join(folderPath, newFileName);
  
      // Send an HTTP GET request to the URL
      const request = https.get(url, (response) => {
        // Create a writable stream to the local file
        const fileStream = fs.createWriteStream(imagePath);
  
        // Pipe the response stream to the local file
        response.pipe(fileStream);
  
        // Listen for the 'end' event to know when the download is complete
        fileStream.on('finish', () => {
          fileStream.close(() => {
            imageURL = imageURL + 'public/' + username + '/' + newFileName;
            console.log(`Image downloaded and saved to: ${imagePath}`);
            console.log('Image URL: ' + imageURL);
  
            // Resolve with the imageURL after the image is downloaded
            resolve(imageURL);
          });
        });
      });
  
      // Handle errors during the HTTPS request
      request.on('error', (err) => {
        console.error('Error downloading the image:', err);
        
        // Reject with the error
        reject(err);
      });
    });
  };
  
  /**
   * Get local date
   * !! NOT IN USE
   * @returns formatted local date
   */
  /*
  const getLocalDate = () => {
    const date = new Date();
  
    const options: Intl.DateTimeFormatOptions ={
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
  
    const formattedDate = date.toLocaleDateString('fi-FI', options)
      .replace(/\./g, '_'); // Replace dots with underscores
  
    console.log(formattedDate);
    return formattedDate;
  };
*/
  export { downloadImage };