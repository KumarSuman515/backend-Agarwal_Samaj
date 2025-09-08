const Candidate = require("../models/candidateModel");
const { Op } = require("sequelize"); // <-- Added: Sequelize operators for flexible queries
const nodemailer = require("nodemailer"); // <-- Added: Email sending
const {candidateInfoConvert} = require("../utils/candidateInfoConvert"); // <-- Added: Utility to normalize candidate data
const { emailText, mailHtml } = require("../utils/email"); // <-- Added: Email templates
const { buildImageUrl, handleProfilePhoto } = require("../utils/image")

exports.createCandidate = async (req, res) => {
  try {
    let candidateData = candidateInfoConvert(req); // <-- New: Normalizes input data
    console.log("dataaaa",candidateData);
    // Check if candidate already exists (by email/contact_no OR name+dob+phone from old code)
    const existingCandidate = await Candidate.findOne({
      where: {
        [Op.or]: [
          { email: candidateData.email },
          { contact_no: candidateData.contact_no },
          { 
            name: candidateData.name, // <-- Added: From old code
            dob: candidateData.dob, 
            phone: candidateData.phone 
          }
        ],
      },
    });

    if (existingCandidate) {
      // Update existing instead of error (new behavior)
      handleProfilePhoto(req, candidateData, existingCandidate);

      await Candidate.update(candidateData, { where: { id: existingCandidate.id } });
      const updatedCandidate = await Candidate.findByPk(existingCandidate.id);

      const response = updatedCandidate.toJSON();
      response.image_path = buildImageUrl(req, response.image_path);

      return res.status(200).json({
        message: "Candidate already existed; profile updated successfully",
        id: updatedCandidate.id,
        candidate: response,
      });
    }

    // Create new candidate
    handleProfilePhoto(req, candidateData);
    const candidate = await Candidate.create(candidateData);

    const response = candidate.toJSON();
    response.image_path = buildImageUrl(req, response.image_path);

    res.status(201).json({
      message: "Candidate created successfully",
      id: candidate.id,
      candidate: response,
    });
  } catch (error) {
    console.error("Error creating candidate:", error);

    // <-- New: Specific Sequelize error handling
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json(error.errors.map((err) => ({
        path: err.path, msg: err.message, value: err.value
      })));
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "A candidate with this information already exists" });
    }

    res.status(500).json({ error: "Failed to create candidate", details: error.message });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    const response = candidates.map(c => ({
      ...c.toJSON(),
      image_path: buildImageUrl(req, c.image_path), // <-- Added: absolute URL for images
    }));
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidates", details: error.message });
  }
};

exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });

    const response = candidate.toJSON();
    response.image_path = buildImageUrl(req, response.image_path); // <-- Added
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidate", details: error.message });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    let data = req.body;
    data = handleProfilePhoto(req, data); // <-- Updated logic

    const [updated] = await Candidate.update(data, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Candidate not found or no changes made" });

    const updatedCandidate = await Candidate.findByPk(req.params.id);
    const response = updatedCandidate.toJSON();
    response.image_path = buildImageUrl(req, response.image_path); // <-- Added

    res.status(200).json({ message: "Candidate updated successfully", candidate: response });
  } catch (error) {
    res.status(500).json({ error: "Failed to update candidate", details: error.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const deleted = await Candidate.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Candidate not found" });

    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete candidate", details: error.message });
  }
};


exports.sendConnectionRequest = async (req, res) => {
  console.log("connectttttt")
  try {
    const { id } = req.params;
    const { senderName, senderEmail, message } = req.body;

    if (!senderName || !senderEmail)
      return res.status(400).json({ error: "senderName and senderEmail are required" });

    const candidate = await Candidate.findByPk(id);
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });
    if (!candidate.email) return res.status(400).json({ error: "Candidate has no email" });

    // Check if SMTP configuration is available
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("SMTP configuration missing, skipping email send");
      return res.status(200).json({ 
        message: "Connection request received (email not configured)", 
        warning: "SMTP configuration is missing. Please configure email settings to send notifications." 
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const siteName = process.env.SITE_NAME || "Agarwal Samaj Matrimony";

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: candidate.email,
      replyTo: senderEmail,
      subject: `New connection request on ${siteName}`,
      text: emailText(candidate, senderName, senderEmail, message, siteName),
      html: mailHtml(candidate, senderName, senderEmail, message, siteName),
    });

    res.status(200).json({ message: "Connection request email sent" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send connection request email", details: error.message });
  }
};
