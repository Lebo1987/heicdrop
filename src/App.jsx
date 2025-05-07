import { useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { Helmet } from 'react-helmet'

function App() {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [openFAQ, setOpenFAQ] = useState(null)
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [showBlogMenu, setShowBlogMenu] = useState(false)

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
    } catch (err) {
      alert('Conversion failed.')
    } finally {
      setIsConverting(false)
    }
  }

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    setEmailSubmitted(true)
    e.target.reset()
  }

  const faqs = [
    { question: 'What is a HEIC file?', answer: 'HEIC (High Efficiency Image Container) is an image format used by Apple to reduce file sizes without sacrificing quality.' },
    { question: 'Why convert HEIC to JPG?', answer: 'JPG is the most widely supported image format across all devices, platforms, and browsers. Converting ensures compatibility.' },
    { question: 'Is the conversion secure?', answer: 'Yes. Your file is processed instantly on our server and deleted automatically after download. We don’t store any files.' },
    { question: 'Can I convert multiple files?', answer: 'Currently, we support one file at a time. Want bulk conversion? Let us know!' },
  ]

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

      <header className="py-6 border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="w-full text-center">
            <a href="/" className="text-3xl font-extrabold text-blue-700">HeicDrop</a>
          </div>
          <div className="absolute right-4">
            <nav className="flex items-center space-x-6 text-sm font-medium text-gray-700">
              <a href="/">Home</a>
              <div className="relative">
                <button onClick={() => setShowBlogMenu(!showBlogMenu)} className="focus:outline-none">Blog ▾</button>
                {showBlogMenu && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50"
                    onMouseLeave={() => setShowBlogMenu(false)}
                  >
                    <a href="/blog/heic-to-jpg-online.html" className="block px-4 py-2 hover:bg-gray-100 text-sm">HEIC to JPG Online</a>
                    <a href="/blog/convert-heic-to-jpg-free.html" className="block px-4 py-2 hover:bg-gray-100 text-sm">Convert HEIC Free</a>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-white text-gray-800 font-sans">
        <section className="text-center py-14 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">Convert HEIC to JPG</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Instantly convert Apple’s HEIC images to JPG format. Fast, free & private.</p>
        </section>

        <section className="flex justify-center px-4 pb-16">
          <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="w-full max-w-xl bg-white border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center shadow-lg hover:bg-blue-50">
            <div className="flex justify-center mb-4 text-blue-500">
              <UploadCloud size={48} />
            </div>
            <p className="text-gray-700 mb-2 text-lg font-medium">Drag & Drop your HEIC file here</p>
            <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
            <input type="file" accept=".heic" onChange={handleSelect} className="cursor-pointer text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" />
            {fileName && (
              <>
                <p className="mt-4 text-green-600 font-semibold">✅ File selected: <span className="underline">{fileName}</span></p>
                {isConverting ? (
                  <div className="mt-4 text-blue-600 font-semibold flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-blue-600" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Converting...
                  </div>
                ) : (
                  <button onClick={handleConvert} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition">
                    Convert HEIC to JPG
                  </button>
                )}
              </>
            )}
          </div>
        </section>

        <section className="bg-white py-12 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-8">Why Convert HEIC to JPEG?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-xl p-6 bg-white">
                <h3 className="font-semibold mb-2">Universal Compatibility</h3>
                <p className="text-sm text-gray-600">JPEG works everywhere – on all apps, devices and platforms.</p>
              </div>
              <div className="border rounded-xl p-6 bg-white">
                <h3 className="font-semibold mb-2">Easy Sharing</h3>
                <p className="text-sm text-gray-600">JPG is supported by websites, social platforms and emails.</p>
              </div>
              <div className="border rounded-xl p-6 bg-white">
                <h3 className="font-semibold mb-2">Secure, Instant Conversion</h3>
                <p className="text-sm text-gray-600">Your file is converted instantly and deleted after. Private & safe.</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-6">🔒 We never store your files. Everything is processed in real time.</p>
            <div className="mt-10">
              <p className="text-md text-gray-700 font-medium">Want to convert multiple files at once? <span className="text-blue-600 font-semibold">Coming soon...</span></p>
              <form onSubmit={handleEmailSubmit} className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-2">
                <input type="email" placeholder="Enter your email" className="px-4 py-2 border rounded-md text-sm w-64" required />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">Notify Me</button>
              </form>
              {emailSubmitted && (<p className="text-green-600 text-sm mt-2">Thank you! We'll notify you when it's ready.</p>)}
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 border rounded-lg overflow-hidden">
              <button onClick={() => toggleFAQ(index)} className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 font-medium text-gray-800">
                {faq.question}
              </button>
              {openFAQ === index && <div className="px-4 py-3 bg-white text-gray-700 text-sm border-t">{faq.answer}</div>}
            </div>
          ))}
        </section>
      </main>
    </>
  )
}

export default App
