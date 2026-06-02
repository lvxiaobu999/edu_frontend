const MenuIcon: string[] = []
Object.keys(import.meta.glob('./menu-icon-*.svg', { eager: true })).forEach(path => {
  // 步骤1：去掉所有路径分隔符（/、\），只保留最后一段文件名
  const fileName = path.split(new RegExp('[\\\\/]')).pop() // 结果：menu-icon-dashboard.svg

  // 步骤2：去掉文件后缀（.svg），只保留名称部分
  const name = fileName!.split('.').slice(0, -1).join('.')
  MenuIcon.push(name)
})
export { MenuIcon }
