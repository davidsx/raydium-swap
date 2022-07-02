import React from 'react';
import useNoti from 'store/useNoti';
import styles from './styles.module.scss';

const Notification: React.FC = () => {
    const notis = useNoti((s) => s.notis);

    return (
        <div className={styles.container}>
            {notis.map((noti) => (
                <div className={styles.notiCard} key={noti.timestamp}>
                    {noti.type === 'success' && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="limegreen"
                            aria-hidden="true"
                            className={styles.icon}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    )}
                    {noti.type === 'error' && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="red"
                            aria-hidden="true"
                            className={styles.icon}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    <div className={styles.content}>
                        {noti.type === 'success' && <div className={styles.title}>Success</div>}
                        {noti.type === 'error' && <div className={styles.title}>Error</div>}
                        <div className={styles.message}>{noti.message}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Notification;
