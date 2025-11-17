import type { ComponentType } from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const ContentEN: ComponentType = () => {
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>📦 Courier delivery service</Typography>
      <Typography variant="body1" gutterBottom>
        Created for demo and educational purposes
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        🛠️ Technologies and features:
      </Typography>
      <Typography variant="body1" component="ul" gutterBottom>
        <li>
          🛣️ React Router 7 / SPA mode / Framework
        </li>
        <li>
          🗺️ Leaflet maps with custom markers and filters
        </li>
        <li>
          📟 React Material UI
        </li>
        <li>
          📈 MUI X-Charts
        </li>
        <li>
          📈 MUI X-Data-Grid with server-side pagination, filtering and sorting, autocomplete filters
        </li>
        <li>
          🗃️ MobX and Context API for state management
        </li>
        <li>
          ⚠️ Handling errors without crashing the application
        </li>
        <li>
          🫙 Request caching
        </li>
        <li>
          🌙 Light / dark theme
        </li>
        <li>
          🌐 Internationalization
        </li>
        <li>
          💽 Mock data for simulating server communication
        </li>
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        💻 Usage
      </Typography>
      <Typography variant="body1" gutterBottom>
        The project is open-source and can be used for free without any permission
      </Typography>
      <Typography variant="body1" gutterBottom>
        <Link href="https://github.com/ArtemGrachov/courier-service-admin" target="_blank">
          Admin panel source code - GitHub
        </Link>
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        🤖 AI
      </Typography>
      <Typography variant="body1" gutterBottom>
        AI was used for generating mock orders, clients, and couriers data.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        📋 Project management
      </Typography>
      <Typography variant="body1" component="ul" gutterBottom>
        <li>
          <Link href="https://tree.taiga.io/project/artemgrachov-csa-courier-service-apps/kanban" target="_blank">
            Taiga board
          </Link>
        </li>
        <li>
          <Link href="https://docs.google.com/document/d/1SMWjx2kM3-WXi1HVwcE-dlEOdhCocwNbkGo32qnf5Kk/edit?usp=sharing" target="_blank">
            Specification (Google Docs)
          </Link>
        </li>
      </Typography>
    </div>
  )
}

export default ContentEN;

