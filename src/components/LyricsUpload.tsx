import { useState } from "react";

// Props for the lyrics upload
interface LyricsUploadProps {
  onLyricsChange: (lyrics: string) => void;
}

function LyricsUpload({ onLyricsChange }: LyricsUploadProps) {
  const [lyrics, setLyrics] = useState("");

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLyrics(value);
    onLyricsChange(value);
  };

  return (
    <div className="w-full space-y-3">
      {/* Instruction for users */}
      <p className="text-sm text-gray-400 text-left">
        Enter lyrics line by line to improve accuracy. Each line should contain
        one lyrical phrase or verse.
      </p>

      {/* Text area for lyrics input */}
      <textarea
        value={lyrics}
        onChange={handleTextAreaChange}
        className="border-color border-2 border-gray-700 w-full min-h-48 sm:min-h-52 md:min-h-60 rounded-lg bg-black-dark
          text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:border-gray-500 
          hover:border-gray-500 p-3 sm:p-4"
        placeholder="For example:
Just one more tear to cry
One teardrop from my eye
You better save it for
The middle of the night
When things aren't black and white
Enter, Troubadour
'Remember twenty-four?'
And when I'm back in Chicago, I feel it
Another version of me, I was in it
I wave goodbye to the end of beginning
This song has started now
And you're just finding out
Now isn't that a laugh?
A major sacrifice
But clueless at the time
Enter, Caroline
'Just trust me, you'll be fine'
And when I'm back in Chicago, I feel it
Another version of me, I was in it
I wave goodbye to the end of beginning
(Goodbye, goodbye, goodbye, goodbye)
You take the man out of the city, not the city out the man
You take the man out of the city, not the city out the man
You take the man out of the city, not the city out the man
You take the man out of the-
And when I'm back in Chicago, I feel it
Another version of me, I was in it
Oh, I wave goodbye to the end of beginning
(Goodbye, goodbye)"
      />
    </div>
  );
}

export default LyricsUpload;
