const sharp = require('sharp');
const redirect = require('./redirect');

function compress(req, res, input) {
  const format = req.params.webp ? 'webp' : 'jpeg';
  const quality = req.params.quality; // Directly use the validated quality from proxy.js
  const grayscale = req.params.grayscale; // Ensure grayscale is a boolean
  const width = parseInt(req.params.width, 10) || null; // Width is optional
  const height = parseInt(req.params.height, 10) || null; // Height is optional

  sharp(input)
    .resize(width, height, {
      fit: sharp.fit.inside, // Maintain aspect ratio
      withoutEnlargement: true, // Prevent enlargement beyond original size
    })
    .grayscale(grayscale)
    .toFormat(format, {
      quality: quality,
      progressive: true, // Apply progressive for JPEG
      optimizeScans: true, // Optimize image scan processing
      chromaSubsampling: '4:4:4', // Avoid chroma subsampling to retain color details
    })
    .withMetadata(false) // Strip metadata to reduce file size
    .toBuffer((err, output, info) => {
      if (err || !info || res.headersSent) {
        return redirect(req, res); // Redirect if there's an error or headers are already sent
      }

      // Set response headers
      res.setHeader('content-type', `image/${format}`);
      res.setHeader('content-length', info.size);
      res.setHeader('x-original-size', req.params.originSize);
      res.setHeader('x-bytes-saved', req.params.originSize - info.size);
      res.status(200).send(output);
    });
}

module.exports = compress;
