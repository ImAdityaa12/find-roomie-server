const uploadMedia = async (file) => {
  return {
    url: file.path,
    publicId: file.filename,
  };
};

module.exports = {
  uploadMedia,
};