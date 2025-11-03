import Box from '@mui/material/Box';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  return (
    <Box component="main">
      <div>
        <h1>
          Hello, world Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt, quasi officia ex iste fugit excepturi laboriosam hic iure ea cum. Eos sed eum nemo, modi quasi unde eligendi praesentium ex!
        </h1>
      </div>
    </Box>
  );
}
