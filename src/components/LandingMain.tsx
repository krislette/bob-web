import { useState } from "react";
import FileUpload from "./FileUpload";
import YouTubeUrlInput from "./YoutubeUrlInput";
import LyricsUpload from "./LyricsUpload";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { bachOrBotApi } from "../api/backendService";

interface LandingMainProps {
  onLoadingChange: (isLoading: boolean) => void;
  onShowModal: (title: string, message: string, buttonText?: string) => void;
}

function LandingMain({ onLoadingChange, onShowModal }: LandingMainProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [lyrics, setLyrics] = useState("");
  const navigate = useNavigate();

  // For the file
  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    // Clear YouTube URL when file is selected
    if (file) {
      setYoutubeUrl("");
    }
  };

  // For YouTube URL
  const handleYoutubeUrlChange = (url: string) => {
    setYoutubeUrl(url);
    // Clear file when URL is entered
    if (url) {
      setSelectedFile(null);
    }
  };

  // For lyrics
  const handleLyricsChange = (lyricsText: string) => {
    setLyrics(lyricsText);
  };

  // For when the user actually clicks analyze button
  const handleAnalyze = async () => {
    // Validate input
    if ((!selectedFile && !youtubeUrl.trim()) || !lyrics.trim()) {
      onShowModal(
        "Incomplete Input",
        "Please provide either an audio file or YouTube URL, and enter the lyrics."
      );
      return;
    }

    onLoadingChange(true);

    try {
      // Determine audio source
      const audioSource = selectedFile || youtubeUrl;
      const fileName = selectedFile ? selectedFile.name : "YouTube Audio";

      // Get responses for MLP and MusicLIME from model API
      const [predictionResponse, explanationResponse] = await Promise.all([
        bachOrBotApi.predict(audioSource, lyrics),
        bachOrBotApi.explain(audioSource, lyrics),
      ]);

      // Then navigate to the /results page with the data
      navigate("/results", {
        state: {
          prediction: predictionResponse.results,
          explanation: explanationResponse.results,
          lyrics,
          fileName,
        },
      });
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error analyzing", error);
      onLoadingChange(false);
      onShowModal(
        "Analysis Failed",
        error instanceof Error
          ? error.message
          : "We couldn't analyze your music right now. Please check your connection and try again.",
        "Try Again"
      );
    }
  };

  // Check if form is valid
  const hasAudioSource = selectedFile !== null || youtubeUrl.trim().length > 0;
  const isFormValid = hasAudioSource && lyrics.trim().length > 0;

  return (
    <div className="bg-black-darker flex flex-col items-center p-4 sm:p-6 md:p-8 pb-6 md:pb-10 rounded-xl mt-4 sm:mt-6 md:mt-8 mx-auto max-w-3xl space-y-6 md:space-y-8">
      {/* Container for the audio upload portion */}
      <div className="flex flex-col space-y-2 w-full max-w-3xl">
        {/* Title */}
        <h3 className="flex flex-start font-montserrat">Audio File</h3>

        {/* File upload component - disabled when YouTube URL is entered */}
        <FileUpload
          onFileSelect={handleFileSelect}
          onShowModal={onShowModal}
          acceptedTypes="audio/*, .mp3, .wav"
          maxSize={10}
          disabled={youtubeUrl.trim().length > 0}
        />

        {/* Divider with "OR" */}
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="flex-none w-1/5 h-px bg-gray-700"></div>
          <span className="text-gray-500 font-roboto text-lg">OR</span>
          <div className="flex-none w-1/5 h-px bg-gray-700"></div>
        </div>

        {/* YouTube URL input - disabled when file is uploaded */}
        <div className="flex flex-col space-y-2">
          <h3 className="flex flex-start font-montserrat">YouTube URL</h3>
          <YouTubeUrlInput
            onUrlChange={handleYoutubeUrlChange}
            disabled={selectedFile !== null}
          />
        </div>
      </div>

      {/* Container for the lyrics input portion */}
      <div className="flex flex-col space-y-2 w-full max-w-3xl">
        {/* Title */}
        <h3 className="flex flex-start font-montserrat">Lyrics</h3>

        {/* Lyrics upload component */}
        <LyricsUpload onLyricsChange={handleLyricsChange} />
      </div>

      {/* Button */}
      <div className="flex flex-col space-y-2 w-full max-w-3xl">
        <Button onClick={handleAnalyze} disabled={!isFormValid} />
      </div>
    </div>
  );
}

export default LandingMain;
