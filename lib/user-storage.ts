// Shared user storage for the application
// In production, this should be replaced with a proper database

interface User {
  id: string
  name: string
  email: string
  phone?: string
  password: string
  createdAt: string
  updatedAt?: string
  lastLogin?: string
  isActive: boolean
  provider: string
}

// In-memory user storage (shared across all API routes)
const users: User[] = []

export class UserStorage {
  static addUser(user: User): void {
    users.push(user)
    console.log(`✅ User added to storage: ${user.email} (Total users: ${users.length})`)
  }

  static findUserByEmail(email: string): User | undefined {
    const normalizedEmail = email.toLowerCase().trim()
    const user = users.find((u) => u.email === normalizedEmail)
    console.log(`🔍 Looking for user: ${normalizedEmail}, Found: ${!!user}`)
    return user
  }

  static findUserById(id: string): User | undefined {
    return users.find((u) => u.id === id)
  }

  static updateUser(id: string, updates: Partial<User>): User | undefined {
    const userIndex = users.findIndex((u) => u.id === id)
    if (userIndex === -1) return undefined

    users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() }
    console.log(`✅ User updated: ${users[userIndex].email}`)
    return users[userIndex]
  }

  static getAllUsers(): User[] {
    return [...users] // Return a copy to prevent direct manipulation
  }

  static getUserCount(): number {
    return users.length
  }

  static deleteUser(id: string): boolean {
    const userIndex = users.findIndex((u) => u.id === id)
    if (userIndex === -1) return false

    const deletedUser = users.splice(userIndex, 1)[0]
    console.log(`🗑️ User deleted: ${deletedUser.email}`)
    return true
  }

  // Debug method to log all users
  static debugLogUsers(): void {
    console.log("📊 Current users in storage:")
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email}) - ID: ${user.id}`)
    })
    console.log(`Total: ${users.length} users`)
  }
}

export type { User }
