import { LoginForm } from '@/components/auth/LoginForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            BMad Visual Platform
          </h1>
          <p className="text-lg text-gray-600">
            Where AI meets beautiful development
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}