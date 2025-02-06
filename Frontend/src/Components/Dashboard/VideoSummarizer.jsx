import { useState } from "react";
import {
  Link,
  Upload,
  Bot,
  FileVideo,
  List,
  Plus,
  Send,
  X,
  Loader2,
} from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown

const VideoSummarizer = () => {
  const [videoUrl, setVideoUrl] = useState(""); // Video URL input
  const [summary, setSummary] = useState(""); // Video summary
  const [questions, setQuestions] = useState([]); // List of generated questions
  const [isDragging, setIsDragging] = useState(false); // For drag-and-drop file upload
  const [loading, setLoading] = useState(false); // Loading state for request
  const [error, setError] = useState(""); // Error message
  const [analyzedCount, setAnalyzedCount] = useState(42); // Video analyzed count
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Selected language for analysis
  const [uploadedFile, setUploadedFile] = useState(null); // For storing the uploaded video file
  const [loadingQuestions, setLoadingQuestions] = useState(false); // Add this state

  // Handles video summary submission
  const handleSubmit = async () => {
    if (!videoUrl) return;

    setLoading(true);
    setError("");

    try {
      const summaryResponse = await axios.post(
        "http://localhost:8000/api/summarize",
        {
          url: videoUrl,
          language: selectedLanguage,
        }
      );

      setSummary(summaryResponse.data.summary);

      setAnalyzedCount((prev) => prev + 1);
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestions = async () => {
    setLoadingQuestions(true); // Start loading
    try {
      const questionsResponse = await axios.post(
        "http://localhost:8000/api/generate-questions",
        {
          url: videoUrl,
          language: selectedLanguage,
        }
      );

      const fetchedQuestions = Array.isArray(questionsResponse.data.questions)
        ? questionsResponse.data.questions
        : [];

      setQuestions(fetchedQuestions);
    } catch (questionsError) {
      console.error("Error generating questions:", questionsError);
      setQuestions([
        "What are the main points of the video?",
        "What key insights did you learn?",
        "How might this information be applied?",
        "What questions remain unanswered?",
        "What was the most surprising aspect?",
      ]);
    } finally {
      setLoadingQuestions(false); // Stop loading
    }
  };

  // Handle video file drop for upload
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setUploadedFile(file); // Store the uploaded file
      // Placeholder for file upload functionality
      alert("File upload functionality coming soon!");
    } else {
      setError("Please upload a valid video file");
    }
  };

  // Handle drag over event
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave event
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Remove a question from the list
  const removeQuestion = (indexToRemove) => {
    setQuestions(questions.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-col lg:flex-row h-[110%] bg-[#FEFCE8] dark:bg-gray-800">
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold dark:text-white text-left">
            Video Summarizer
          </h1>
          <div className="px-4 py-2 bg-[#ADFF00] rounded-lg mt-3 sm:mt-0">
            <span className="text-sm font-medium">
              Videos Analyzed: {analyzedCount}
            </span>
          </div>
        </div>

        {/* Video Input Section */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className="flex-1 p-3 rounded-lg bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600"
            />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="p-3 rounded-lg bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="auto">Auto-detect</option>
            </select>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? (
                <Upload className="w-5 h-5 animate-spin" />
              ) : (
                <Link className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`p-6 sm:p-8 border-2 border-dashed rounded-lg text-center transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <FileVideo className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-400" />
            <p className="mb-2 text-lg font-medium dark:text-white">
              Drop your video file here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">or</p>
            <button className="mt-2 px-4 py-2 bg-[#ADFF00] rounded-lg hover:bg-[#9EE800]">
              Browse Files
            </button>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white dark:bg-gray-700 rounded-lg p-5 sm:p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Summary
          </h2>
          {summary ? (
            <ReactMarkdown className="text-gray-700 dark:text-gray-200 whitespace-pre-line">
              {summary}
            </ReactMarkdown>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Bot className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2" />
              <p>Your video summary will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Questions Generator */}
      <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold dark:text-white">Questions</h2>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg"
            >
              <div className="flex justify-between items-start gap-2">
                <p className="text-sm dark:text-white">{question}</p>
                <button
                  onClick={() => removeQuestion(index)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-500 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {!questions.length && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-6">
              <button
                onClick={handleQuestions}
                disabled={loadingQuestions}
                className={`flex items-center justify-center gap-2 text-black bg-[#ADFF00] w-full rounded-xl p-3 mb-3 ${
                  loadingQuestions
                    ? "cursor-not-allowed opacity-75"
                    : "cursor-pointer hover:scale-110"
                } transition-transform duration-300 ease-in-out`}
              >
                {loadingQuestions ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Questions"
                )}
              </button>
              <p className="text-sm">
                Generate questions based on the video summary
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoSummarizer;