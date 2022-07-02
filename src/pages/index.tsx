import Notification from 'components/Notification';
import SwapCard from 'components/SwapCard';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from './styles.module.scss';

const Home: NextPage = () => {
    return (
        <div className={styles.body}>
            <Head>
                <title>Raydium - Solana Swap</title>
            </Head>
            <SwapCard />
            <Notification />
        </div>
    );
};

export default Home;
