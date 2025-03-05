import WelcomeContent from './components/welcome-content'

export default async function WelcomePage() {
  

  return (
    <div className="min-h-screen bg-white flex items-start justify-center pt-12">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <WelcomeContent />
      </div>
    </div>
  )
}

