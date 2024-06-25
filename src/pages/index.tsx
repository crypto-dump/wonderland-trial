import Head from 'next/head';

import { Landing } from '@/containers';

const Home = () => {
  return (
    <>
      <Head>
        <title>Wonderland Trial</title>
      </Head>
      <Landing />
    </>
  );
};

export default Home;
