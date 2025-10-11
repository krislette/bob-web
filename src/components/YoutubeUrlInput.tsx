import { useState } from "react";

interface YouTubeUrlInputProps {
  onUrlChange: (url: string) => void;
  disabled?: boolean;
}

function YouTubeUrlInput({
  onUrlChange,
  disabled = false,
}: YouTubeUrlInputProps) {
  const [url, setUrl] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    onUrlChange(newUrl);
  };

  return (
    <div className="w-full">
      <input
        type="url"
        value={url}
        onChange={handleChange}
        disabled={disabled}
        placeholder="https://www.youtube.com/watch?v=..."
        className={`w-full px-4 py-3 rounded-lg bg-black-lighter border-2 border-gray-700 
          text-white font-roboto placeholder-gray-500 focus:outline-none focus:border-gray-500
          transition-colors hover:border-gray-500 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
      />
    </div>
  );
}

export default YouTubeUrlInput;
