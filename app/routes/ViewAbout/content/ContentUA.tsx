import type { ComponentType } from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const ContentUA: ComponentType = () => {
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>📦 Адмінпанель | Сервіс кур'єрської доставки</Typography>
      <Typography variant="body1" gutterBottom>
        Створено з демонстративною та навчальною метою
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        🛠️ Технології, функціонал та особливості:
      </Typography>
      <Typography variant="body1" component="ul" gutterBottom>
        <li>
          🛣️ React Router 7 / SPA mode / Framework
        </li>
        <li>
          🗺️ Карти Leaflet із кастомними маркерами та фільтрами
        </li>
        <li>
          📟 React Material UI
        </li>
        <li>
          📈 MUI X-Charts
        </li>
        <li>
          📈 MUI X-Data-Grid із server-side пагінацією, фільтрами та сортуванням, а також autocomplete-фільтрами
        </li>
        <li>
          🗃️ MobX та Context API для управління станом
        </li>
        <li>
          ⚠️ Обробка помилок без падіння додатку
        </li>
        <li>
          🫙 Кешування запитів
        </li>
        <li>
          🌙 Світла / темна тема
        </li>
        <li>
          🌐 Підтримка багатомовності
        </li>
        <li>
          💽 Mock дані для симуляції роботи з сервером
        </li>
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        💻 Використання
      </Typography>
      <Typography variant="body1" gutterBottom>
        Проєкт є open-source та може бути вільно використаний іншими розробниками без дозволу.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <Link href="https://github.com/ArtemGrachov/courier-service-admin" target="_blank">
          Вихідний код адмін-панелі - GitHub
        </Link>
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        🤖 AI
      </Typography>
      <Typography variant="body1" gutterBottom>
        Штучний інтелект використано для генерації mock-даних про замовлення, клієнтів та кур'єрів.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        📋 Проєкт-менеджмент
      </Typography>
      <Typography variant="body1" component="ul" gutterBottom>
        <li>
          <Link href="https://tree.taiga.io/project/artemgrachov-csa-courier-service-apps/kanban" target="_blank">
            Дошка в Taiga
          </Link>
        </li>
        <li>
          <Link href="https://docs.google.com/document/d/1SMWjx2kM3-WXi1HVwcE-dlEOdhCocwNbkGo32qnf5Kk/edit?usp=sharing" target="_blank">
            Специфікація (Google Docs)
          </Link>
        </li>
      </Typography>
    </div>
  )
}

export default ContentUA;

