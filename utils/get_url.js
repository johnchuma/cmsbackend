const getUrl = async (req) => {
  const file = req.file;
  return `https://api.hakiki.co/files/${file.originalname}`;
};
module.exports = getUrl;
