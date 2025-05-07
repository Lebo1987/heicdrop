import { useState } from 'react'
import { UploadCloud, ChevronDown } from 'lucide-react'
import { Helmet } from 'react-helmet'

function App() {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [openFAQ, setOpenFAQ] = useState(null)
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [isConverting, setIsConverting] = useState(false)

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
      alert("Conversion failed.")
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
    {
      question: 'What is a HEIC file?',
      answer:
        'HEIC (High Efficiency Image Container) is an image format used by Apple to reduce file sizes without sacrificing quality.',
    },
    {
      question: 'Why convert HEIC to JPG?',
      answer:
        'JPG is the most widely supported image format across all devices, platforms, and browsers. Converting ensures compatibility.',
    },
    {
      question: 'Is the conversion secure?',
      answer:
        'Yes. Your file is processed instantly on our server and deleted automatically after download. We don’t store any files.',
    },
    {
      question: 'Can I convert multiple files?',
      answer:
        'Currently, we support one file at a time. Want bulk conversion? Let us know!',
    },
    {
      question: 'Learn more about HEIC and JPG formats',
      answer:
        'You can read more about HEIC at Apple\'s official page (https://support.apple.com/en-us/HT207022) and about JPEG at Wikipedia (https://en.wikipedia.org/wiki/JPEG).',
    },
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

      <div className="min-h-screen bg-white text-gray-800 font-sans">
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
          <div className="text-2xl font-extrabold text-blue-700">HeicDrop</div>
          <nav className="space-x-6 text-sm">
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
            <a href="#convert" className="text-gray-700 hover:text-blue-600 font-medium">HEIC to JPEG</a>
            <span className="relative group">
              <span className="text-gray-700 font-medium cursor-pointer">Blog ▾</span>
              <div className="absolute hidden group-hover:block bg-white shadow-lg mt-2 rounded-md p-2 z-10">
                <a href="/blog/heic-to-jpg-online.html" className="block text-sm text-gray-700 hover:text-blue-600 px-2 py-1">HEIC to JPG Online</a>
                <a href="/blog/convert-heic-to-jpg-free.html" className="block text-sm text-gray-700 hover:text-blue-600 px-2 py-1">Convert HEIC Free</a>
              </div>
            </span>
          </nav>
        </header>

        <main className="px-4 pt-10 pb-20 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">Convert HEIC to JPG</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">Instantly convert Apple’s HEIC images to JPG format. Fast, free & private.</p>

          <div
            id="convert"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="bg-white border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center shadow-lg hover:bg-blue-50"
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
                  <button
                    onClick={() => {
                      handleConvert();
                      if (window.gtag) {
                        window.gtag("event", "heic_conversion", {
                          event_category: "Conversion",
                          event_label: fileName,
                          value: 1,
                        });
                      }
                    }}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition"
                  >
                    Convert HEIC to JPG
                  </button>
                )}
              </>
            )}
          </div>

          <h2 className="text-2xl font-bold mt-16 mb-6">Frequently Asked Questions</h2>
          <div className="text-left space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-md">
                <button onClick={() => toggleFAQ(index)} className="w-full px-4 py-3 text-left flex justify-between items-center font-medium">
                  {faq.question}
                  <ChevronDown className={`transition-transform ${openFAQ === index ? 'rotate-180' : ''}`} />
                </button>
                {openFAQ === index && <div className="px-4 pb-4 text-sm text-gray-600">{faq.answer}</div>}
              </div>
            ))}
          </div>

          <form onSubmit={handleEmailSubmit} className="mt-16 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-2 border rounded-md text-sm" required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">Notify Me</button>
          </form>
          {emailSubmitted && <p className="text-green-600 text-sm mt-2">Thank you! We'll notify you when it's ready.</p>}
        </main>
      </div>
    </>
  )
}

export default App
