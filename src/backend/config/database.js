const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB připojeno úspěšně');
  } catch (error) {
    console.error('Chyba připojení k MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;