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

// Get API base URL from env
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const bachOrBotApi = {
  async predict(
    audioSource: File | string,
    lyrics: string
  ): Promise<ApiResponse<PredictionResult>> {
    const formData = new FormData();
    formData.append("lyrics", lyrics);

    // Check if audioSource is a File or string
    if (typeof audioSource === "string") {
      // It's a YouTube URL
      formData.append("youtube_url", audioSource);
    } else {
      // It's a File
      formData.append("audio_file", audioSource);
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/predict`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Prediction failed: ${response.statusText}`
      );
    }

    return response.json();
  },

  async explain(
    audioSource: File | string,
    lyrics: string
  ): Promise<ApiResponse<ExplanationResult>> {
    const formData = new FormData();
    formData.append("lyrics", lyrics);

    // Check if audioSource is a File or string
    if (typeof audioSource === "string") {
      // It's a YouTube URL
      formData.append("youtube_url", audioSource);
    } else {
      // It's a File
      formData.append("audio_file", audioSource);
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/explain`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Explanation failed: ${response.statusText}`
      );
    }

    return response.json();
  },
};
