import bcrypt from 'bcryptjs'

async function generateHash(password: string) {
  const hash = await bcrypt.hash(password, 10)
  console.log('Password:', password)
  console.log('Hash:', hash)
}

// 为测试账号生成密码
generateHash('admin')
generateHash('manager')
generateHash('user') 