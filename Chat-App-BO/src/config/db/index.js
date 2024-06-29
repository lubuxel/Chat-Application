
const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://chat-app:cuoctrochuyentinhcum@cluster0.aq1nchk.mongodb.net/chat-app');
        console.log('Connect successfully');
    } catch (error) {
        console.log('Connect failure');
    }
}

module.exports = { connect };