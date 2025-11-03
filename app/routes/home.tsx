import type { Route } from './+types/home';
import { useTranslation } from 'react-i18next';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>
        Hello, world Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt, quasi officia ex iste fugit excepturi laboriosam hic iure ea cum. Eos sed eum nemo, modi quasi unde eligendi praesentium ex!
      </h1>
      <h2>
        {t('test')}
      </h2>
    </div>
  );
}
