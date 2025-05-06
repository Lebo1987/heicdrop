import { useState } from 'react';
import { UploadCloud, ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet';

function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setFileName(droppedFile.name);
    }
  };

  const handleSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsConverting(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('https://heicdrop-backend-production-02d8.up.railway.app/convert', {
        method: 'POST',
        body: formData,
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.replace(/\.heic$/i, '.jpg');
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Conversion failed.");
    } finally {
      setIsConverting(false);
    }
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setEmailSubmitted(true);
    e.target.reset();
  };

  const faqs = [
    { question: 'What is a HEIC file?', answer: 'HEIC is an image format used by Apple to save space without losing quality.' },
    { question: 'Why convert HEIC to JPG?', answer: 'JPG is supported by all devices, browsers, and platforms. It’s more compatible.' },
    { question: 'Is the conversion secure?', answer: 'Yes. Files are converted instantly and not stored on our servers.' },
    { question: 'Can I convert multiple files?', answer: 'Currently no. But multi-file support is coming soon.' },
  ];

  return (
    <>
      <Helmet>
        <title>HEIC to JPG Converter – Free, Instant & Secure | HeicDrop</title>
        <meta name="description" content="Convert your HEIC photos to JPG online – instantly, for free, and with full privacy." />
        <meta name="keywords" content="heic to jpg, convert heic, heic converter, iphone image converter, free image converter" />
        <meta property="og:title" content="HEIC to JPG Converter – Fast, Free & Secure" />
        <meta property="og:description" content="Convert HEIC images to JPG with one click – secure, free, no uploads stored." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://heicdrop.com/" />
      </Helmet>

      <div className="min-h-screen bg-white text-gray-800 font-sans">
        <header className="border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-blue-700">HeicDrop</a>
            <nav className="space-x-6 text-sm font-medium">
              <a href="/" className="hover:text-blue-600">Home</a>
              <a href="#convert" className="hover:text-blue-600">HEIC to JPEG</a>
              <span className="relative group">
                <span className="cursor-pointer hover:text-blue-600">Blog ▾</span>
                <div className="absolute hidden group-hover:block bg-white border rounded shadow-md mt-1 w-48">
                  <a href="/blog/heic-to-jpg-online.html" className="block px-4 py-2 hover:bg-gray-100 text-sm">HEIC to JPG Online</a>
                  <a href="/blog/convert-heic-to-jpg-free.html" className="block px-4 py-2 hover:bg-gray-100 text-sm">Convert HEIC Free</a>
                </div>
              </span>
            </nav>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-12 text-center" id="convert">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">Convert HEIC to JPG</h1>
          <p className="text-lg text-gray-600 mb-8">Instantly convert Apple’s HEIC images to JPG format. Fast, free & private.</p>

          <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="border-2 border-dashed border-blue-300 rounded-xl p-8 bg-white shadow hover:bg-blue-50 transition">
            <UploadCloud className="mx-auto text-blue-500 mb-4" size={48} />
            <p className="text-gray-700 font-medium">Drag & Drop your HEIC file here</p>
            <p className="text-sm text-gray-500">or click to browse files</p>
            <input type="file" accept=".heic" onChange={handleSelect} className="mt-4 cursor-pointer" />

            {fileName && (
              <div className="mt-4">
                <p className="text-green-600">✅ File: {fileName}</p>
                {isConverting ? (
                  <p className="text-blue-600 mt-2 animate-pulse">Converting...</p>
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
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                  >
                    Convert HEIC to JPG
                  </button>
                )}
              </div>
            )}
          </div>
        </main>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          {faqs.map((faq, i) => (
            <div key={i} className="mb-4">
              <button onClick={() => toggleFAQ(i)} className="w-full flex justify-between items-center px-4 py-3 border rounded-md bg-gray-50 hover:bg-gray-100">
                <span className="text-left font-medium">{faq.question}</span>
                <ChevronDown className={`transition-transform ${openFAQ === i ? 'rotate-180' : ''}`} />
              </button>
              {openFAQ === i && (
                <div className="px-4 pt-2 text-sm text-gray-600 border-l border-r border-b rounded-b-md bg-white">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </section>

        <footer className="text-center text-sm text-gray-500 py-6 border-t">
          <p>© {new Date().getFullYear()} HeicDrop.com — All rights reserved.</p>
          <p className="mt-2">
            <a href="/blog/heic-to-jpg-online.html" className="text-blue-600 hover:underline mx-2">HEIC to JPG Online</a> |
            <a href="/blog/convert-heic-to-jpg-free.html" className="text-blue-600 hover:underline mx-2">Convert HEIC Free</a>
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
