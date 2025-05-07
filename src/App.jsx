import { useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { Helmet } from 'react-helmet'

function App() {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [isBlogOpen, setIsBlogOpen] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      setFileName(droppedFile.name)
    }
  }

  const handleSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
  }

  const handleConvert = async () => {
    if (!file) return
    setIsConverting(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('https://heicdrop-backend-production-02d8.up.railway.app/convert', {
        method: 'POST',
        body: formData,
      })

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName.replace(/\.heic$/i, '.jpg')
      a.click()
      window.URL.revokeObjectURL(url)

      if (window.gtag) {
        window.gtag("event", "heic_conversion", {
          event_category: "Conversion",
          event_label: fileName,
          value: 1,
        });
      }
    } catch (err) {
      alert("Conversion failed.")
    } finally {
      setIsConverting(false)
    }
  }

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    setEmailSubmitted(true)
    e.target.reset()
  }

  const toggleBlogMenu = () => {
    setIsBlogOpen((prev) => !prev)
  }

  return (
    <>
      <Helmet>
        <title>HEIC to JPG Converter – Free, Instant & Secure | HeicDrop</title>
        <meta name="description" content="Convert your HEIC photos to JPG online – instantly, for free, and with full privacy. No installs. Works with iPhone and Mac files." />
        <meta name="keywords" content="heic to jpg, convert heic, heic converter, iphone image converter, free image converter" />
        <meta property="og:title" content="HEIC to JPG Converter – Fast, Free & Secure" />
        <meta property="og:description" content="Convert HEIC images to JPG with one click – secure, free, no uploads stored." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://heicdrop.com/" />
      </Helmet>

      <header className="py-6 border-b relative">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="w-1/3"></div>

          <div className="w-1/3 text-center">
            <a href="/" className="text-2xl font-extrabold text-blue-700">HeicDrop</a>
          </div>

          <div className="w-1/3 text-right">
            <nav className="space-x-4 text-sm font-medium text-gray-700 relative inline-block">
              <button
                onClick={toggleBlogMenu}
                className="focus:outline-none bg-white px-3 py-2 rounded hover:bg-gray-100 transition"
              >
                Blog ▾
              </button>
              {isBlogOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50"
                  onMouseLeave={() => setIsBlogOpen(false)}
                >
                  <a href="/blog/heic-to-jpg-online.html" className="block px-4 py-2 hover:bg-gray-100 text-sm">HEIC to JPG Online</a>
                  <a href="/blog/convert-heic-to-jpg-free.html" className="block px-4 py-2 hover:bg-gray-100 text-sm">Convert HEIC Free</a>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center px-4 pb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mt-12 mb-6">HEIC to JPG Converter</h1>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full max-w-xl bg-white border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center shadow-lg transition hover:bg-blue-50"
        >
          <div className="flex justify-center mb-4 text-blue-500">
            <UploadCloud size={48} />
          </div>
          <p className="text-gray-700 mb-2 text-lg font-medium">Drag & Drop your HEIC file here</p>
          <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
          <input
            type="file"
            accept=".heic"
            onChange={handleSelect}
            className="cursor-pointer text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
          {fileName && (
            <>
              <p className="mt-4 text-green-600 font-semibold">
                ✅ File selected: <span className="underline">{fileName}</span>
              </p>

              {isConverting ? (
                <div className="mt-4 text-blue-600 font-semibold flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Converting...
                </div>
              ) : (
                <button
                  onClick={handleConvert}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition"
                >
                  Convert HEIC to JPG
                </button>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl">
          <div className="border rounded-xl p-6 bg-white text-center">
            <h3 className="font-semibold mb-2">Universal Compatibility</h3>
            <p className="text-sm text-gray-600">JPEG works everywhere – on all apps, devices and platforms.</p>
          </div>
          <div className="border rounded-xl p-6 bg-white text-center">
            <h3 className="font-semibold mb-2">Easy Sharing</h3>
            <p className="text-sm text-gray-600">JPG is supported by websites, social platforms and emails.</p>
          </div>
          <div className="border rounded-xl p-6 bg-white text-center">
            <h3 className="font-semibold mb-2">Secure, Instant Conversion</h3>
            <p className="text-sm text-gray-600">Your file is converted instantly and deleted after. Private & safe.</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-6">🔒 We never store your files. Everything is processed in real time.</p>

        <div className="mt-10">
          <p className="text-md text-gray-700 font-medium">
            Want to convert multiple files at once? <span className="text-blue-600 font-semibold">Coming soon...</span>
          </p>
          <form onSubmit={handleEmailSubmit} className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-2">
            <input type="email" placeholder="Enter your email" className="px-4 py-2 border rounded-md text-sm w-64" required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">Notify Me</button>
          </form>
          {emailSubmitted && (
            <p className="text-green-600 text-sm mt-2">Thank you! We'll notify you when it's ready.</p>
          )}
        </div>
      </main>

      <footer className="text-center text-sm text-gray-500 py-6 border-t">
        <p>© {new Date().getFullYear()} HeicDrop.com — All rights reserved.</p>
      </footer>
    </>
  )
}

export default App;
