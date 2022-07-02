import Notification from 'components/Notification';
import SwapCard from 'components/SwapCard';
import type { NextPage } from 'next';
import styles from './styles.module.scss';

const Home: NextPage = () => {
    return (
        <div className={styles.body}>
            <SwapCard />
            <Notification />
        </div>
    );
};

export default Home;
