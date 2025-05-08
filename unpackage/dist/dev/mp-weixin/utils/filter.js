"use strict";
function filterSqlInjection(text) {
  if (!text)
    return "";
  const sqlPattern = /('|"|;|--|\/\*|\*\/|@@|@|char|nchar|varchar|nvarchar|alter|begin|cast|create|cursor|declare|delete|drop|end|exec|execute|fetch|insert|kill|open|select|sys|sysobjects|syscolumns|table|update)/gi;
  return text.replace(sqlPattern, "").replace(/[<>]/g, "").trim();
}
function validateUsername(username) {
  if (!username || !username.trim()) {
    return { isValid: false, message: "用户名不能为空", filteredText: "" };
  }
  const filteredUsername = filterSqlInjection(username);
  if (filteredUsername.length < 3) {
    return { isValid: false, message: "用户名不能少于3个字符", filteredText: filteredUsername };
  }
  if (filteredUsername.length > 20) {
    return { isValid: false, message: "用户名不能超过20个字符", filteredText: filteredUsername };
  }
  const usernamePattern = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
  if (!usernamePattern.test(filteredUsername)) {
    return { isValid: false, message: "用户名只能包含字母、数字、下划线和中文", filteredText: filteredUsername };
  }
  const sensitiveWords = /(赌博|色情|暴力|政治|违法)/gi;
  if (sensitiveWords.test(filteredUsername)) {
    return { isValid: false, message: "用户名包含敏感词汇", filteredText: filteredUsername };
  }
  return { isValid: true, message: "", filteredText: filteredUsername };
}
function validatePassword(password) {
  if (!password) {
    return { isValid: false, message: "密码不能为空", filteredText: "" };
  }
  if (password.length < 6) {
    return { isValid: false, message: "密码不能少于6个字符", filteredText: password };
  }
  if (password.length > 20) {
    return { isValid: false, message: "密码不能超过20个字符", filteredText: password };
  }
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
  if (!passwordPattern.test(password)) {
    return { isValid: false, message: "密码必须包含至少一个字母和一个数字", filteredText: password };
  }
  return { isValid: true, message: "", filteredText: password };
}
function validateSearch(search) {
  if (!search || !search.trim()) {
    return { isValid: false, message: "搜索内容不能为空", filteredText: "" };
  }
  const filteredSearch = filterSqlInjection(search);
  if (filteredSearch.length > 10) {
    return { isValid: false, message: "搜索内容不能超过10个字符", filteredText: filteredSearch.substring(0, 10) };
  }
  const sensitiveWords = /(赌博|色情|暴力|政治|违法)/gi;
  if (sensitiveWords.test(filteredSearch)) {
    return { isValid: false, message: "搜索内容包含敏感词汇", filteredText: filteredSearch };
  }
  return { isValid: true, message: "", filteredText: filteredSearch };
}
function validateTitle(title, maxLength = 15) {
  if (!title || !title.trim()) {
    return { isValid: false, message: "标题不能为空", filteredText: "" };
  }
  const filteredTitle = filterSqlInjection(title);
  if (filteredTitle.length > maxLength) {
    return { isValid: false, message: `标题不能超过${maxLength}个字符`, filteredText: filteredTitle };
  }
  const sensitiveWords = /(赌博|色情|暴力|政治|违法)/gi;
  if (sensitiveWords.test(filteredTitle)) {
    return { isValid: false, message: "标题包含敏感词汇", filteredText: filteredTitle };
  }
  return { isValid: true, message: "", filteredText: filteredTitle };
}
function validateContent(content, minLength = 10) {
  if (!content || !content.trim()) {
    return { isValid: false, message: "内容描述不能为空", filteredText: "" };
  }
  const filteredContent = filterSqlInjection(content);
  if (filteredContent.length < minLength) {
    return { isValid: false, message: `内容描述不能少于${minLength}个字符`, filteredText: filteredContent };
  }
  const sensitiveWords = /(赌博|色情|暴力|政治|违法)/gi;
  if (sensitiveWords.test(filteredContent)) {
    return { isValid: false, message: "内容包含敏感词汇", filteredText: filteredContent };
  }
  return { isValid: true, message: "", filteredText: filteredContent };
}
function validateLocation(location) {
  if (!location || !location.trim()) {
    return { isValid: false, message: "位置不能为空", filteredText: "" };
  }
  const filteredLocation = filterSqlInjection(location);
  if (filteredLocation.length > 25) {
    return { isValid: false, message: "位置信息过长", filteredText: filteredLocation };
  }
  return { isValid: true, message: "", filteredText: filteredLocation };
}
exports.validateContent = validateContent;
exports.validateLocation = validateLocation;
exports.validatePassword = validatePassword;
exports.validateSearch = validateSearch;
exports.validateTitle = validateTitle;
exports.validateUsername = validateUsername;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/filter.js.map
