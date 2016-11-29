exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || (process.env.NODE_ENV === 'production' ? 'mongodb://localhost/gitchain' : 'mongodb://localhost/gitchain-dev');
exports.PORT = process.env.PORT || 8080
