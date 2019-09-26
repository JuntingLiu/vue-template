module.exports = {
  rules: {
    'color-no-invalid-hex': true, // 不允许使用非法的十六进制颜色值
    'color-hex-case': 'lower', // 不允许颜色值大写
    'unit-whitelist': ['em', 'rem', '%', 's', 'px', 'deg'], // 允许使用的度量单位
    'at-rule-no-unknown': [
      true,
      { 'ignoreAtRules': ['mixin', 'extend', 'content', 'include'] }
    ]
  }
};
