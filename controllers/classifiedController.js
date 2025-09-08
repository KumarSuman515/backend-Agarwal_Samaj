const Classified = require("../models/classifiedModel");
const { Op } = require("sequelize");

// Helper to serialize photos array to string
const serializePhotos = (files) => {
  if (!files) return null;
  // Assume photos uploaded under 'photos' field
  const filenames = files.photos ? files.photos.map(f => f.filename) : [];
  return filenames.join(",");
};

// Helper to deserialize photos string to array
const deserializePhotos = (photosString) => {
  if (!photosString) return [];
  return photosString.split(",");
};

// Create a new classified listing
exports.registerListing = async (req, res) => {
  try {
    const data = req.body;
    data.photos = serializePhotos(req.files);

    const listing = await Classified.create(data);
    res.status(201).json({ message: "Listing registered", listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register listing" });
  }
};

// Get listing approval status by user email or phone
exports.getStatus = async (req, res) => {
  try {
    const { contact } = req.params; // either phone or email for simplicity
    const listing = await Classified.findOne({
      where: { [Op.or]: [{ email: contact }, { phone: contact }] },
      attributes: ["status"],
    });
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json({ status: listing.status });
  } catch (err) {
    res.status(500).json({ error: "Error retrieving status" });
  }
};

// Search approved listings with optional filters
exports.searchListings = async (req, res) => {
  try {
    const { business_category, firm_name } = req.query;
    const filters = { status: "approved" };
    if (business_category) filters.business_category = business_category;
    if (firm_name) filters.firm_name = { [Op.like]: `%${firm_name}%` };

    const listings = await Classified.findAll({ where: filters });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Error searching listings" });
  }
};

// Get listing details by id
exports.getListingById = async (req, res) => {
  try {
    const listing = await Classified.findByPk(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: "Failed to get listing details" });
  }
};

// Admin: Approve a listing
exports.approveListing = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id; // assuming authenticated admin user id in req.user

    const [updated] = await Classified.update({
      status: "approved",
      approval_by: adminId,
      approval_date: new Date(),
    }, { where: { id, status: "pending" } });

    if (!updated) return res.status(404).json({ error: "Listing not found or not pending" });
    res.json({ message: "Listing approved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve listing" });
  }
};

// Admin: Disapprove a listing
exports.disapproveListing = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const [updated] = await Classified.update({
      status: "disapproved",
      approval_by: adminId,
      approval_date: new Date(),
    }, { where: { id, status: "pending" } });

    if (!updated) return res.status(404).json({ error: "Listing not found or not pending" });
    res.json({ message: "Listing disapproved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to disapprove listing" });
  }
};

// Admin: List pending listings
exports.getPendingListings = async (req, res) => {
  try {
    const listings = await Classified.findAll({ where: { status: "pending" } });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Failed to get pending listings" });
  }
};
