import Button from "./Button";
import ConfidenceBar from "./ConfidenceBar";
import ResultPill from "./ResultPill";
import { useNavigate } from "react-router-dom";
import AudioExplanation from "./AudioExplanation";
import LyricsExplanation from "./LyricsExplanation";

// Props for the main result body component
interface ResultsMainProps {
  prediction?: any;
  explanation?: any;
  lyrics?: string;
  fileName?: string;
}

function ResultsMain({ prediction, explanation, fileName }: ResultsMainProps) {
  const navigate = useNavigate();

  const confidenceScore = Math.round(prediction?.probability || 0);
  const classification = prediction?.label || "Unknown";

  const handleAnalyze = () => {
    // Just navigate back to landing page
    navigate("/");
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-black-darker flex flex-col items-center p-4 sm:p-6 md:p-8 pb-6 md:pb-10 rounded-xl mt-4 sm:mt-6 md:mt-8 mx-auto max-w-3xl space-y-6 md:space-y-8">
      {/* Main result indicator pill */}
      <ResultPill classification={classification} />

      {/* Confidence container */}
      <div className="w-full max-w-3xl space-y-3">
        <ConfidenceBar
          percentage={confidenceScore}
          label="Confidence"
          classification={classification}
        />
      </div>

      {/* File name display - personal additiones */}
      {fileName && (
        <p className="text-sm text-gray-400">
          Analysis results for: <span className="text-white">{fileName}</span>
        </p>
      )}

      {/* Result caption */}
      <p className="text-justify max-w-3xl">
        This song was classified as <strong>{classification}</strong> because
        certain lyrics and audio segments closely matched patterns commonly
        found in
        {classification === "AI-Generated"
          ? " AI-generated songs."
          : " human-composed songs."}{" "}
        The top contributing factors are shown below:
      </p>

      {/* Lyrics XAI Results */}
      <LyricsExplanation
        features={
          explanation?.explanations?.filter(
            (f: any) => f.modality === "lyrics"
          ) || []
        }
        classification={classification}
      />

      {/* Audio XAI Reults */}
      <AudioExplanation
        features={
          explanation?.explanations?.filter(
            (f: any) => f.modality === "audio"
          ) || []
        }
        classification={classification}
      />

      {/* Button */}
      <div className="flex flex-col space-y-2 w-full max-w-3xl">
        <Button onClick={handleAnalyze} disabled={false} />
      </div>
    </div>
  );
}

export default ResultsMain;
