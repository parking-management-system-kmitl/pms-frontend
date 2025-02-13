const path = require('path');

module.exports = {
  // Entry point ของโปรเจค
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/, // หาไฟล์ .js
        loader: 'source-map-loader', // ใช้ loader นี้
        enforce: 'pre', // ประมวลผลก่อนที่จะทำการโหลดไฟล์อื่นๆ
        exclude: /node_modules/, // ข้ามการประมวลผลไฟล์ใน node_modules
      },
      // เพิ่ม rules อื่นๆ ที่จำเป็นสำหรับโปรเจค
    ],
  },
  devtool: 'source-map', // ทำให้ Webpack สร้าง source map สำหรับไฟล์ที่คุณเขียนเอง
};
