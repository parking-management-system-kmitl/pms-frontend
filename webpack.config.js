module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,  // ตรวจสอบไฟล์ที่มีนามสกุล .js
          enforce: 'pre',  // ทำให้โหลดก่อน loader อื่นๆ
          use: [
            {
              loader: 'source-map-loader',  // ใช้ source-map-loader
              options: {
                filterSourceMappingUrl: (url, resourcePath) => {
                  // กรอง URL ของ sourcemap
                  if (/.*\/node_modules\/.*/.test(resourcePath)) {
                    return false;  // หากเป็น node_modules ไม่ให้โหลด sourcemap
                  }
                  return true;  // อนุญาตให้โหลด sourcemap อื่นๆ
                }
              }
            }
          ]
        }
      ]
    }
  };
  