import { useState } from "react";
import FileUpload from "./FileUpload";
import LyricsUpload from "./LyricsUpload";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import {
  predictWithProgress,
  explainWithProgress,
  type ProgressUpdate,
} from "../api/backendService";

// Props for landing main component
interface LandingMainProps {
  onLoadingChange: (isLoading: boolean) => void;
  onShowModal: (title: string, message: string, buttonText?: string) => void;
}

function LandingMain({ onLoadingChange, onShowModal }: LandingMainProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [lyrics, setLyrics] = useState("");
  const [progressData, setProgressData] = useState<{
    predict: ProgressUpdate | null;
    explain: ProgressUpdate | null;
  }>({
    predict: null,
    explain: null,
  });
  const navigate = useNavigate();

  // For the file
  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    console.log(`Selected file ${file}`);
  };

  // For lyrics
  const handleLyricsChange = (lyricsText: string) => {
    setLyrics(lyricsText);
  };

  // For when the user actually clicks analyze button
  const handleAnalyze = async () => {
    if (!selectedFile || !lyrics.trim()) {
      onShowModal(
        "Incomplete Input",
        "We couldn't analyze your music right now. Please upload an audio file and enter lyrics."
      );
      return;
    }

    onLoadingChange(true);

    try {
      // Run both streaming requests in parallel
      const [predictionResponse, explanationResponse] = await Promise.all([
        predictWithProgress(selectedFile, lyrics, (update) => {
          setProgressData((prev) => ({ ...prev, predict: update }));
        }),
        explainWithProgress(selectedFile, lyrics, (update) => {
          setProgressData((prev) => ({ ...prev, explain: update }));
        }),
      ]);

      // Then navigate to the /results page with the data
      navigate("/results", {
        state: {
          prediction: predictionResponse,
          explanation: explanationResponse,
          lyrics,
          fileName: selectedFile.name,
        },
      });
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error analyzing", error);
      onLoadingChange(false);
      onShowModal(
        "Analysis Failed",
        "We couldn't analyze your music right now. Please check your connection and try again.",
        "Try Again"
      );
    } finally {
      onLoadingChange(false);
      setProgressData({ predict: null, explain: null });
    }
  };

  // Check if both file and lyrics are provided
  const isFormValid = selectedFile !== null && lyrics.trim().length > 0;

  // Calculate overall progress (average of both)
  const overallProgress =
    progressData.predict || progressData.explain
      ? Math.round(
          ((progressData.predict?.progress || 0) +
            (progressData.explain?.progress || 0)) /
            2
        )
      : 0;

  // Determine which message to show (prioritize the one with lower progress)
  const currentMessage =
    progressData.predict && progressData.explain
      ? progressData.predict.progress <= progressData.explain.progress
        ? progressData.predict.message
        : progressData.explain.message
      : progressData.predict?.message || progressData.explain?.message || "";

  return (
    <>
      <div className="bg-black-darker flex flex-col items-center p-4 sm:p-6 md:p-8 pb-6 md:pb-10 rounded-xl mt-4 sm:mt-6 md:mt-8 mx-auto max-w-3xl space-y-6 md:space-y-8">
        {/* Container for the audio upload portion */}
        <div className="flex flex-col space-y-2 w-full max-w-3xl">
          {/* Title */}
          <h3 className="flex flex-start font-montserrat">Audio File</h3>

          {/* File upload component */}
          <FileUpload
            onFileSelect={handleFileSelect}
            onShowModal={onShowModal}
            acceptedTypes="audio/*, .mp3, .wav"
            maxSize={10}
          />
        </div>

        {/* Container for the lyrics input portion */}
        <div className="flex flex-col space-y-2 w-full max-w-3xl">
          {/* Title */}
          <h3 className="flex flex-start font-montserrat">Lyrics</h3>

          {/* File upload component */}
          <LyricsUpload onLyricsChange={handleLyricsChange} />
        </div>

        {/* Button */}
        <div className="flex flex-col space-y-2 w-full max-w-3xl">
          <Button onClick={handleAnalyze} disabled={!isFormValid} />
        </div>
      </div>

      {(progressData.predict || progressData.explain) && (
        <div className="fixed inset-0 bg-black-darkest bg-opacity-95 flex items-center justify-center z-50">
          <div className="bg-black-darker rounded-xl p-8 max-w-lg w-full mx-4 space-y-8 border border-gray-800">
            {/* Cassette Tape Animation */}
            <div className="flex justify-center">
              <Loader />
            </div>

            {/* Main Title and Progress */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white font-montserrat">
                  Analyzing Your Music
                </h3>
                <span className="text-3xl font-bold text-white">
                  {overallProgress}%
                </span>
              </div>

              {/* Overall Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-custom to-blue-500 h-full transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>

              {/* Current Message */}
              <p className="text-gray-300 text-center font-poppins text-lg min-h-[28px]">
                {currentMessage}
              </p>
            </div>

            {/* Detailed Progress Section */}
            <div className="space-y-4 border-t border-gray-700 pt-6">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Pipeline Progress
              </h4>

              {/* Prediction Progress */}
              {progressData.predict && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-poppins">
                      🎼 Classification
                    </span>
                    <span className="text-blue-custom font-semibold">
                      {progressData.predict.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-custom h-full transition-all duration-300"
                      style={{ width: `${progressData.predict.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 italic">
                    {progressData.predict.message}
                  </p>
                </div>
              )}

              {/* Explanation Progress */}
              {progressData.explain && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-poppins">
                      🔍 Explainability Analysis
                    </span>
                    <span className="text-purple-400 font-semibold">
                      {progressData.explain.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-purple-500 h-full transition-all duration-300"
                      style={{ width: `${progressData.explain.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 italic">
                    {progressData.explain.message}
                  </p>
                </div>
              )}
            </div>

            {/* Info Note */}
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 border-t border-gray-800 pt-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                This may take several minutes. Please don't close this window.
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LandingMain;
