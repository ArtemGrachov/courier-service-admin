# Courier Delivery Service Admin Panel App

## Features
- 🛣️ React Router 7 / SPA mode / Framework
- 🗺️ Leaflet maps with custom markers and filters
- 📟 React Material UI
- 📈 MUI X-Charts
- 📈 MUI X-Data-Grid with server-side pagination, filtering and sorting, autocomplete filters
- 🗃️ MobX and Context API for state management
- ⚠️ Handling errors without crashing the application
- 🫙 Request caching
- 🌙 Light / dark theme
- 🌐 Internationalization
- 💽 Mock data for simulating server communication

## Setup

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

