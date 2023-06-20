import Head from "next/head";
import styles from '../styles/Home.module.css'
import Web3Modal from 'web3modal'
import { useEffect, useRef, useState } from "react";
import { providers } from "ethers";

export default function Home() {
    const web3modal = useRef()
    const [ens, setEns] = useState(null)
    const [address, setAddress] = useState(null)
    const [connectWallet, setConnectWallet] = useState(false)

    const addressOrENS = async (address, web3provider) => {
        const _ens = await web3provider.lookupAddress(address)
        if (_ens) {
            setEns(_ens)
        } else {
            setAddress(address)
        }
    }

    const getSignerOrProvider = async () => {
        const provider = await web3modal.current.connect()
        const web3provider = new providers.Web3Provider(provider)
        const { chainId } = await web3provider.getNetwork()
        if (chainId !== 5) {
            alert('Switch chain to Goerli')
            throw new Error('Switch chain to Goerli')
        }

        const signer = web3provider.getSigner()
        const address = await signer.getAddress()

        await addressOrENS(address, web3provider)
        return signer
    }

    const connectingWallet = async () => {
        try {
            await getSignerOrProvider()
            setConnectWallet(true)
        } catch (err) {
            console.error(err);
        }
    }

    const renderButton = () => {
        if (connectWallet) {
            <div>Wallet connected</div>;
        } else {
            return (
                <button onClick={connectingWallet} className={styles.button}>
                    Connect your wallet
                </button>
            );
        }
    };

    useEffect(() => {
        if (!connectWallet) {
            web3modal.current = new Web3Modal({
                network: "goerli",
                disableInjectedProvider: false,
                providerOptions: false
            })
            connectingWallet()
        }
    }, [])

    return <div>
        <Head>
            <title>ENS Dapp</title>
            <meta name="description" content="ENS-Dapp" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.main}>
            <div>
                <h1 className={styles.title}>
                    Welcome to LearnWeb3 Punks {ens ? ens : address}!
                </h1>
                <div className={styles.description}>
                    {/* Using HTML Entities for the apostrophe */}
                    It&#39;s an NFT collection for LearnWeb3 Punks.
                </div>
                {renderButton()}
            </div>
            <div>
                <img className={styles.image} src="./learnweb3punks.png" />
            </div>
        </div>

        <footer className={styles.footer}>
            Made with &#10084; by LearnWeb3 Punks
        </footer>
    </div>
}