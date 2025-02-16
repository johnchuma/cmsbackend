const getUrl = async (req) => {
  const file = req.file;
  return `https://api.hemani.io/files/${file.originalname}`;
};
module.exports = getUrl;
