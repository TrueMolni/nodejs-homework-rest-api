const { ctrlWrapper } = require("../utils");

const { Contact } = require("../models/contact");

const { HttpError } = require("../helpers");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite = false } = req.query;

  const skip = (page - 1) * limit;
  const query = favorite === undefined ? { owner } : { owner, favorite };

  const result = await Contact.find(query, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "name email");

  res.json(result);
};

const getById = async (req, res) => {
  const { contactId } = req.params;

  const result = await Contact.findById(contactId);

  if (!result) {
    throw HttpError(404, `Not found contact with ${contactId}`);
  }

  return res.json(result);
};

const addMyContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpError(404, `contact with ${contactId} not found`);
  }

  res.json({
    message: "Contact deleted",
  });
};

const updateTheContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `contact with ${contactId} not found`);
  }
  res.json(result);
};

const updateTheFavorite = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `contact with ${contactId} not found`);
  }
  res.json(result);
};

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getById: ctrlWrapper(getById),
  addMyContact: ctrlWrapper(addMyContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateTheContact: ctrlWrapper(updateTheContact),
  updateTheFavorite: ctrlWrapper(updateTheFavorite),
};
