<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/krislette/bob-web">
    <img src="public/bob.png" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">Bach or Bot: Web Interface</h1>
  <p align="center">
    Interactive web application for AI-generated vs human-composed music classification
    <br />
    <a href="https://github.com/krislette/bach-or-bot"><strong>Explore the main model »</strong></a>
    <br />
    <br />
    <a href="https://bach-or-bot.vercel.app/">View Demo</a>
    ·
    <a href="https://github.com/krislette/bob-web/issues">Report Bug</a>
    ·
    <a href="https://github.com/krislette/bob-web/pulls">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

Bach or Bot Web is the frontend interface for the Bach or Bot machine learning system that classifies music as human-composed or AI-generated. This React-based web application provides an intuitive platform for users to upload audio files or input lyrics and receive real-time classification results with explainable AI insights.

<!-- TABLE OF CONTENTS -->

## Table Of Contents

<ol>
  <li>
    <a href="#about-the-project">About The Project</a>
    <ul>
      <li><a href="#table-of-contents">Table Of Contents</a></li>
      <li><a href="#features">Features</a></li>
      <li><a href="#technologies-used">Technologies Used</a></li>
    </ul>
  </li>
  <li>
    <a href="#web-snapshots">Web Snapshots</a>
  </li>
  <li>
    <a href="#installation">Installation</a>
    <ul>
      <li><a href="#prerequisites">Prerequisites</a></li>
      <li><a href="#setup">Setup</a></li>
    </ul>
  </li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#deployment">Deployment</a></li>
  <li><a href="#contributing">Contributing</a></li>
  <li><a href="#license">License</a></li>
  <li><a href="#contact">Contact</a></li>
</ol>

### Features

- **Audio File Upload**: Support for various audio formats with drag-and-drop functionality
- **Lyrics Input**: Text-based analysis for song lyrics classification
- **Real-time Results**: Instant classification with confidence scores
- **Explainable AI**: Visual explanations showing which features influenced the prediction
- **(Slightly) Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI/UX**: Clean, intuitive interface built with Tailwind CSS
- **Loading States**: Smooth loading animations and progress indicators
- **Error Handling**: Comprehensive error messages and fallback states

### Technologies Used

- **Frontend Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.6 for fast development and optimized builds
- **Styling**: Tailwind CSS 4.1.13 for utility-first styling
- **Icons**: Lucide React for consistent iconography
- **Routing**: React Router DOM 7.9.1 for client-side navigation
- **Analytics**: Vercel Analytics for usage tracking
- **Linting**: ESLint with TypeScript support
- **Containerization**: Docker for consistent deployment environments

<!-- WEB SNAPSHOTS -->

## Web Snapshots

### Landing Page

<img width="1365" height="736" alt="image" src="https://github.com/user-attachments/assets/745703da-9c8d-49f2-81c3-7718384c1841" />
<img width="1365" height="736" alt="image" src="https://github.com/user-attachments/assets/4e346231-b26f-4f9b-bfaa-635fb8d11d12" />

### Inputs
<img width="1365" height="736" alt="image" src="https://github.com/user-attachments/assets/2578c0ea-fc97-4994-a624-61d492bdce14" />
<img width="1365" height="736" alt="image" src="https://github.com/user-attachments/assets/2076d4cd-5a38-4352-a0d9-26205b527f7f" />

### Loading Screen
<img width="1365" height="737" alt="image" src="https://github.com/user-attachments/assets/952c72b2-a833-4951-8788-7ee396d42e08" />
<img width="1365" height="735" alt="image" src="https://github.com/user-attachments/assets/1ffe471a-098c-439e-b091-38c50c237810" />

### Results Page
<img width="1365" height="736" alt="image" src="https://github.com/user-attachments/assets/4163c059-3d3b-4a3c-936b-1c1f1473b719" />
<img width="1365" height="736" alt="image" src="https://github.com/user-attachments/assets/64b87f96-f2ef-4969-9761-56c40ddbf24f" />

<!-- INSTALLATION -->

## Installation

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Docker (optional, for containerized deployment)

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/krislette/bob-web.git
   cd bob-web
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Update the .env file with your backend API endpoint:

   ```bash
   VITE_API_URL=your_backend_api_url
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at http://localhost:5173

5. **Build for production**
   ```bash
   npm run build
   ```

<!-- USAGE -->

## Usage

### Multimodal Classification

1. Navigate to the main interface
2. Click on the audio upload area or drag and drop an audio file
3. Supported formats: MP3 and WAV
4. Paste or type the song lyrics in the text area
5. Click "Analyze Results" to submit
6. Wait for the analysis to complete
7. View the classification result with confidence score
8. Review the classification results and explanations

### Understanding Results

- **Classification**: Human-composed or AI-generated prediction
- **Confidence Score**: Percentage indicating model certainty
- **Explanations**: Visual breakdown of features that influenced the decision
- **Feature Importance**: Highlighted sections showing most influential elements

<!-- DEPLOYMENT -->

## Deployment

### Docker Deployment

1. **Build the Docker image**

   ```bash
   docker build -t bob-web:latest .
   ```

2. **Run the container**
   ```bash
   docker run -p 5173:5173 bob-web:latest
   ```

### Production Build with Nginx

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Use the provided nginx configuration**

   ```bash
   # Copy dist files to nginx web root
   cp -r dist/\* /var/www/html/

   # Use the provided nginx.conf for configuration
   cp nginx.conf /etc/nginx/sites-available/bob-web
   ```

### Vercel Deployment

The application is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

<!-- CONTRIBUTING -->

## Contributing

If you have a suggestion that would make this better (maybe in our UI, or some performance-related suggestion), please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your feature branch (
   git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin
   feature/AmazingFeature
   )
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

<!-- CONTACT -->

## Contact

For questions, suggestions, or collaboration inquiries, please reach out through:

- GitHub Issues: [Create an issue](https://github.com/krislette/bob-web/issues)
- Pull Requests: [Submit a PR](https://github.com/krislette/bob-web/pulls)

**Related Projects:**

- [Bach or Bot Model](https://github.com/krislette/bach-or-bot) - The main machine learning system
- [Live Demo](https://bach-or-bot-tool.vercel.app/) - Try the application online

<!-- LICENSE -->

## License

Distributed under the [MIT](https://choosealicense.com/licenses/mit/) License. See [LICENSE](LICENSE) for more information.

<p align="right">[<a href="#readme-top">Back to top</a>]</p>
