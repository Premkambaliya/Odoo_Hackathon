const { getDB } = require('../../config/db');

const createSwapRequest = async (req, res) => {
  try {
    const {
      requesterEmail,
      skillOffered,
      skillRequested,
      message
    } = req.body;

    if (!requesterEmail || !skillOffered || !skillRequested) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // IST Timestamp
    const utcNow = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(utcNow.getTime() + istOffset);

    const db = getDB();

    const newRequest = {
      requesterEmail,
      skillOffered,
      skillRequested,
      message: message || '',
      targetEmail: null,
      matchedWith: null,
      status: 'pending',
      timestamp: istNow
    };

    const result = await db.collection('swapRequests').insertOne(newRequest);

    res.status(201).json({
      message: 'Swap request created successfully',
      requestId: result.insertedId
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  createSwapRequest
};
