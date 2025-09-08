function buildImageUrl(req, imagePath) {
  if (!imagePath || imagePath === "default-profile.jpg") return "default-profile.jpg";
  if (imagePath.startsWith("http")) return imagePath;
  return `${req.protocol}://${req.get("host")}/uploads/${imagePath}`;
}

function handleProfilePhoto(req, candidateData, existingCandidate = null) {
  if (req.files?.profilePhoto) {
    candidateData.image_path = req.files.profilePhoto[0].filename;
  } else if (!existingCandidate?.image_path) {
    candidateData.image_path = "default-profile.jpg";
  }
  return candidateData;
}

module.exports = {buildImageUrl,handleProfilePhoto}