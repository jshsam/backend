
// Ping .get request business logic
const getPing = (req, res) => {
    res.status(200).send({ success: 'true' });
};

module.exports = getPing;