export interface PredictionResult {
  probability: number;
  label: number;
  prediction: string;
}

export interface ExplanationFeature {
  rank: number;
  modality: string;
  feature_text: string;
  weight: number;
  importance: number;
}

export interface ExplanationResult {
  prediction: {
    class: number;
    class_name: string;
    confidence: number;
    probabilities: number[];
  };
  explanations: ExplanationFeature[];
  summary: {
    total_features_analyzed: number;
    audio_features_count: number;
    lyrics_features_count: number;
    runtime_seconds: number;
    samples_generated: number;
    timestamp: string;
  };
}

export interface ApiResponse<T> {
  status: string;
  lyrics: string;
  audio_file_name: string;
  audio_content_type: string;
  audio_file_size: number;
  results: T;
}

export interface ProgressUpdate {
  status: "progress" | "complete" | "error";
  step: string;
  message: string;
  progress: number;
  results?: any;
}

// Callback type for progress updates
export type ProgressCallback = (update: ProgressUpdate) => void;

// Stream prediction with progress updates using Server-Sent Events
export async function predictWithProgress(
  file: File,
  lyrics: string,
  onProgress: ProgressCallback
): Promise<any> {
  const formData = new FormData();
  formData.append("audio_file", file);
  formData.append("lyrics", lyrics);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  return new Promise((resolve, reject) => {
    fetch(`${API_BASE_URL}/api/v1/predict/stream`, {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No reader available");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          // Decode chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE messages
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data: ProgressUpdate = JSON.parse(line.slice(6));

                // Call progress callback
                onProgress(data);

                // Handle completion
                if (data.status === "complete") {
                  resolve(data.results);
                  return;
                } else if (data.status === "error") {
                  reject(new Error(data.message));
                  return;
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }
        }
      })
      .catch(reject);
  });
}

// Stream explanation with progress updates using Server-Sent Events
export async function explainWithProgress(
  file: File,
  lyrics: string,
  onProgress: ProgressCallback
): Promise<any> {
  const formData = new FormData();
  formData.append("audio_file", file);
  formData.append("lyrics", lyrics);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  return new Promise((resolve, reject) => {
    fetch(`${API_BASE_URL}/api/v1/explain/stream`, {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No reader available");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data: ProgressUpdate = JSON.parse(line.slice(6));
                onProgress(data);

                if (data.status === "complete") {
                  resolve(data.results);
                  return;
                } else if (data.status === "error") {
                  reject(new Error(data.message));
                  return;
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }
        }
      })
      .catch(reject);
  });
}

// Export old API for backward compatibility
export const bachOrBotApi = {
  // Original methods
  predict: async (file: File, lyrics: string) => {
    const formData = new FormData();
    formData.append("audio_file", file);
    formData.append("lyrics", lyrics);

    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    const response = await fetch(`${API_BASE_URL}/api/v1/predict`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  explain: async (file: File, lyrics: string) => {
    const formData = new FormData();
    formData.append("audio_file", file);
    formData.append("lyrics", lyrics);

    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    const response = await fetch(`${API_BASE_URL}/api/v1/explain`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // New streaming methods
  predictStream: predictWithProgress,
  explainStream: explainWithProgress,
};
