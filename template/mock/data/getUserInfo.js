module.exports = {
  code: 0,
  message: 'success',
  data: {
    name: '@cname',
    mobile: /^1[385]\d{9}$/,
    'age|18-50': 18,
    'orders|5-10': [
      {
        id: '@id',
        from: '@county(true)', // 随机县地址
        to: '@county(true)'
      }
    ]
  }
};
